import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderGit2, 
  Cpu, 
  SearchCode, 
  AlertTriangle, 
  Award, 
  BarChart3, 
  Sliders, 
  UserCheck, 
  Bell, 
  Search, 
  LogOut, 
  Menu, 
  X,
  Play,
  Terminal,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Badge, Button } from './CommonUI';

interface AppShellProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  activeSubmissionName?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  onLogout,
  children,
  activeSubmissionName = 'Aetheris Protocol Labs'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'problems', label: 'Problem Statements', icon: <FileText className="w-4 h-4" /> },
    { id: 'submissions', label: 'Submissions', icon: <FolderGit2 className="w-4 h-4" />, count: '5' },
    { id: 'analysis', label: 'AI Analysis', icon: <Cpu className="w-4 h-4" /> },
    { id: 'requirements', label: 'Requirement Trace', icon: <SearchCode className="w-4 h-4" /> },
    { id: 'code-intel', label: 'Code Intelligence', icon: <Terminal className="w-4 h-4" /> },
    { id: 'security', label: 'Security Analysis', icon: <Shield className="w-4 h-4" />, count: '2 Crit' },
    { id: 'runtime', label: 'Runtime Sandbox', icon: <Layers className="w-4 h-4" /> },
    { id: 'findings', label: 'Findings Center', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'judge-workspace', label: 'Judge Workspace', icon: <Award className="w-4 h-4" /> },
    { id: 'results', label: 'Results & Summary', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
    { id: 'profile', label: 'Admin Profile', icon: <UserCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F2] flex flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111316] border-b border-[#292D32] sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-8 h-8 rounded bg-[#FF6A1A] flex items-center justify-center font-black text-[#08090B] text-sm">
            FV
          </div>
          <span className="font-mono font-bold tracking-wider">FORGEVAL</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#181B1F] border border-[#292D32] text-[#F5F5F2]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#0c0d10] border-r border-[#292D32] flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div>
          <div 
            className="h-16 px-5 border-b border-[#292D32] flex items-center justify-between cursor-pointer"
            onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF6A1A] flex items-center justify-center font-black text-[#08090B] text-sm font-mono orange-glow-sm">
                FV
              </div>
              <div>
                <div className="text-sm font-bold tracking-wider font-mono text-[#F5F5F2]">FORGEVAL</div>
                <div className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest">COMMAND CENTER</div>
              </div>
            </div>
            <Badge variant="orange">v2.4</Badge>
          </div>

          {/* Quick Context Pill */}
          <div className="px-4 py-3 border-b border-[#1E2227] bg-[#111316]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92979D] block mb-1">Active Target:</span>
            <div className="text-xs font-mono font-bold text-[#F5F5F2] truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#45D483]" />
              {activeSubmissionName}
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono tracking-wide transition-all group ${
                    isActive
                      ? 'bg-[#181B1F] text-[#FF8A3D] border-l-2 border-[#FF6A1A] shadow-sm font-bold'
                      : 'text-[#92979D] hover:text-[#F5F5F2] hover:bg-[#111316]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`${isActive ? 'text-[#FF6A1A]' : 'text-[#92979D] group-hover:text-[#F5F5F2]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-[#FF6A1A]/20 text-[#FF8A3D]' : 'bg-[#181B1F] text-[#92979D]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Current Admin */}
        <div className="p-3 border-t border-[#292D32] bg-[#0c0d10]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#111316] border border-[#292D32]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FF6A1A]/20 border border-[#FF6A1A]/40 flex items-center justify-center text-xs font-mono font-bold text-[#FF8A3D]">
                MV
              </div>
              <div className="truncate">
                <div className="text-xs font-mono font-semibold text-[#F5F5F2]">Marcus Vance</div>
                <div className="text-[10px] font-mono text-[#92979D]">Lead Evaluator</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="text-[#92979D] hover:text-[#FF5C5C] p-1.5 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top App Bar */}
        <header className="h-16 px-4 sm:px-8 bg-[#08090B]/90 border-b border-[#292D32] sticky top-0 z-30 subtle-glass flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#92979D]" />
              <input
                type="text"
                placeholder="Search telemetry, submissions, requirements, CVEs (Press /)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111316] border border-[#292D32] rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-[#F5F5F2] placeholder-[#92979D]/50 focus:outline-none focus:border-[#FF6A1A]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="orange" pulse>TELEMETRY SYNCED</Badge>
              <Badge variant="neutral">US-EAST-SANDBOX</Badge>
            </div>

            <button 
              onClick={() => onNavigate('findings')}
              className="relative p-2 rounded-lg bg-[#111316] border border-[#292D32] text-[#92979D] hover:text-[#F5F5F2] hover:border-[#FF6A1A]/40 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6A1A]" />
            </button>

            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('analysis')}
            >
              TRIGGER EVAL
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-8 flex-1 bg-grid-pattern relative">
          {children}
        </main>
      </div>
    </div>
  );
};
