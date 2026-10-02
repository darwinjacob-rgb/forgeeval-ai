import React, { useEffect, useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Plus,
  LogIn,
  LogOut,
  Crown,
  User,
  Shield,
  AlertCircle
} from 'lucide-react';
import { teamsApi, hackathonsApi } from '../../services/api';

interface ParticipantTeamViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export const ParticipantTeamView: React.FC<ParticipantTeamViewProps> = ({ onNavigate }) => {
  const [teams, setTeams] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Forms
  const [teamName, setTeamName] = useState<string>('');
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>('');
  const [inviteCodeInput, setInviteCodeInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [teamsRes, hacksRes] = await Promise.all([
        teamsApi.getMyTeams(),
        hackathonsApi.getAll(),
      ]);
      setTeams(teamsRes.teams || []);
      const hList = hacksRes.hackathons || [];
      setHackathons(hList);
      if (hList.length > 0 && !selectedHackathonId) {
        setSelectedHackathonId(hList[0].id);
      }
    } catch (err) {
      console.warn('Failed to load teams data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!teamName.trim()) {
      setErrorMsg('Please enter a team name');
      return;
    }

    setSubmitting(true);
    try {
      await teamsApi.create({
        name: teamName.trim(),
        hackathonId: selectedHackathonId,
      });
      setTeamName('');
      setSuccessMsg('Team created successfully! Share your invite code with teammates.');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!inviteCodeInput.trim()) {
      setErrorMsg('Please enter a valid invite code');
      return;
    }

    setSubmitting(true);
    try {
      await teamsApi.joinByCode(inviteCodeInput.trim().toUpperCase());
      setInviteCodeInput('');
      setSuccessMsg('Successfully joined the team!');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to join team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to leave this team?')) return;
    setErrorMsg(null);
    try {
      await teamsApi.leave(teamId);
      setSuccessMsg('Left team successfully');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to leave team');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Team Roster</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Team Management</h1>
        <p className="text-xs text-zinc-400">
          Form a squad with teammates, share unique invite codes, or join an existing roster.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Active Teams Display */}
      {teams.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Your Teams</h2>
          {teams.map((team) => (
            <div
              key={team.id}
              className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-6 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                    {team.hackathon?.name || 'Hackathon Team'}
                  </span>
                  <div className="text-xl font-bold font-mono text-white flex items-center space-x-3">
                    <span>{team.name}</span>
                    <span className="text-xs font-normal text-zinc-500">
                      ({team.members?.length || 1} / 5 Members)
                    </span>
                  </div>
                </div>

                {/* Invite Code Box */}
                {team.inviteCode && (
                  <div className="flex items-center space-x-2 bg-black/40 border border-white/10 px-4 py-2 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 font-mono">INVITE CODE</span>
                      <span className="text-sm font-bold font-mono text-[#FF8A3D]">{team.inviteCode}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(team.inviteCode)}
                      className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      title="Copy Invite Code"
                    >
                      {copiedCode === team.inviteCode ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Team Roster</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {team.members?.map((member: any) => {
                    const isCaptain = member.role === 'CAPTAIN';
                    return (
                      <div
                        key={member.id}
                        className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs text-[#FF8A3D]">
                            {member.user?.name?.slice(0, 2).toUpperCase() || 'MB'}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">{member.user?.name || 'Member'}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{member.user?.email}</div>
                          </div>
                        </div>
                        {isCaptain ? (
                          <span className="p-1 text-amber-400" title="Team Captain">
                            <Crown className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">MEMBER</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                <button
                  onClick={() => onNavigate('participant-submission', { teamId: team.id })}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-black text-xs font-mono font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit Project For This Team
                </button>
                <button
                  onClick={() => handleLeaveTeam(team.id)}
                  className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Leave Team</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
          <Users className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">You haven't created or joined a team yet.</h3>
          <p className="text-xs text-zinc-500 font-mono">Create a new team below or enter an invite code to join your friends.</p>
        </div>
      )}

      {/* Forms Section: Create Team & Join Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Create Team Card */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
            <Plus className="w-4 h-4" />
            <span>Create New Team</span>
          </div>

          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1.5">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Phoenix Protocol"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF6A1A]/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1.5">Select Hackathon</label>
              <select
                value={selectedHackathonId}
                onChange={(e) => setSelectedHackathonId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF6A1A]/50 transition-colors"
              >
                {hackathons.map((h) => (
                  <option key={h.id} value={h.id} className="bg-zinc-900 text-white">
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-mono font-medium text-white transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        </div>

        {/* Join by Code Card */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
            <LogIn className="w-4 h-4" />
            <span>Join with Invite Code</span>
          </div>

          <form onSubmit={handleJoinByCode} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1.5">Enter Invite Code</label>
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="e.g. FORGE-7X92"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white uppercase focus:outline-none focus:border-[#FF6A1A]/50 transition-colors"
              />
              <p className="text-[10px] text-zinc-500 font-mono mt-1.5">
                Ask your team captain for the 6-character team invite code.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-black font-mono font-bold text-xs rounded-xl hover:opacity-90 transition-opacity"
            >
              {submitting ? 'Joining...' : 'Join Team'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
