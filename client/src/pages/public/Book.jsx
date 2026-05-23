import React, { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion as Motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowRight, Star } from "lucide-react";
import api from "../../lib/api.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function Book() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slotAt, setSlotAt] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  const doctorsQuery = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await api.get("/doctors");
      return res.data || [];
    },
  });

  const slotsQuery = useQuery({
    queryKey: ["doctor-slots", selectedDoctor?.id],
    queryFn: async () => {
      if (!selectedDoctor?.id) return [];
      const res = await api.get(`/doctors/${selectedDoctor.id}/slots`);
      return res.data?.available_slots || [];
    },
    enabled: Boolean(selectedDoctor?.id),
  });

  const bookingMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/appointments/public", payload);
      return res.data;
    },
    onSuccess: () => {
      setSlotAt("");
      setName("");
      setEmail("");
      setConfirmEmail("");
      setProblemDescription("");
      setSelectedDate("");
      setSelectedDoctor(null);
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor?.id || !slotAt) return;
    bookingMutation.mutate({
      booked_by_name: name,
      booked_by_email: email,
      booked_by_email_confirmation: confirmEmail,
      doctor_id: selectedDoctor.id,
      slot_at: slotAt,
      problem_description: problemDescription,
    });
  };

  // Fallback doctors if DB is empty for demo purposes, else use real DB data
  const realDoctors = doctorsQuery.data || [];
  // Do not show hardcoded demo doctors — reflect DB state
  const doctorCards = realDoctors.length ? realDoctors : [];

  const slotsByDate = useMemo(() => {
    const list = slotsQuery.data || [];
    return list.reduce((acc, slot) => {
      const date = slot.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {});
  }, [slotsQuery.data]);

  const availableDates = useMemo(() => Object.keys(slotsByDate), [slotsByDate]);

  const visibleSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slotsByDate[selectedDate] || [];
  }, [selectedDate, slotsByDate]);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[var(--mutedWhite)] font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--softLime)]/30 blur-[150px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute top-40 left-[-200px] w-[500px] h-[500px] bg-[var(--lavender)]/30 blur-[150px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <div className="mb-16 max-w-2xl">
          <Motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-serif leading-[1] tracking-tight text-[var(--textDark)] mb-6"
          >
            Start your{" "}
            <span className="italic font-light text-[var(--primaryGreen)]">
              recovery.
            </span>
          </Motion.h1>
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#5C6B63] leading-relaxed"
          >
            Select a world-class specialist and schedule your initial
            consultation. We'll handle the rest.
          </Motion.p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: DOCTOR SELECTION */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-[var(--textDark)]">
              Select a Specialist
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctorCards.map((doctor, idx) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                return (
                  <Motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setSelectedDate("");
                      setSlotAt("");
                    }}
                    className={`relative cursor-pointer rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-2 border shadow-lg ${
                      isSelected
                        ? "bg-[var(--softLime)] border-[var(--primaryGreen)] shadow-[var(--primaryGreen)]/20"
                        : "bg-white/90 backdrop-blur-xl border-white hover:border-[var(--borderSoft)] hover:shadow-xl"
                    }`}
                  >
                    {isSelected && (
                      <Motion.div
                        layoutId="selected-check"
                        className="absolute top-6 right-6 text-[var(--darkGreen)]"
                      >
                        <CheckCircle2
                          size={24}
                          className="fill-[var(--primaryGreen)] text-white"
                        />
                      </Motion.div>
                    )}

                    <div className="flex items-start gap-4 mb-6">
                      <div className="h-16 w-16 rounded-full bg-[var(--primaryGreen)] flex-shrink-0 flex items-center justify-center text-white text-2xl font-serif drop-shadow-md border-2 border-[var(--softLime)]">
                        {doctor.name
                          ? doctor.name.charAt(0).toUpperCase()
                          : "D"}
                      </div>
                      <div className="pr-8">
                        <h3 className="font-bold text-xl text-[var(--textDark)] line-clamp-1">
                          {doctor.name}
                        </h3>
                        <p className="text-sm font-medium text-[var(--primaryGreen)] mb-2">
                          {doctor.specialization || "Rehab Specialist"}
                        </p>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[var(--textDark)] bg-white/60 backdrop-blur-sm w-fit px-2 py-0.5 rounded-full">
                          <Star
                            size={12}
                            className="fill-yellow-500 text-yellow-500"
                          />{" "}
                          {doctor.rating || "5.0"}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--textSoft)] leading-relaxed mb-6 line-clamp-3">
                      {doctor.bio ||
                        "Focused on restoring mobility with compassionate care and evidence-based treatments."}
                    </p>

                    <div className="pt-5 border-t border-[var(--borderSoft)] flex items-center justify-between">
                      <div className="text-xs text-[var(--textSoft)]">
                        <span className="block font-semibold text-[var(--textDark)]">
                          {doctor.experience || "10+ Years"}
                        </span>
                        Experience
                      </div>
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: FLOATING BOOKING PANEL */}
          <div className="sticky top-28 w-full bg-white/90 backdrop-blur-xl rounded-[40px] p-8 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-[#E5E7E2]">
            <AnimatePresence mode="wait">
              {bookingMutation.isSuccess ? (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 rounded-full bg-[var(--softLime)] flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2
                      size={48}
                      className="text-[var(--darkGreen)]"
                    />
                  </div>
                  <h3 className="text-4xl font-serif text-[var(--textDark)] mb-4">
                    Request Sent!
                  </h3>
                  <p className="text-[#5C6B63] text-lg mb-8">
                    Your appointment request has been securely forwarded. If
                    this is your first booking, your patient login credentials
                    have already been emailed to you.
                  </p>
                  <Button onClick={() => bookingMutation.reset()}>
                    Book Another Session
                  </Button>
                </Motion.div>
              ) : (
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-3xl font-serif text-[var(--textDark)] mb-2">
                    Request Session
                  </h3>
                  <p className="text-base text-[#5C6B63] mb-10 pb-6 border-b border-[var(--borderSoft)]">
                    {selectedDoctor ? (
                      <span className="flex items-center gap-2">
                        Booking with{" "}
                        <strong className="text-[var(--textDark)]">
                          {selectedDoctor.name}
                        </strong>
                      </span>
                    ) : (
                      "Please select a specialist first."
                    )}
                  </p>

                  <form className="space-y-10" onSubmit={submit}>
                    {/* Patient Information */}
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--textSoft)]">
                        Patient Information
                      </h4>
                      <div className="space-y-4">
                        <Input
                          required
                          placeholder="Full Legal Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                          required
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                          required
                          type="email"
                          placeholder="Confirm Email Address"
                          value={confirmEmail}
                          onChange={(e) => setConfirmEmail(e.target.value)}
                        />
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
                            Describe your problem
                          </label>
                          <textarea
                            placeholder="E.g. Persistent knee pain after running, stiff neck since morning..."
                            value={problemDescription}
                            onChange={(e) =>
                              setProblemDescription(e.target.value)
                            }
                            className="w-full px-6 py-5 rounded-[28px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[var(--primaryGreen)]/5 focus:border-[var(--primaryGreen)] transition-all outline-none text-sm leading-relaxed min-h-[140px] resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date & Time Selection */}
                    <div
                      className={`space-y-8 transition-opacity duration-300 ${!selectedDoctor ? "opacity-40 pointer-events-none" : "opacity-100"}`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--textSoft)]">
                            Select Date
                          </h4>
                          {slotsQuery.isLoading && (
                            <span className="text-xs text-[var(--primaryGreen)] animate-pulse">
                              Loading availability...
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {availableDates.map((date) => (
                            <button
                              key={date}
                              type="button"
                              onClick={() => {
                                setSelectedDate(date);
                                setSlotAt("");
                              }}
                              className={`px-5 py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${
                                selectedDate === date
                                  ? "bg-[var(--primaryGreen)] text-white border-[var(--primaryGreen)] shadow-lg shadow-[var(--primaryGreen)]/20"
                                  : "bg-white border-[#DCE3DA] text-[var(--textDark)] hover:border-[var(--primaryGreen)] hover:bg-[var(--softLime)]"
                              }`}
                            >
                              {formatDate(date)}
                            </button>
                          ))}
                          {!slotsQuery.isLoading &&
                            availableDates.length === 0 &&
                            selectedDoctor && (
                              <div className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
                                No availability this week.
                              </div>
                            )}
                          {!selectedDoctor && (
                            <div className="text-sm text-[var(--textSoft)] bg-white/50 px-4 py-3 rounded-2xl border border-dashed border-[#DCE3DA] w-full">
                              Pending doctor selection...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--textSoft)]">
                          Select Time
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                          {visibleSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSlotAt(slot)}
                              className={`px-2 py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${
                                slotAt === slot
                                  ? "bg-[var(--darkGreen)] text-white border-[var(--darkGreen)] shadow-lg shadow-[var(--darkGreen)]/20 scale-105"
                                  : "bg-white border-[#DCE3DA] text-[var(--textDark)] hover:border-[var(--primaryGreen)] hover:bg-[var(--softLime)]"
                              }`}
                            >
                              {formatTime(slot)}
                            </button>
                          ))}
                          {selectedDate && visibleSlots.length === 0 && (
                            <div className="col-span-full text-sm text-[var(--textSoft)]">
                              No slots available for this date.
                            </div>
                          )}
                          {!selectedDate &&
                            selectedDoctor &&
                            availableDates.length > 0 && (
                              <div className="col-span-full text-sm text-[var(--textSoft)] bg-white/50 px-4 py-3 rounded-2xl border border-dashed border-[#DCE3DA]">
                                Please select a date first.
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--borderSoft)]">
                      {bookingMutation.isError && (
                        <p className="mb-4 text-sm text-red-600">
                          {bookingMutation.error?.response?.data?.errors
                            ?.booked_by_email?.[0] ||
                            bookingMutation.error?.response?.data?.message ||
                            "Please check the email address and try again."}
                        </p>
                      )}
                      <Button
                        type="submit"
                        disabled={
                          bookingMutation.isPending ||
                          !selectedDoctor ||
                          !slotAt ||
                          !name ||
                          !email ||
                          !confirmEmail
                        }
                        className="group w-full"
                      >
                        {bookingMutation.isPending
                          ? "Submitting Request..."
                          : "Confirm Appointment"}
                        {!bookingMutation.isPending && (
                          <ArrowRight
                            size={20}
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                          />
                        )}
                      </Button>
                    </div>
                  </form>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
