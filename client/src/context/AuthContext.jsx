import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/ui/Toast.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Realtime: initialize Echo when user logs in
  const queryClient = useQueryClient();
  const toast = useToast();
  useEffect(() => {
    if (!user || !token) return;

    // Skip real-time setup if Pusher key is not configured
    const pusherKey = import.meta.env.VITE_PUSHER_KEY;
    if (!pusherKey) return;

    let echo = null;

    (async () => {
      try {
        const Echo = (await import("laravel-echo")).default;
        const Pusher = (await import("pusher-js")).default;
        // attach Pusher to window as Echo expects it
        window.Pusher = Pusher;

        echo = new Echo({
          broadcaster: "pusher",
          key: pusherKey,
          cluster: import.meta.env.VITE_PUSHER_CLUSTER || undefined,
          forceTLS: import.meta.env.VITE_PUSHER_FORCE_TLS === "true" || true,
          auth: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        const channel = echo.private(`user.${user.id}`);
        channel.listen("AppointmentCompleted", (payload) => {
          // invalidate appointment lists / counts for relevant roles
          queryClient.invalidateQueries({
            predicate: (q) => q.queryKey?.[0] === "doctor-appointments",
          });
          queryClient.invalidateQueries({
            predicate: (q) => q.queryKey?.[0] === "doctor-appointments-counts",
          });
          queryClient.invalidateQueries({
            predicate: (q) => q.queryKey?.[0] === "patient-appointments",
          });
          queryClient.invalidateQueries({
            predicate: (q) => q.queryKey?.[0] === "patient-prescriptions",
          });
          console.info("Realtime: appointment completed", payload);
          try {
            const time = payload.slot_at
              ? new Date(payload.slot_at).toLocaleString()
              : "";
            const message = `Appointment ${payload.appointment_id} ${payload.status} ${time}`;
            toast?.show?.(message, {
              title: "Appointment update",
              duration: 6000,
            });
          } catch (e) {
            console.warn(e);
          }
        });
      } catch (e) {
        console.warn("Realtime setup failed", e);
      }
    })();

    return () => {
      try {
        echo?.disconnect();
      } catch {}
      try {
        if (window.Pusher) window.Pusher = undefined;
      } catch {}
    };
  }, [user, token, queryClient, toast]);

  const login = ({ token: t, user: u }) => {
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
