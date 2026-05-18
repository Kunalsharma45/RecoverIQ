import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import api from "../../lib/api.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Accepted" },
  { key: "in_progress", label: "In Progress" },
  { key: "cancelled", label: "Rejected" },
  { key: "completed", label: "Completed" },
];

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

export default function DoctorAppointments() {
  const queryClient = useQueryClient();
  // Default to 'confirmed' so dashboard upcoming appointments appear here
  const [activeTab, setActiveTab] = useState("confirmed");
  const [selected, setSelected] = useState(null);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [presAppointment, setPresAppointment] = useState(null);
  const [diag, setDiag] = useState("");
  const [presNotes, setPresNotes] = useState("");
  const [nextVisit, setNextVisit] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration_days: "" },
  ]);
  const [markComplete, setMarkComplete] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [programId, setProgramId] = useState("");
  const [notes, setNotes] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const appointmentsQuery = useQuery({
    queryKey: ["doctor-appointments", activeTab],
    queryFn: async () => {
      const res = await api.get("/doctor/appointments", {
        params: { status: activeTab },
      });
      // API may return paginated { data: [...] } or direct array — handle both
      return res.data?.data ?? res.data ?? [];
    },
  });

  const countsQuery = useQuery({
    queryKey: ["doctor-appointments-counts"],
    queryFn: async () => {
      const res = await api.get("/doctor/appointments-counts");
      return res.data || {};
    },
    staleTime: 5000,
  });

  const programsQuery = useQuery({
    queryKey: ["doctor-programs"],
    queryFn: async () => {
      const res = await api.get("/doctor/programs");
      return res.data || [];
    },
  });

  const updateAppointment = useMutation({
    mutationFn: async ({ id, status, notes: statusNotes }) => {
      const res = await api.patch(`/doctor/appointments/${id}`, {
        status,
        notes: statusNotes,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "doctor-appointments",
      });
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "doctor-appointments-counts",
      });
    },
  });

  const createPatient = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/doctor/patients", payload);
      return res.data;
    },
    onSuccess: (data) => {
      setModalMessage(
        data?.message ||
          "Patient account successfully created. Credentials have been emailed securely.",
      );
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "doctor-appointments",
      });
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "doctor-appointments-counts",
      });
      // close modal and reset form fields
      setSelected(null);
      setPatientName("");
      setPatientEmail("");
      setProgramId("");
      setNotes("");
    },
  });

  const handleAccept = async (appointment) => {
    // First mark the appointment as confirmed
    try {
      await updateAppointment.mutateAsync({ id: appointment.id, status: 'confirmed' });
    } catch (e) {
      console.warn('Accept failed', e);
      setModalMessage('Failed to accept appointment.');
      return;
    }
    // Then open the patient creation modal
    setSelected(appointment);
    setPatientName(appointment.booked_by_name || "");
    setPatientEmail(appointment.booked_by_email || "");
    setModalMessage("");
  };

  const handleReject = (appointment) => {
    updateAppointment.mutate({ id: appointment.id, status: "cancelled" });
  };

  const submitCreatePatient = async (e) => {
    e.preventDefault();
    if (!selected) return;

    // Basic client-side validation
    if (!patientName.trim() || !patientEmail.trim()) {
      setModalMessage("Please provide patient name and email.");
      return;
    }

    if (!programId) {
      setModalMessage("Please select a rehabilitation program.");
      return;
    }

    try {
      await createPatient.mutateAsync({
        name: patientName.trim(),
        email: patientEmail.trim(),
        program_id: Number(programId),
        appointment_id: selected.id,
      });
    } catch (err) {
      // Show validation errors from server (Laravel returns errors in err.response.data.errors)
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors) {
        const first = Object.values(serverErrors)[0];
        setModalMessage(Array.isArray(first) ? first[0] : String(first));
      } else if (err?.response?.data?.message) {
        setModalMessage(err.response.data.message);
      } else {
        setModalMessage("Unable to create patient. Please try again.");
      }
      return;
    }

    try {
      await updateAppointment.mutateAsync({
        id: selected.id,
        status: "confirmed",
        notes,
      });
    } catch (err) {
      setModalMessage("Patient created but updating appointment failed.");
    }
  };

  const programs = useMemo(
    () => programsQuery.data || [],
    [programsQuery.data],
  );

  const openPrescription = (appointment) => {
    setPresAppointment(appointment);
    setPrescriptionOpen(true);
    setDiag("");
    setPresNotes("");
    setNextVisit("");
    setMedicines([{ name: "", dosage: "", duration_days: "" }]);
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    if (!presAppointment) return;
    try {
      const payload = {
        diagnosis: diag,
        notes: presNotes,
        next_visit_date: nextVisit,
        medicines: medicines.filter((m) => m.name),
        complete: markComplete,
      };
      await api.post(
        `/doctor/appointments/${presAppointment.id}/prescription`,
        payload,
      );
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "doctor-appointments",
      });
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "doctor-appointments-counts",
      });
      setPrescriptionOpen(false);
      alert("Prescription saved.");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Unable to save prescription");
    }
  };

  const updateMedicine = (idx, key, value) => {
    const copy = [...medicines];
    copy[idx][key] = value;
    setMedicines(copy);
  };

  const addMedicineRow = () =>
    setMedicines((prev) => [
      ...prev,
      { name: "", dosage: "", duration_days: "" },
    ]);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-6">
        <h2 className="serif-heading text-3xl">Appointments</h2>
        <p className="mt-2 text-[var(--textSoft)]">
          Review requests and start new recovery journeys.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-5 py-2 text-sm border transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-[var(--softLime)] border-[var(--primaryGreen)]"
                : "bg-white border-[var(--borderSoft)]"
            }`}
          >
            <span className="mr-2">{tab.label}</span>
            <span className="inline-flex items-center justify-center min-w-[26px] h-6 px-2 rounded-full text-xs font-medium bg-white/90 border border-[var(--borderSoft)]">
              {countsQuery.data ? (countsQuery.data[tab.key] ?? 0) : "–"}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(appointmentsQuery.data || []).map((appointment) => (
          <motion.div
            key={appointment.id}
            className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6 hover:-translate-y-1 transition-all duration-500"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="serif-heading text-2xl text-[var(--textDark)]">
                  {appointment.booked_by_name || "New patient"}
                </h3>
                <p className="text-sm text-[var(--textSoft)]">
                  {appointment.booked_by_email}
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

            <p className="mt-4 text-sm text-[var(--textSoft)]">
              Status: {appointment.status}
            </p>

            {appointment.problem_description && (
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Problem Description
                </p>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{appointment.problem_description}"
                </p>
              </div>
            )}

            {appointment.notes && (
              <p className="mt-3 text-sm text-[var(--textSoft)]">
                Notes: {appointment.notes}
              </p>
            )}

            {activeTab === "pending" && (
              <div className="mt-5 flex gap-3">
                <Button onClick={() => handleAccept(appointment)}>
                  Accept
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleReject(appointment)}
                >
                  Reject
                </Button>
              </div>
            )}

            {appointment.status === "confirmed" && (
              <div className="mt-3 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateAppointment.mutate({
                      id: appointment.id,
                      status: "in_progress",
                    })
                  }
                >
                  Start
                </Button>
              </div>
            )}

            {appointment.status === "in_progress" && (
              <div className="mt-3 flex gap-3">
                <Button
                  onClick={() =>
                    updateAppointment.mutate({
                      id: appointment.id,
                      status: "completed",
                    })
                  }
                >
                  Complete
                </Button>
              </div>
            )}

            {(appointment.status === "in_progress" ||
              appointment.status === "confirmed") && (
              <div className="mt-4 flex gap-3">
                <Button onClick={() => openPrescription(appointment)}>
                  Add Prescription
                </Button>
              </div>
            )}
          </motion.div>
        ))}

        {(appointmentsQuery.data || []).length === 0 && (
          <div className="rounded-[32px] bg-white/70 border border-[var(--borderSoft)] shadow-lg p-8 text-[var(--textSoft)]">
            No appointments in this category yet.
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-w-2xl w-full rounded-[40px] bg-white p-8 shadow-2xl border border-[var(--borderSoft)]">
            <div className="flex items-center justify-between">
              <h3 className="serif-heading text-3xl">Create Patient Account</h3>
              <button
                type="button"
                className="text-[var(--textSoft)]"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-[var(--textSoft)]">
              Generate credentials and assign a rehabilitation program.
            </p>

            {selected.problem_description && (
              <div className="mt-4 p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
                  Patient's Problem Description
                </p>
                <p className="text-sm text-emerald-800 leading-relaxed italic">
                  "{selected.problem_description}"
                </p>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={submitCreatePatient}>
              <Input
                placeholder="Patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
              <Input
                placeholder="Patient email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
              />

              <select
                className="w-full rounded-full bg-white/80 border border-[#D9E1D7] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#256B52]/20"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
              >
                <option value="">Select rehabilitation program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.duration_days} days)
                  </option>
                ))}
              </select>

              <textarea
                rows={3}
                className="w-full rounded-[24px] bg-white/80 border border-[#D9E1D7] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#256B52]/20"
                placeholder="Recovery notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  createPatient.isPending || updateAppointment.isPending
                }
              >
                {createPatient.isPending || updateAppointment.isPending
                  ? "Creating..."
                  : "Create Patient + Accept"}
              </Button>

              {modalMessage && (
                <div className="rounded-[24px] bg-[var(--softLime)] border border-[var(--borderSoft)] px-4 py-3 text-sm text-[var(--textDark)]">
                  {modalMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {prescriptionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="max-w-3xl w-full bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Add Prescription</h3>
              <button onClick={() => setPrescriptionOpen(false)}>Close</button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={submitPrescription}>
              <Input
                placeholder="Diagnosis"
                value={diag}
                onChange={(e) => setDiag(e.target.value)}
              />
              <textarea
                className="w-full rounded-lg p-3 border"
                placeholder="Notes"
                value={presNotes}
                onChange={(e) => setPresNotes(e.target.value)}
              />
              <div>
                <label className="block text-sm mb-2">Next visit date</label>
                <input
                  type="date"
                  value={nextVisit}
                  onChange={(e) => setNextVisit(e.target.value)}
                  className="rounded-lg p-2 border"
                />
              </div>

              <div>
                <h4 className="font-semibold">Medicines</h4>
                {medicines.map((m, idx) => (
                  <div key={idx} className="flex gap-2 mt-2">
                    <input
                      className="flex-1 rounded-lg p-2 border"
                      placeholder="Name"
                      value={m.name}
                      onChange={(e) =>
                        updateMedicine(idx, "name", e.target.value)
                      }
                    />
                    <input
                      className="w-36 rounded-lg p-2 border"
                      placeholder="Dosage"
                      value={m.dosage}
                      onChange={(e) =>
                        updateMedicine(idx, "dosage", e.target.value)
                      }
                    />
                    <input
                      className="w-28 rounded-lg p-2 border"
                      placeholder="Days"
                      value={m.duration_days}
                      onChange={(e) =>
                        updateMedicine(idx, "duration_days", e.target.value)
                      }
                    />
                  </div>
                ))}

                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addMedicineRow}
                  >
                    Add Medicine
                  </Button>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={markComplete}
                    onChange={(e) => setMarkComplete(e.target.checked)}
                  />
                  <span className="text-sm">Mark appointment as completed</span>
                </label>
              </div>

              <div className="mt-4">
                <Button type="submit">Save Prescription</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
