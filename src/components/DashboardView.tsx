import React from 'react';
import { 
  FileText, 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  ExternalLink,
  Shield,
  Activity,
  Terminal,
  Play
} from 'lucide-react';
import { Problem, Submission, Finding } from '../types';
import { Card, Badge, Button, ProgressBar } from './CommonUI';

interface DashboardViewProps {
  problems: Problem[];
  submissions: Submission[];
  findings: Finding[];
  onSelectSubmission: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  problems,
  submissions,
  findings,
  onSelectSubmission,
  onNavigate
}) => {
  const totalSubmissions = submissions.length;
  const analyzedCount = submissions.filter(s => s.status === 'ANALYZED').length;
  const pendingCount = submissions.filter(s => s.status === 'IN_REVIEW' || s.status === 'PENDING').length;
  const criticalFindings = findings.filter(f => f.severity === 'CRITICAL').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">AI EVALUATION COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F5F5F2] uppercase tracking-tight">
            SYSTEM TELEMETRY & SUBMISSION MATRIX
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('create-problem')}>
            + NEW PROBLEM SPEC
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('judge-workspace')}>
            ENTER JUDGE SUITE
          </Button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-[#FF6A1A]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#92979D] uppercase tracking-wider">Total Problems</span>
            <FileText className="w-4 h-4 text-[#FF6A1A]" />
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-[#F5F5F2]">{problems.length}</div>
          <div className="mt-2 flex items-center text-xs font-mono text-[#45D483] gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4 Active Tracks</span>
          </div>
        </Card>

        <Card className="hover:border-[#FF6A1A]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#92979D] uppercase tracking-wider">Submissions</span>
            <FolderGit2 className="w-4 h-4 text-[#FF8A3D]" />
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-[#F5F5F2]">{totalSubmissions}</div>
          <div className="mt-2 flex items-center text-xs font-mono text-[#92979D]">
            <span>100% Repos Ingested</span>
          </div>
        </Card>

        <Card className="hover:border-[#FF6A1A]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#92979D] uppercase tracking-wider">AI Analyzed</span>
            <CheckCircle2 className="w-4 h-4 text-[#45D483]" />
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-[#F5F5F2]">{analyzedCount}</div>
          <div className="mt-2 flex items-center text-xs font-mono text-[#45D483]">
            <span>{((analyzedCount / totalSubmissions) * 100).toFixed(0)}% Evaluated</span>
          </div>
        </Card>

        <Card className="hover:border-[#FF5C5C]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#92979D] uppercase tracking-wider">Security CVEs</span>
            <AlertTriangle className="w-4 h-4 text-[#FF5C5C]" />
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-[#FF5C5C]">{criticalFindings} Crit</div>
          <div className="mt-2 flex items-center text-xs font-mono text-[#FFB547]">
            <span>{findings.length} Total Findings</span>
          </div>
        </Card>
      </div>

      {/* Primary 2-Column Split: Active Submissions vs Coverage Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Evaluations Table */}
        <div className="lg:col-span-8">
          <Card 
            title="Active Submission Evaluations" 
            badge={<Badge variant="orange">{submissions.length} QUEUED</Badge>}
            action={
              <button 
                onClick={() => onNavigate('submissions')}
                className="text-xs font-mono text-[#FF8A3D] hover:underline flex items-center gap-1"
              >
                View all &rarr;
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#292D32] text-[#92979D]">
                    <th className="pb-3 uppercase">Team / Project</th>
                    <th className="pb-3 uppercase">Problem</th>
                    <th className="pb-3 uppercase">Language</th>
                    <th className="pb-3 uppercase">Coverage</th>
                    <th className="pb-3 uppercase">Score</th>
                    <th className="pb-3 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2227]">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#181B1F]/60 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="font-bold text-[#F5F5F2]">{sub.team}</div>
                        <div className="text-[10px] text-[#92979D] truncate max-w-[140px]">{sub.repository.replace('https://github.com/', '')}</div>
                      </td>
                      <td className="py-3 text-[#92979D] max-w-[160px] truncate pr-2">
                        {sub.problemTitle}
                      </td>
                      <td className="py-3 pr-2">
                        <Badge variant="neutral">{sub.language}</Badge>
                      </td>
                      <td className="py-3 pr-2">
                        <div className="w-20">
                          <ProgressBar value={sub.metrics.testCoverage} size="sm" variant={sub.metrics.testCoverage > 80 ? 'success' : 'warning'} />
                          <span className="text-[10px] text-[#92979D]">{sub.metrics.testCoverage}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-2">
                        <span className={`font-bold ${sub.overallScore > 85 ? 'text-[#45D483]' : sub.overallScore > 70 ? 'text-[#FFB547]' : 'text-[#FF5C5C]'}`}>
                          {sub.overallScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            onSelectSubmission(sub.id);
                            onNavigate('submission-detail');
                          }}
                        >
                          INSPECT
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Dimension Radar / Requirement Coverage Visualizer */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card title="Requirement Coverage Matrix" badge={<Badge variant="success">EVAL PROTOCOL</Badge>}>
            <p className="text-xs font-mono text-[#92979D] mb-4">
              Cross-submission satisfaction rate against mandatory prompt requirements.
            </p>
            <div className="space-y-3.5">
              {[
                { label: 'Security Constraints', val: 78, color: 'orange' },
                { label: 'Performance Latency Target', val: 92, color: 'success' },
                { label: 'Architectural Spec', val: 84, color: 'orange' },
                { label: 'Unit & Stress Tests', val: 68, color: 'warning' },
                { label: 'Documentation & ADR', val: 95, color: 'success' },
                { label: 'UI / UX Telemetry View', val: 88, color: 'orange' }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#92979D]">{item.label}</span>
                    <span className="text-[#F5F5F2] font-semibold">{item.val}%</span>
                  </div>
                  <ProgressBar value={item.val} size="sm" variant={item.color as any} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Hardware Telemetry" badge={<Badge variant="neutral">RUNNER CLUSTER</Badge>}>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#181B1F] p-2.5 rounded-lg border border-[#292D32]">
                <span className="text-[10px] text-[#92979D] uppercase block">Sandbox Isolation</span>
                <span className="text-[#45D483] font-bold">eBPF + Seccomp</span>
              </div>
              <div className="bg-[#181B1F] p-2.5 rounded-lg border border-[#292D32]">
                <span className="text-[10px] text-[#92979D] uppercase block">Concurrent Jobs</span>
                <span className="text-[#FF8A3D] font-bold">8 Runners Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Recent Findings & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Findings */}
        <Card 
          title="Recent Automated Findings" 
          badge={<Badge variant="danger">{criticalFindings} CRITICAL</Badge>}
          action={
            <button 
              onClick={() => onNavigate('findings')}
              className="text-xs font-mono text-[#FF8A3D] hover:underline"
            >
              All Findings &rarr;
            </button>
          }
        >
          <div className="space-y-3">
            {findings.slice(0, 3).map((f) => (
              <div key={f.id} className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32] flex items-start justify-between gap-3 font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={f.severity === 'CRITICAL' ? 'danger' : f.severity === 'HIGH' ? 'warning' : 'neutral'}>
                      {f.severity}
                    </Badge>
                    <span className="text-xs font-bold text-[#F5F5F2]">{f.title}</span>
                  </div>
                  <p className="text-[11px] text-[#92979D] mt-1 line-clamp-1">{f.description}</p>
                  <div className="text-[10px] text-[#FF8A3D] mt-1">{f.affectedFile} • {f.teamName}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onNavigate('findings')}
                >
                  AUDIT
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Live System Activity Feed */}
        <Card title="Live Ingestion Activity" badge={<Badge variant="orange" pulse>REALTIME</Badge>}>
          <div className="space-y-3 font-mono text-xs">
            {[
              { time: '14:22:01', tag: 'SANDBOX', text: 'Compiled Rust target for Aetheris Protocol Labs with 0 errors.', type: 'success' },
              { time: '14:20:45', tag: 'SECURITY', text: 'Detected unvalidated algorithm in ZeroState Engineering JWT module.', type: 'danger' },
              { time: '14:18:12', tag: 'EVIDENCE', text: 'Requirement REQ-PERF-01 traced to tests/integration_stress_spec.rs.', type: 'info' },
              { time: '14:12:00', tag: 'SYSTEM', text: 'Judge Marcus Vance submitted review for NeuroMesh Systems.', type: 'orange' }
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded bg-[#08090B] border border-[#1E2227]">
                <span className="text-[#92979D] text-[10px] shrink-0 mt-0.5">{log.time}</span>
                <Badge variant={log.type === 'danger' ? 'danger' : log.type === 'success' ? 'success' : 'orange'}>
                  {log.tag}
                </Badge>
                <span className="text-[#F5F5F2] text-[11px]">{log.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
