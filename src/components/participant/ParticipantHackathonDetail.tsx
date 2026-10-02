import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Calendar,
  ShieldCheck,
  FileText,
  Users,
  Code2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { hackathonsApi } from '../../services/api';

interface ParticipantHackathonDetailProps {
  hackathonId: string;
  onNavigate: (view: string, params?: any) => void;
}

export const ParticipantHackathonDetail: React.FC<ParticipantHackathonDetailProps> = ({
  hackathonId,
  onNavigate,
}) => {
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joining, setJoining] = useState<boolean>(false);

  useEffect(() => {
    loadDetail();
  }, [hackathonId]);

  async function loadDetail() {
    setLoading(true);
    try {
      const res = await hackathonsApi.getById(hackathonId);
      setHackathon(res.hackathon);
    } catch (err) {
      console.warn('Failed to load hackathon detail:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    setJoining(true);
    try {
      await hackathonsApi.join(hackathonId);
      await loadDetail();
    } catch (err: any) {
      alert(err.message || 'Failed to join hackathon');
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-48 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="p-16 text-center space-y-4">
        <p className="text-zinc-400 font-mono">Hackathon not found.</p>
        <button
          onClick={() => onNavigate('participant-hackathons')}
          className="text-xs font-mono text-[#FF8A3D] hover:underline"
        >
          Return to Hackathons
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('participant-hackathons')}
        className="flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Hackathons</span>
      </button>

      {/* Header Banner */}
      <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/30">
              {hackathon.status}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{hackathon.name}</h1>
            {hackathon.theme && (
              <p className="text-xs font-mono text-zinc-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
                <span>Theme: {hackathon.theme}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {!hackathon.isJoined ? (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-black font-mono font-bold text-xs hover:opacity-90 transition-opacity shadow-lg shadow-[#FF6A1A]/20"
              >
                {joining ? 'Joining...' : 'Join This Hackathon'}
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Registered Participant</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl pt-2">
          {hackathon.description || 'Welcome to ForgeEval hackathon competition.'}
        </p>

        {/* Key Dates */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.04] text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500">START DATE</span>
            <div className="text-white font-bold">{new Date(hackathon.startDate).toLocaleDateString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500">REGISTRATION END</span>
            <div className="text-white font-bold">
              {hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline).toLocaleDateString() : 'Rolling'}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500">SUBMISSION DEADLINE</span>
            <div className="text-[#FF8A3D] font-bold">
              {hackathon.submissionDeadline ? new Date(hackathon.submissionDeadline).toLocaleDateString() : 'TBD'}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500">END DATE</span>
            <div className="text-white font-bold">{new Date(hackathon.endDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Rules & Eligibility Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Rules & Submission Criteria</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {hackathon.rules ||
              'All projects must be submitted with an active GitHub repository, reproducible automated test suite, and clean documentation. Code will be scanned for security and evaluated against predefined rubrics.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Eligibility</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {hackathon.eligibility ||
              'Open to all verified developers and builders globally. Teams can consist of 1 to 5 members. Cross-collaboration and open source tools are permitted.'}
          </p>
        </div>
      </div>

      {/* Problem Statements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Problem Statements ({hackathon.problems?.length || 0})</span>
          </div>
        </div>

        <div className="space-y-4">
          {hackathon.problems && hackathon.problems.length > 0 ? (
            hackathon.problems.map((prob: any) => (
              <div
                key={prob.id}
                onClick={() => onNavigate('participant-problem-detail', { id: prob.id, hackathonId: hackathon.id })}
                className="p-6 rounded-2xl border border-white/[0.08] hover:border-[#FF6A1A]/40 bg-[#0E1013] hover:bg-[#12151A] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-[#FF8A3D]">{prob.code || 'PROB'}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-white/5 text-zinc-400 border border-white/10">
                      {prob.difficulty}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">{prob.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#FF8A3D] transition-colors">
                    {prob.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {prob.description}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('participant-problem-detail', { id: prob.id, hackathonId: hackathon.id });
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] group-hover:bg-[#FF6A1A] group-hover:text-black border border-white/10 group-hover:border-[#FF6A1A] text-xs font-mono text-zinc-200 transition-all flex items-center space-x-1.5"
                  >
                    <span>View Problem</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-xs text-zinc-500 font-mono">
              No problem statements published for this hackathon yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
