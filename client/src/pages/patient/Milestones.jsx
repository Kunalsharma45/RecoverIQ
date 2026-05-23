import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Flag,
  Search,
  Filter,
  Loader2,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Activity,
  Clock,
} from "lucide-react";
import { patientApi } from "../../lib/api";
import MilestoneTimeline from "../../components/shared/MilestoneTimeline.jsx";
import RecoveryCheckInModal from "../../components/shared/RecoveryCheckInModal.jsx";

export default function Milestones() {
  const [milestones, setMilestones] = React.useState([]);
  const [streak, setStreak] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const [selectedMilestone, setSelectedMilestone] = React.useState(null);
  const [showCheckIn, setShowCheckIn] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const navigate = useNavigate();
  const openedStartMilestoneIdRef = React.useRef(null);

  React.useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const res = await patientApi.getMilestones();
      setMilestones(res.data.milestones);
      setStreak(res.data.streak);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If navigated here with a startMilestoneId, open the check-in for that milestone
  const location = useLocation();
  React.useEffect(() => {
    const startId = location?.state?.startMilestoneId;
    if (!startId) return;
    if (openedStartMilestoneIdRef.current === startId) return;

    // If milestones are already loaded, open immediately, else wait until fetch finishes
    if (milestones && milestones.length > 0) {
      const m = milestones.find((ms) => ms.id === startId);
      if (m) {
        openedStartMilestoneIdRef.current = startId;
        setSelectedMilestone(m);
        setShowCheckIn(true);
        navigate(location.pathname, { replace: true, state: {} });
      }
    } else {
      // Poll for a short time until milestones load then open
      const handle = setInterval(() => {
        if (milestones && milestones.length > 0) {
          const m = milestones.find((ms) => ms.id === startId);
          if (m) {
            openedStartMilestoneIdRef.current = startId;
            setSelectedMilestone(m);
            setShowCheckIn(true);
            navigate(location.pathname, { replace: true, state: {} });
            clearInterval(handle);
          }
        }
      }, 200);
      setTimeout(() => clearInterval(handle), 5000);
    }
  }, [location, milestones]);

  const handleCompleteClick = (milestone) => {
    setSelectedMilestone(milestone);
    setShowCheckIn(true);
  };

  const handleCheckInSubmit = async (formData) => {
    try {
      await patientApi.completeMilestone(selectedMilestone.id, formData);
      setShowCheckIn(false);
      setSelectedMilestone(null);
      fetchMilestones();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting check-in");
    }
  };

  const handleShowDetails = (milestone) => {
    setSelectedMilestone(milestone);
    setShowDetails(true);
  };

  const filteredMilestones = (milestones || []).filter((ms) => {
    const matchesSearch =
      ms.title.toLowerCase().includes(search.toLowerCase()) ||
      ms.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && ms.status === "Completed") ||
      (filter === "locked" && ms.is_locked) ||
      (filter === "available" && ms.is_available_today);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--primaryGreen)] animate-spin" />
        <p className="text-slate-500 font-medium">
          Loading your recovery path...
        </p>
      </div>
    );
  }

  const completedCount = (milestones || []).filter(
    (m) => m.status === "Completed",
  ).length;
  const totalCount = (milestones || []).length;
  const progressPercent = Math.round(
    (completedCount / (totalCount || 1)) * 100,
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Stats Card */}
      <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[var(--primaryGreen)] mb-2">
              <Flag size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">
                Milestones
              </span>
            </div>
            <h1 className="serif-heading text-4xl text-slate-900 mb-4">
              Daily Recovery Track
            </h1>
            <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
              Complete your daily rehabilitation tasks to progress through your
              treatment. Each step is medically guided for optimal recovery.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-6 rounded-[32px]">
            <div className="flex items-center gap-4 px-4">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Progress
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {progressPercent}%
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center px-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Streak
                </div>
                <div className="text-3xl font-black text-[var(--primaryGreen)] flex items-center gap-2">
                  {streak} <Sparkles size={20} />
                </div>
              </div>
            </div>
            <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-[var(--primaryGreen)]"
              />
            </div>
          </div>
        </div>
        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm">
          {["all", "available", "completed", "locked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? "bg-[var(--primaryGreen)] text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search milestones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-[20px] bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-[var(--primaryGreen)]/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-5xl mx-auto py-10">
        {filteredMilestones.length > 0 ? (
          <MilestoneTimeline
            milestones={filteredMilestones}
            onComplete={handleCompleteClick}
            onShowDetails={handleShowDetails}
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              No milestones found
            </h3>
            <p className="text-slate-500">
              Try adjusting your filters or search keywords.
            </p>
          </div>
        )}
      </div>

      {/* Daily Check-In Modal */}
      <AnimatePresence>
        {showCheckIn && (
          <RecoveryCheckInModal
            milestone={selectedMilestone}
            isOpen={showCheckIn}
            onClose={() => setShowCheckIn(false)}
            onSubmit={handleCheckInSubmit}
          />
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && selectedMilestone && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[48px] max-w-2xl w-full shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-[var(--primaryGreen)] text-white flex items-center justify-center text-2xl font-black shadow-lg">
                    {selectedMilestone.due_day}
                  </div>
                  <div>
                    <h3 className="serif-heading text-3xl text-slate-900 leading-tight">
                      {selectedMilestone.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      <Clock size={14} />
                      {selectedMilestone.duration} mins •{" "}
                      {selectedMilestone.difficulty}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Activity
                        size={14}
                        className="text-[var(--primaryGreen)]"
                      />
                      About this milestone
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedMilestone.description}
                    </p>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Step-by-step instructions
                    </h4>
                    <div className="text-slate-700 space-y-4">
                      {selectedMilestone.instructions
                        .split("\n")
                        .map((line, i) => (
                          <div key={i} className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-[var(--primaryGreen)] shadow-sm border border-slate-100 shrink-0">
                              {i + 1}
                            </span>
                            <p className="text-sm leading-relaxed">{line}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(false)}
                  className="mt-10 w-full bg-slate-900 text-white py-5 rounded-3xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
