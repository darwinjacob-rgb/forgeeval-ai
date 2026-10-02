import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Terminal, 
  ChevronRight, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Finding, Submission } from '../types';
import { Card, Badge, Button, Input } from './CommonUI';

interface SecurityAnalysisViewProps {
  findings: Finding[];
  submission: Submission;
  onNavigate: (view: string) => void;
}

export const SecurityAnalysisView: React.FC<SecurityAnalysisViewProps> = ({
  findings,
  submission,
  onNavigate
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Filter findings for this submission
  const subFindings = findings.filter(f => f.teamId === submission.id);

  const filtered = selectedSeverity === 'ALL'
    ? subFindings
    : subFindings.filter(f => f.severity === selectedSeverity);

  const criticals = subFindings.filter(f => f.severity === 'CRITICAL').length;
  const highs = subFindings.filter(f => f.severity === 'HIGH').length;
  const mediums = subFindings.filter(f => f.severity === 'MEDIUM').length;
  const lows = subFindings.filter(f => f.severity === 'LOW').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF5C5C] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF5C5C]">STATIC TAINT & RUNTIME SECURITY AUDIT</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Security Analysis & Threat Surface
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Repository Target: <span className="text-[#F5F5F2] font-semibold">{submission.team}</span> ({submission.repository})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('findings')}>
            ALL TEAMS FINDINGS
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('judge-workspace')}>
            GRADE SECURITY
          </Button>
        </div>
      </div>

      {/* Severity Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === 'CRITICAL' ? 'bg-[#FF5C5C]/20 border-[#FF5C5C]' : 'bg-[#111316] border-[#292D32] hover:border-[#FF5C5C]/50'
          }`}
        >
          <span className="text-[10px] text-[#FF5C5C] uppercase block font-bold">CRITICAL SEVERITY</span>
          <div className="text-3xl font-black text-[#FF5C5C] mt-1">{criticals}</div>
          <span className="text-[10px] text-[#92979D]">Immediate RCE / Auth Bypass</span>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'HIGH' ? 'ALL' : 'HIGH')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === 'HIGH' ? 'bg-[#FFB547]/20 border-[#FFB547]' : 'bg-[#111316] border-[#292D32] hover:border-[#FFB547]/50'
          }`}
        >
          <span className="text-[10px] text-[#FFB547] uppercase block font-bold">HIGH SEVERITY</span>
          <div className="text-3xl font-black text-[#FFB547] mt-1">{highs}</div>
          <span className="text-[10px] text-[#92979D]">DoS / Memory Leak / Queue Jam</span>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === 'MEDIUM' ? 'bg-[#FF8A3D]/20 border-[#FF8A3D]' : 'bg-[#111316] border-[#292D32] hover:border-[#FF8A3D]/50'
          }`}
        >
          <span className="text-[10px] text-[#FF8A3D] uppercase block font-bold">MEDIUM SEVERITY</span>
          <div className="text-3xl font-black text-[#FF8A3D] mt-1">{mediums}</div>
          <span className="text-[10px] text-[#92979D]">Outdated Crate Advisory</span>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'LOW' ? 'ALL' : 'LOW')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === 'LOW' ? 'bg-[#38BDF8]/20 border-[#38BDF8]' : 'bg-[#111316] border-[#292D32] hover:border-[#38BDF8]/50'
          }`}
        >
          <span className="text-[10px] text-[#38BDF8] uppercase block font-bold">LOW SEVERITY</span>
          <div className="text-3xl font-black text-[#38BDF8] mt-1">{lows}</div>
          <span className="text-[10px] text-[#92979D]">Informational / Hardening</span>
        </button>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-[#45D483] mx-auto mb-3" />
            <h3 className="text-base font-bold font-mono text-[#F5F5F2]">No Findings In This Category</h3>
            <p className="text-xs font-mono text-[#92979D] mt-1">Target meets automated cybersecurity requirements.</p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-[#FF8A3D]">
              <div className="space-y-3 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#FF5C5C] bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    <Badge variant={item.severity === 'CRITICAL' ? 'danger' : item.severity === 'HIGH' ? 'warning' : 'orange'}>
                      {item.severity}
                    </Badge>
                    <Badge variant="neutral">{item.category}</Badge>
                  </div>

                  <Badge variant={item.status === 'VERIFIED' ? 'warning' : item.status === 'MITIGATED' ? 'success' : 'neutral'}>
                    STATUS: {item.status}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-[#F5F5F2]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#92979D] leading-relaxed">
                  {item.description}
                </p>

                {/* Evidence & Affected File */}
                <div className="bg-[#08090B] p-3 rounded-lg border border-[#1E2227] text-xs space-y-2">
                  <div className="text-[11px] text-[#FF8A3D] flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Affected Target: <strong>{item.affectedFile}</strong></span>
                  </div>
                  <div className="text-[#F5F5F2] font-mono text-[11px] bg-[#111316] p-2 rounded border border-[#292D32]">
                    &gt; {item.evidence}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32] text-xs">
                  <span className="text-[10px] text-[#45D483] uppercase font-bold block mb-1">
                    AI Remediation Advice:
                  </span>
                  <p className="text-[#92979D]">{item.recommendation}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
