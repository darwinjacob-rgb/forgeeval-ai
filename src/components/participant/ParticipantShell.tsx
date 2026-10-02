import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Send,
  Award,
  User,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Code2
} from 'lucide-react';

interface ParticipantShellProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onLogout: () => void;
  currentUser?: any;
  children: React.ReactNode;
}

export const ParticipantShell: React.FC<ParticipantShellProps> = ({
  currentView,
  onNavigate,
  onLogout,
  currentUser,
  children,
}) => {
  const navItems = [
    { id: 'participant-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'participant-hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'participant-team', label: 'My Team', icon: Users },
    { id: 'participant-submission', label: 'Submit Project', icon: Send },
    { id: 'participant-results', label: 'Results', icon: Award },
    { id: 'participant-profile', label: 'Profile', icon: User },
  ];

  const isAdminOrJudge = currentUser?.role === 'ADMIN' || currentUser?.role === 'ORGANIZER' || currentUser?.role === 'JUDGE';

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F2] flex flex-col font-sans selection:bg-[#FF6A1A]/30 selection:text-[#FF8A3D]">
      {/* Top Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0E1013]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-6">
          <div
            onClick={() => onNavigate('participant-dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A1A] to-[#FF8A3D] p-0.5 flex items-center justify-center shadow-lg shadow-[#FF6A1A]/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4 text-black font-black" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  ForgeEval
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/30 rounded">
                  PARTICIPANT
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono tracking-tight">
                Hackathon Workspace
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          {/* Quick Breadcrumb */}
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <span>Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-200 capitalize">
              {currentView.replace('participant-', '').replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-4">
          {isAdminOrJudge && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 border border-white/10 transition-colors flex items-center space-x-1.5"
            >
              <span>Switch to Admin / Judge</span>
              <ExternalLink className="w-3 h-3 text-[#FF8A3D]" />
            </button>
          )}

          <div
            onClick={() => onNavigate('participant-profile')}
            className="flex items-center space-x-3 cursor-pointer pl-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-zinc-800 flex items-center justify-center">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-mono text-[#FF8A3D] font-bold">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'PA'}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-zinc-200 leading-tight">
                {currentUser?.name || 'Participant'}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {currentUser?.email || 'dev@forgeeval.com'}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-white/[0.06] bg-[#0A0C0E]/90 flex flex-col justify-between p-4 hidden md:flex">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-3 py-2">
              Workspace Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6A1A]/15 to-transparent text-[#FF8A3D] border-l-2 border-[#FF6A1A] font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6A1A]' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#FF8A3D]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Submission Guidelines</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Submissions require a public GitHub repository with reproducible builds and passing test suites.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#08090B]">
          {children}
        </main>
      </div>
    </div>
  );
};
