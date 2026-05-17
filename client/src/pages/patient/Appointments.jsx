import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import api from "../../lib/api.js";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
const formatTime = (value) =>
  new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function PatientAppointments() {
  const [prescription, setPrescription] = useState(null);
  const [presLoading, setPresLoading] = useState(false);

  const appointmentsQuery = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: async () => {
      const res = await api.get("/patient/appointments");
      return res.data || [];
    },
  });

  const appointments = appointmentsQuery.data || [];

  const viewPrescription = async (id) => {
    setPresLoading(true);
    try {
      const res = await api.get(`/patient/prescriptions/${id}`);
      setPrescription(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load prescription");
    } finally {
      setPresLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-6">
        <h2 className="serif-heading text-3xl">Appointments</h2>
        <p className="mt-2 text-[var(--textSoft)]">
          Your upcoming recovery sessions and follow-ups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="serif-heading text-2xl text-[var(--textDark)]">
                  {appointment.doctor?.user?.name || "Doctor"}
                </div>
                <p className="text-sm text-[var(--textSoft)]">
                  Status: {appointment.status}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-[var(--textSoft)]">
                  {formatDate(appointment.slot_at)}
                </div>
                <div className="text-sm font-medium text-[var(--textDark)]">
                  {formatTime(appointment.slot_at)}
                </div>
              </div>
            </div>

            {appointment.prescription && (
              <div className="mt-3">
                <button
                  className="rounded-full px-4 py-2 bg-[var(--primaryGreen)] text-white"
                  onClick={() => viewPrescription(appointment.prescription.id)}
                  disabled={presLoading}
                >
                  {presLoading ? "Loading..." : "View Prescription"}
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {appointments.length === 0 && (
          <div className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-8 text-[var(--textSoft)]">
            No upcoming appointments yet.
          </div>
        )}
      </div>

      {prescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-2xl w-full bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Prescription</h3>
              <button onClick={() => setPrescription(null)}>Close</button>
            </div>

            <div className="mt-4">
              <p>
                <strong>Diagnosis:</strong> {prescription.diagnosis}
              </p>
              <p>
                <strong>Notes:</strong> {prescription.notes}
              </p>
              <p>
                <strong>Next visit:</strong>{" "}
                {prescription.next_visit_date || "N/A"}
              </p>

              <h4 className="mt-4 font-semibold">Medicines</h4>
              <ul className="list-disc ml-6">
                {(prescription.medicines || []).map((m) => (
                  <li key={m.id}>
                    {m.name} — {m.dosage} —{" "}
                    {m.duration_days
                      ? m.duration_days + " days"
                      : "duration N/A"}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <a
                  href={URL.createObjectURL(
                    new Blob([JSON.stringify(prescription, null, 2)], {
                      type: "application/json",
                    }),
                  )}
                  download={`prescription-${prescription.id}.json`}
                  className="rounded-full px-4 py-2 bg-blue-600 text-white"
                >
                  Download JSON
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
