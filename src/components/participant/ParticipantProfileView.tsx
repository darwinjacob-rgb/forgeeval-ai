import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Users,
  Shield,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';
import { participantApi } from '../../services/api';

interface ParticipantProfileViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export const ParticipantProfileView: React.FC<ParticipantProfileViewProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await participantApi.getProfile();
      setProfile(res.user);
      setName(res.user.name || '');
      setPhone(res.user.phone || '');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const res = await participantApi.updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      setProfile((prev: any) => ({ ...prev, ...res.user }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-64 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Participant Profile</h1>
        <p className="text-xs text-zinc-400">
          Manage your verified builder identity, contact details, and view your hackathon affiliations.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6A1A]/20 to-[#FF8A3D]/20 border border-[#FF6A1A]/40 flex items-center justify-center text-xl font-bold font-mono text-[#FF8A3D]">
            {profile?.name?.slice(0, 2).toUpperCase() || 'PA'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono">{profile?.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/20">
                {profile?.role || 'PARTICIPANT'}
              </span>
              <span className="text-xs text-zinc-500 font-mono">• Member since {new Date(profile?.createdAt || Date.now()).getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-white/[0.04]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF6A1A]/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1.5">Email Address (Read-only)</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 bg-black/20 border border-white/[0.06] rounded-xl text-xs font-mono text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1.5">Mobile Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1-555-0199"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF6A1A]/50 transition-colors"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-black font-mono font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#FF6A1A]/20 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Affiliations: Joined Hackathons & Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Joined Hackathons */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Joined Hackathons</span>
          </div>

          <div className="space-y-3">
            {profile?.joinedHackathons && profile.joinedHackathons.length > 0 ? (
              profile.joinedHackathons.map((h: any) => (
                <div key={h.id} className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{h.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{h.status}</div>
                  </div>
                  <button
                    onClick={() => onNavigate('participant-hackathon-detail', { id: h.id })}
                    className="text-xs font-mono text-[#FF8A3D] hover:underline"
                  >
                    View
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 font-mono italic">No hackathons joined yet</div>
            )}
          </div>
        </div>

        {/* Current Teams */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1013] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Active Team Affiliations</span>
          </div>

          <div className="space-y-3">
            {profile?.teams && profile.teams.length > 0 ? (
              profile.teams.map((t: any) => (
                <div key={t.id} className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500">Invite Code: {t.inviteCode || 'N/A'}</div>
                  </div>
                  <button
                    onClick={() => onNavigate('participant-team')}
                    className="text-xs font-mono text-[#FF8A3D] hover:underline"
                  >
                    Manage
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 font-mono italic">No teams formed yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
