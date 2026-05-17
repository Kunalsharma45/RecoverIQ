import React from "react";
import { motion } from "motion/react";
import {
  HeartPulse,
  Loader2,
  Info,
  ArrowRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { patientApi } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import RecoveryProgramCard from "../../components/shared/RecoveryProgramCard.jsx";
import RecoveryTimeline from "../../components/shared/RecoveryTimeline.jsx";

export default function RecoveryProgram() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await patientApi.getRecoveryProgram();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--primaryGreen)] animate-spin" />
        <p className="text-slate-500 font-medium">
          Loading your recovery plan...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
        <HeartPulse size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">
          No Program Assigned
        </h2>
        <p className="text-slate-500 mt-2">
          Your doctor will assign a rehabilitation program soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--primaryGreen)] mb-2">
            <HeartPulse size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Your Treatment
            </span>
          </div>
          <h1 className="serif-heading text-4xl text-slate-900">
            {data.program_title}
          </h1>
          <p className="mt-2 text-slate-500 max-w-xl">
            A specialized rehabilitation program designed by Dr.{" "}
            {data.doctor?.name} to help you recover efficiently and safely.
          </p>
        </div>

        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Est. Completion
            </div>
            <div className="text-lg font-black text-slate-800">
              {new Date(data.estimated_completion).toLocaleDateString()}
            </div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            On Track
          </div>
        </div>
      </div>

      <RecoveryProgramCard program={data} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
        <div className="space-y-8">
          <div>
            <h2 className="serif-heading text-2xl text-slate-900 mb-6">
              Weekly Roadmap
            </h2>
            <RecoveryTimeline roadmap={data.weekly_roadmap} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Today's / Streak Card */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-[var(--primaryGreen)]">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Recovery Streak
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {data.streak} Days
                </div>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
              Active
            </div>
          </div>

          <div className="bg-[rgba(240,249,245,0.7)] backdrop-blur-sm border border-green-100 rounded-[32px] p-6 sticky top-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info size={18} className="text-[var(--primaryGreen)]" />
              Recovery Expectations
            </h3>
            <div className="space-y-4">
              {data.recovery_phases.map((phase, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[var(--primaryGreen)]" />
                  <div className="font-bold text-sm text-slate-800">
                    {phase.name} (Weeks {phase.weeks})
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {phase.goal}
                  </div>
                </div>
              ))}
            </div>

            {data.today_milestone && (
              <div className="mt-8 pt-6 border-t border-green-200/50">
                <div className="text-[10px] font-bold uppercase text-green-700 tracking-widest mb-3 flex items-center gap-2">
                  <Activity size={14} /> Today's Milestone
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primaryGreen)] ring-4 ring-green-50">
                  <div className="text-[10px] font-bold text-slate-400 mb-1">
                    Day {data.today_milestone.due_day}
                  </div>
                  <div className="font-bold text-slate-900 text-sm mb-3 leading-tight">
                    {data.today_milestone.title}
                  </div>
                  <button
                    onClick={() => {
                      if (data?.today_milestone?.id) {
                        navigate("/patient/milestones", {
                          state: { startMilestoneId: data.today_milestone.id },
                        });
                      } else {
                        navigate("/patient/milestones");
                      }
                    }}
                    className="w-full py-2.5 bg-[var(--primaryGreen)] text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    Start Today <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {!data.today_milestone && data.upcoming_milestone && (
              <div className="mt-8 pt-6 border-t border-green-200/50">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">
                  Up Next
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 mb-1">
                    Day {data.upcoming_milestone.due_day}
                  </div>
                  <div className="font-bold text-slate-900 text-sm mb-2">
                    {data.upcoming_milestone.title}
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    Available Tomorrow
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
