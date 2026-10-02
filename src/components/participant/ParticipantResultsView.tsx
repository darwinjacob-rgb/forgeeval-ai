import React, { useEffect, useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Code2,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { participantApi } from '../../services/api';

interface ParticipantResultsViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export const ParticipantResultsView: React.FC<ParticipantResultsViewProps> = ({ onNavigate }) => {
  const [resultsData, setResultsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);
    try {
      const res = await participantApi.getResults();
      setResultsData(res);
    } catch (err) {
      console.warn('Failed to load participant results:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-64 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse" />
      </div>
    );
  }

  const hasReleased = resultsData?.hasReleasedResults && resultsData?.results?.length > 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>Competition Standings</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Participant Results & Evaluations</h1>
        <p className="text-xs text-zinc-400">
          Official composite scores released by hackathon organizers and evaluation consensus.
        </p>
      </div>

      {hasReleased ? (
        <div className="space-y-6">
          {resultsData.results.map((item: any) => (
            <div
              key={item.submissionId}
              className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6A1A]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      OFFICIAL RESULTS RELEASED
                    </span>
                    <span className="text-xs font-mono text-zinc-500">• {item.problemTitle}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-mono text-white">{item.projectName}</h2>
                  <p className="text-xs text-zinc-400 font-mono">Team: {item.teamName}</p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">
                    Composite Score
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-[#FF8A3D]">
                    {item.overallScore || 90}
                    <span className="text-sm font-normal text-zinc-500"> / 100</span>
                  </div>
                </div>
              </div>

              {/* Criteria Scores Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/[0.06] text-center font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[9px] text-zinc-500 uppercase block">Requirements</span>
                  <div className="text-base font-bold text-white">
                    {item.criteriaScores.requirementCompliance}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[9px] text-zinc-500 uppercase block">Code Quality</span>
                  <div className="text-base font-bold text-white">
                    {item.criteriaScores.codeQuality}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[9px] text-zinc-500 uppercase block">Security</span>
                  <div className="text-base font-bold text-white">
                    {item.criteriaScores.security}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[9px] text-zinc-500 uppercase block">Runtime/Perf</span>
                  <div className="text-base font-bold text-white">
                    {item.criteriaScores.runtimePerformance}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[9px] text-zinc-500 uppercase block">Documentation</span>
                  <div className="text-base font-bold text-white">
                    {item.criteriaScores.documentation}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[9px] text-zinc-500 uppercase block">UI/UX</span>
                  <div className="text-base font-bold text-white">
                    {item.criteriaScores.uiUx}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs font-mono text-zinc-500">
                <span>Submitted on {new Date(item.submittedAt).toLocaleDateString()}</span>
                <button
                  onClick={() => onNavigate('participant-submission-detail', { id: item.submissionId })}
                  className="text-[#FF8A3D] hover:underline flex items-center space-x-1"
                >
                  <span>View Timeline Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 text-zinc-500 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Results have not been released yet.</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Organizers and judges are currently evaluating submissions. Results and score breakdowns will automatically appear here once officially released.
            </p>
          </div>
          <button
            onClick={() => onNavigate('participant-dashboard')}
            className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 border border-white/10 rounded-xl transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
