import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Code2,
  CheckCircle,
  ArrowRight,
  Search,
  Clock,
  Sparkles
} from 'lucide-react';
import { hackathonsApi } from '../../services/api';

interface ParticipantHackathonsProps {
  onNavigate: (view: string, params?: any) => void;
}

export const ParticipantHackathons: React.FC<ParticipantHackathonsProps> = ({ onNavigate }) => {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    loadHackathons();
  }, []);

  async function loadHackathons() {
    setLoading(true);
    try {
      const res = await hackathonsApi.getAll();
      setHackathons(res.hackathons || []);
    } catch (err) {
      console.warn('Failed to load hackathons:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setJoiningId(id);
    try {
      await hackathonsApi.join(id);
      await loadHackathons();
    } catch (err: any) {
      alert(err.message || 'Failed to join hackathon');
    } finally {
      setJoiningId(null);
    }
  }

  const filteredHackathons = hackathons.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.theme && h.theme.toLowerCase().includes(search.toLowerCase())) ||
    (h.description && h.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Discover Events</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Active Hackathons</h1>
          <p className="text-xs text-zinc-400">Join competitions, form teams, and solve complex problem statements.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hackathons..."
            className="w-full pl-9 pr-4 py-2 bg-[#0E1013] border border-white/10 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#FF6A1A]/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : filteredHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHackathons.map((h) => (
            <div
              key={h.id}
              onClick={() => onNavigate('participant-hackathon-detail', { id: h.id })}
              className="p-6 rounded-2xl border border-white/[0.08] hover:border-[#FF6A1A]/40 bg-[#0E1013] hover:bg-[#12151A] transition-all cursor-pointer group flex flex-col justify-between space-y-5 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/30">
                    {h.status}
                  </span>
                  {h.isJoined && (
                    <span className="flex items-center space-x-1 text-xs font-mono text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF8A3D] transition-colors">
                    {h.name}
                  </h3>
                  {h.theme && (
                    <div className="text-xs font-mono text-zinc-400 mt-1 flex items-center space-x-1.5">
                      <Sparkles className="w-3 h-3 text-[#FF8A3D]" />
                      <span>Theme: {h.theme}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {h.description || 'Global distributed AI hackathon competition with automated benchmark verification.'}
                </p>
              </div>

              {/* Stats & Actions */}
              <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                    <div className="text-zinc-500 text-[10px]">TEAMS</div>
                    <div className="text-white font-bold">{h.teamsCount || 0}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                    <div className="text-zinc-500 text-[10px]">PROBLEMS</div>
                    <div className="text-white font-bold">{h.problemsCount || 0}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                    <div className="text-zinc-500 text-[10px]">BUILDERS</div>
                    <div className="text-white font-bold">{h.participantsCount || 0}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Submission Deadline:</span>
                    <span className="text-zinc-300">
                      {h.submissionDeadline ? new Date(h.submissionDeadline).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  {!h.isJoined ? (
                    <button
                      onClick={(e) => handleJoin(h.id, e)}
                      disabled={joiningId === h.id}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-black font-mono font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      {joiningId === h.id ? 'Joining...' : 'Join Hackathon'}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('participant-team');
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 font-mono text-xs transition-colors"
                    >
                      Go to Team
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('participant-hackathon-detail', { id: h.id })}
                    className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl space-y-3">
          <Trophy className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No active hackathons available.</h3>
          <p className="text-xs text-zinc-500 font-mono">Check back soon for new hackathon announcements.</p>
        </div>
      )}
    </div>
  );
};
