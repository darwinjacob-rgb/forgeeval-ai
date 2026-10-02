import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Users,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  GitBranch
} from 'lucide-react';
import { participantApi } from '../../services/api';

interface ParticipantDashboardProps {
  onNavigate: (view: string, params?: any) => void;
  currentUser?: any;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  onNavigate,
  currentUser,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const res = await participantApi.getDashboard();
      setData(res);
    } catch (err) {
      console.warn('Could not load participant dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const summary = data?.summary || {
    activeStatus: 'REGISTERED',
    joinedHackathonsCount: 0,
    teamsCount: 0,
    activeSubmission: null,
  };

  const primaryTeam = data?.teams?.[0];
  const primaryHackathon = data?.hackathons?.[0];
  const activeSub = summary.activeSubmission;

  const copyInviteCode = () => {
    if (primaryTeam?.inviteCode) {
      navigator.clipboard.writeText(primaryTeam.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; border: string; bg: string }> = {
      REGISTERED: { label: 'Registered', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
      TEAM_CREATED: { label: 'Team Formed', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
      SUBMISSION_PENDING: { label: 'Submission Ready', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
      SUBMITTED: { label: 'Submitted', color: 'text-[#FF8A3D]', border: 'border-[#FF6A1A]/30', bg: 'bg-[#FF6A1A]/10' },
      ANALYZING: { label: 'Evaluation In Progress', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
      EVALUATED: { label: 'Evaluation Complete', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
      RESULT_RELEASED: { label: 'Results Released', color: 'text-[#FF6A1A]', border: 'border-[#FF6A1A]', bg: 'bg-[#FF6A1A]/20' },
      FAILED: { label: 'Verification Failed', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
    };

    const cfg = config[status] || config.REGISTERED;

    return (
      <span className={`px-2.5 py-1 text-xs font-mono tracking-wider uppercase rounded-full border ${cfg.border} ${cfg.bg} ${cfg.color} inline-flex items-center space-x-1.5`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        <span>{cfg.label}</span>
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#12151A] via-[#0D0F12] to-[#08090B] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6A1A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
                Participant Console
              </span>
              {getStatusBadge(summary.activeStatus)}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.name || 'Builder'}
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Track hackathon milestones, coordinate your team roster, submit project code, and inspect automated AI & security evaluation results.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('participant-hackathons')}
              className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.04] text-xs font-mono text-zinc-200 transition-colors flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4 text-[#FF8A3D]" />
              <span>Browse Hackathons</span>
            </button>
            <button
              onClick={() => onNavigate('participant-submission')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] hover:from-[#FF8A3D] hover:to-[#FF6A1A] text-black text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-[#FF6A1A]/20 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0E1013] space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Joined Hackathons</span>
          <div className="text-2xl font-bold font-mono text-white">{summary.joinedHackathonsCount}</div>
        </div>
        <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0E1013] space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Active Teams</span>
          <div className="text-2xl font-bold font-mono text-white">{summary.teamsCount}</div>
        </div>
        <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0E1013] space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Project Submission</span>
          <div className="text-2xl font-bold font-mono text-[#FF8A3D]">
            {activeSub ? 'Submitted' : 'Pending'}
          </div>
        </div>
        <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0E1013] space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Evaluation Status</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {activeSub?.overallScore ? `${activeSub.overallScore} / 100` : 'In Queue'}
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Team & Active Submission */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Team Card */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your Team</h3>
                  <p className="text-xs text-zinc-400">Current team membership and invite details</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('participant-team')}
                className="text-xs font-mono text-[#FF8A3D] hover:underline flex items-center space-x-1"
              >
                <span>Manage Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {primaryTeam ? (
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-zinc-500 font-mono">TEAM NAME</span>
                    <div className="text-lg font-bold text-white font-mono">{primaryTeam.name}</div>
                  </div>
                  {primaryTeam.inviteCode && (
                    <div className="flex items-center space-x-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg">
                      <span className="text-[10px] text-zinc-500 font-mono">INVITE CODE:</span>
                      <span className="text-xs font-bold font-mono text-[#FF8A3D]">{primaryTeam.inviteCode}</span>
                      <button
                        onClick={copyInviteCode}
                        className="text-zinc-400 hover:text-white transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/[0.04] pt-3 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Members: {primaryTeam.members?.length || 1} / 5</span>
                  <span>Hackathon: {primaryTeam.hackathon?.name || 'Summit 2026'}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl space-y-3">
                <p className="text-xs text-zinc-400">You haven't created or joined a team yet.</p>
                <button
                  onClick={() => onNavigate('participant-team')}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#FF8A3D] border border-white/10 rounded-lg transition-colors"
                >
                  Create or Join Team
                </button>
              </div>
            )}
          </div>

          {/* Active Submission Card */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Project Submission</h3>
                  <p className="text-xs text-zinc-400">Repository pipeline and evaluation status</p>
                </div>
              </div>
              {activeSub && (
                <button
                  onClick={() => onNavigate('participant-submission-detail', { id: activeSub.id })}
                  className="text-xs font-mono text-[#FF8A3D] hover:underline flex items-center space-x-1"
                >
                  <span>View Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {activeSub ? (
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Project Name</span>
                    <div className="text-base font-bold text-white font-mono">
                      {activeSub.projectName || primaryTeam?.name || 'Project'}
                    </div>
                  </div>
                  {getStatusBadge(activeSub.status)}
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                  <GitBranch className="w-4 h-4 text-[#FF8A3D]" />
                  <span className="truncate">{activeSub.repositoryUrl}</span>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs font-mono">
                  <span className="text-zinc-500">
                    Submitted: {new Date(activeSub.submittedAt || activeSub.createdAt).toLocaleDateString()}
                  </span>
                  {activeSub.isReleased ? (
                    <button
                      onClick={() => onNavigate('participant-results')}
                      className="text-emerald-400 hover:underline flex items-center space-x-1"
                    >
                      <span>View Official Results</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-zinc-500 italic">Results pending release</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl space-y-3">
                <p className="text-xs text-zinc-400">Your team hasn't submitted a project yet.</p>
                <button
                  onClick={() => onNavigate('participant-submission')}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-black text-xs font-mono font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                >
                  Submit Project Code
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deadlines & Activity */}
        <div className="space-y-6">
          {/* Deadlines Card */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Upcoming Deadlines</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] space-y-1">
                <div className="text-xs font-medium text-white">Project Submission Closes</div>
                <div className="text-[11px] font-mono text-zinc-400">
                  {primaryHackathon?.submissionDeadline
                    ? new Date(primaryHackathon.submissionDeadline).toLocaleDateString()
                    : 'In 10 Days'}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] space-y-1">
                <div className="text-xs font-medium text-white">Results Announcement</div>
                <div className="text-[11px] font-mono text-zinc-400">
                  {primaryHackathon?.endDate
                    ? new Date(primaryHackathon.endDate).toLocaleDateString()
                    : 'In 14 Days'}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-4">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Recent Activity</h4>
            <div className="space-y-3">
              {data?.recentActivities && data.recentActivities.length > 0 ? (
                data.recentActivities.map((act: any) => (
                  <div key={act.id} className="flex items-start space-x-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A] mt-1.5" />
                    <div>
                      <div className="font-mono text-zinc-200">{act.action.replace('_', ' ')}</div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {new Date(act.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500 font-mono italic">No recent activity recorded</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
