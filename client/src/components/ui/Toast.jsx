import React, { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = toasts.map((t) => {
      if (!t.duration) return null;
      return setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, t.duration);
    });
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [toasts]);

  const show = (message, options = {}) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, ...options }]);
    return id;
  };

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show, remove }}>
      {children}

      <div style={{ position: "fixed", right: 20, top: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              marginBottom: 12,
              minWidth: 240,
              background: "white",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              padding: "12px 14px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {t.title || "Notification"}
              </div>
              <div style={{ fontSize: 13, marginTop: 4, color: "#334155" }}>
                {t.message}
              </div>
            </div>
            <button
              onClick={() => remove(t.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
