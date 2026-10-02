import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  FileCode, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Finding, Problem, Submission } from '../types';
import { Card, Badge, Button, Input } from './CommonUI';

interface FindingsCenterProps {
  findings: Finding[];
  submissions: Submission[];
  problems: Problem[];
  onSelectSubmission: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const FindingsCenter: React.FC<FindingsCenterProps> = ({
  findings,
  submissions,
  problems,
  onSelectSubmission,
  onNavigate
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = findings.filter(f => {
    const matchSev = selectedSeverity === 'ALL' || f.severity === selectedSeverity;
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchTeam = selectedTeam === 'ALL' || f.teamId === selectedTeam;
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
                        f.description.toLowerCase().includes(search.toLowerCase()) ||
                        f.affectedFile.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchCat && matchTeam && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">GLOBAL AUDIT REGISTRY</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Findings & Threat Intelligence Center
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Aggregated vulnerability, architectural anti-patterns, and compliance failures across all teams.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('judge-workspace')}
        >
          GO TO JUDGE WORKSPACE
        </Button>
      </div>

      {/* Filter Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#111316] p-4 rounded-xl border border-[#292D32] font-mono text-xs">
        <div>
          <label className="text-[10px] text-[#92979D] uppercase block mb-1">Severity</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF6A1A]"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-[#92979D] uppercase block mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF6A1A]"
          >
            <option value="ALL">All Categories</option>
            <option value="Security">Security</option>
            <option value="Architecture">Architecture</option>
            <option value="Code Quality">Code Quality</option>
            <option value="Testing">Testing</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-[#92979D] uppercase block mb-1">Team Submissions</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF6A1A]"
          >
            <option value="ALL">All Teams</option>
            {submissions.map(s => (
              <option key={s.id} value={s.id}>{s.team}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-[#92979D] uppercase block mb-1">Search Keywords</label>
          <Input
            placeholder="Search CVE, code, file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="hover:border-[#FF6A1A]/40 transition-colors">
            <div className="space-y-3 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FF8A3D] bg-[#FF6A1A]/10 border border-[#FF6A1A]/30 px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                  <Badge variant={item.severity === 'CRITICAL' ? 'danger' : item.severity === 'HIGH' ? 'warning' : 'neutral'}>
                    {item.severity}
                  </Badge>
                  <Badge variant="neutral">{item.category}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#92979D]">Team: <strong className="text-[#F5F5F2]">{item.teamName}</strong></span>
                  <Badge variant="orange">{item.status}</Badge>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#F5F5F2]">
                {item.title}
              </h3>
              <p className="text-xs text-[#92979D] leading-relaxed">
                {item.description}
              </p>

              {/* Evidence & File path */}
              <div className="bg-[#08090B] p-3 rounded-lg border border-[#1E2227] text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#FF8A3D] text-[11px]">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Target File: <strong>{item.affectedFile}</strong></span>
                </div>
                <div className="text-[#F5F5F2] text-[11px] bg-[#111316] p-2 rounded border border-[#292D32]">
                  {item.evidence}
                </div>
              </div>

              {/* Recommendation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1E2227] text-xs">
                <div>
                  <span className="text-[10px] text-[#45D483] uppercase block font-semibold">Recommended Fix:</span>
                  <span className="text-[#92979D] text-[11px]">{item.recommendation}</span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onSelectSubmission(item.teamId);
                    onNavigate('submission-detail');
                  }}
                >
                  INSPECT REPO
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
