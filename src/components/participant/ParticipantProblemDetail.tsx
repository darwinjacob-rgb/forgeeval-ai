import React, { useEffect, useState } from 'react';
import {
  Code2,
  ShieldCheck,
  Zap,
  Layout,
  FileText,
  Users,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { problemsApi, teamsApi } from '../../services/api';

interface ParticipantProblemDetailProps {
  problemId: string;
  hackathonId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const ParticipantProblemDetail: React.FC<ParticipantProblemDetailProps> = ({
  problemId,
  hackathonId,
  onNavigate,
}) => {
  const [problem, setProblem] = useState<any>(null);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, [problemId]);

  async function loadData() {
    setLoading(true);
    try {
      const [probRes, teamsRes] = await Promise.all([
        problemsApi.getById(problemId),
        teamsApi.getMyTeams().catch(() => ({ teams: [] })),
      ]);
      setProblem(probRes);
      setMyTeams(teamsRes.teams || []);
    } catch (err) {
      console.warn('Failed to load problem detail:', err);
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

  if (!problem) {
    return (
      <div className="p-16 text-center space-y-4">
        <p className="text-zinc-400 font-mono">Problem statement not found.</p>
        <button
          onClick={() => onNavigate('participant-hackathons')}
          className="text-xs font-mono text-[#FF8A3D] hover:underline"
        >
          Return to Hackathons
        </button>
      </div>
    );
  }

  const hasTeam = myTeams.length > 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Back link */}
      <button
        onClick={() => onNavigate('participant-hackathons')}
        className="flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Hackathons</span>
      </button>

      {/* Problem Header */}
      <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs font-bold text-[#FF8A3D] px-2 py-0.5 rounded bg-[#FF6A1A]/10 border border-[#FF6A1A]/20">
                {problem.code || 'PROB-01'}
              </span>
              <span className="text-xs font-mono text-zinc-400">{problem.category}</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-white/5 text-zinc-300 border border-white/10">
                {problem.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{problem.title}</h1>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {hasTeam ? (
              <button
                onClick={() => onNavigate('participant-submission', { problemId: problem.id, hackathonId })}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] hover:from-[#FF8A3D] hover:to-[#FF6A1A] text-black text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-[#FF6A1A]/20 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Solution</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('participant-team')}
                className="px-5 py-2.5 rounded-xl bg-[#FF6A1A] hover:bg-[#FF8A3D] text-black text-xs font-mono font-bold tracking-wide transition-colors flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Form / Join Team to Submit</span>
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-4">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">{problem.description}</p>
        </div>
      </div>

      {/* Requirements Breakdown Cards */}
      <div className="space-y-6">
        <h3 className="text-sm font-mono text-[#FF8A3D] uppercase tracking-wider flex items-center space-x-2">
          <Code2 className="w-4 h-4" />
          <span>Evaluation Requirements</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Functional Requirements */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">Functional Requirements</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              {problem.functionalRequirements && problem.functionalRequirements.length > 0 ? (
                problem.functionalRequirements.map((req: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#FF8A3D] mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500 italic">Core pipeline throughput, transaction classification, dynamic scoring.</li>
              )}
            </ul>
          </div>

          {/* Technical Requirements */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
              <Code2 className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">Technical & Architectural</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              {problem.technicalRequirements && problem.technicalRequirements.length > 0 ? (
                problem.technicalRequirements.map((req: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#FF8A3D] mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500 italic">Modular codebase architecture, automated test suites (&gt;80% coverage), reproducible build scripts.</li>
              )}
            </ul>
          </div>

          {/* Security Requirements */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">Security & Zero-Trust</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              {problem.securityRequirements && problem.securityRequirements.length > 0 ? (
                problem.securityRequirements.map((req: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#FF8A3D] mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500 italic">No hardcoded secrets, parameterized queries, strict CORS origins, vulnerability scanning passed.</li>
              )}
            </ul>
          </div>

          {/* Performance & UI/UX */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
              <Layout className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">Performance & UX</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              {problem.performanceRequirements && problem.performanceRequirements.length > 0 ? (
                problem.performanceRequirements.map((req: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#FF8A3D] mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500 italic">Sub-50ms latency benchmark, intuitive monitoring dashboard, high throughput under load.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
