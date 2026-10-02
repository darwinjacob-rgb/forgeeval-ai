import React, { useState } from 'react';
import { 
  SearchCode, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileCode, 
  ExternalLink,
  Filter,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RequirementItem, Submission } from '../types';
import { Card, Badge, Button, Input, ProgressBar } from './CommonUI';

interface RequirementMappingViewProps {
  requirements: RequirementItem[];
  submission: Submission;
  onNavigate: (view: string) => void;
}

export const RequirementMappingView: React.FC<RequirementMappingViewProps> = ({
  requirements,
  submission,
  onNavigate
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = requirements.filter(r => {
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchCat = filterCategory === 'ALL' || r.category === filterCategory;
    const matchSearch = r.requirement.toLowerCase().includes(search.toLowerCase()) ||
                        r.code.toLowerCase().includes(search.toLowerCase()) ||
                        r.evidence.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  const satisfiedCount = requirements.filter(r => r.status === 'SATISFIED').length;
  const partialCount = requirements.filter(r => r.status === 'PARTIAL').length;
  const missingCount = requirements.filter(r => r.status === 'MISSING').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">EXTRACTED EVIDENCE TRACEABILITY</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Requirement Mapping Matrix
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Evaluating: <span className="text-[#F5F5F2] font-semibold">{submission.team}</span> &bull; Problem: <span className="text-[#FF8A3D]">{submission.problemTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('code-intel')}>
            VIEW CODE INTEL
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('judge-workspace')}>
            GRADE COMPLIANCE
          </Button>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#111316] border border-[#292D32] p-4 rounded-xl font-mono">
          <span className="text-[10px] text-[#92979D] uppercase block">Total Tracked Specs</span>
          <div className="text-3xl font-black text-[#F5F5F2] mt-1">{requirements.length}</div>
          <span className="text-[10px] text-[#92979D]">Extracted from problem spec</span>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-4 rounded-xl font-mono">
          <span className="text-[10px] text-[#45D483] uppercase block">Satisfied In Code</span>
          <div className="text-3xl font-black text-[#45D483] mt-1">{satisfiedCount}</div>
          <span className="text-[10px] text-[#92979D]">Proven with AST / test logs</span>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-4 rounded-xl font-mono">
          <span className="text-[10px] text-[#FFB547] uppercase block">Partially Met</span>
          <div className="text-3xl font-black text-[#FFB547] mt-1">{partialCount}</div>
          <span className="text-[10px] text-[#92979D]">Under-bounded or limited</span>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-4 rounded-xl font-mono">
          <span className="text-[10px] text-[#FF5C5C] uppercase block">Missing / Unimplemented</span>
          <div className="text-3xl font-black text-[#FF5C5C] mt-1">{missingCount}</div>
          <span className="text-[10px] text-[#92979D]">Zero code or test footprint</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#111316] p-4 rounded-xl border border-[#292D32]">
        <div>
          <label className="text-[10px] font-mono uppercase text-[#92979D] block mb-1">Status Filter</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
          >
            <option value="ALL">All Statuses ({requirements.length})</option>
            <option value="SATISFIED">Satisfied Only ({satisfiedCount})</option>
            <option value="PARTIAL">Partial Only ({partialCount})</option>
            <option value="MISSING">Missing Only ({missingCount})</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-[#92979D] block mb-1">Category Filter</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
          >
            <option value="ALL">All Categories</option>
            <option value="Security">Security</option>
            <option value="Performance">Performance</option>
            <option value="Functional">Functional</option>
            <option value="Testing">Testing</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Documentation">Documentation</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-[#92979D] block mb-1">Keyword Query</label>
          <Input
            placeholder="Search requirement or file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Requirement Rows */}
      <div className="space-y-4">
        {filtered.map((req) => {
          const statusBadge = 
            req.status === 'SATISFIED' ? (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3 h-3 mr-1" /> SATISFIED
              </Badge>
            ) : req.status === 'PARTIAL' ? (
              <Badge variant="warning" size="md">
                <AlertCircle className="w-3 h-3 mr-1" /> PARTIAL
              </Badge>
            ) : (
              <Badge variant="danger" size="md">
                <XCircle className="w-3 h-3 mr-1" /> MISSING
              </Badge>
            );

          return (
            <Card key={req.id} className="hover:border-[#FF6A1A]/40 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Code, Category, Requirement Text */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FF8A3D] bg-[#FF6A1A]/10 border border-[#FF6A1A]/30 px-2 py-0.5 rounded">
                      {req.code}
                    </span>
                    <Badge variant="neutral">{req.category}</Badge>
                    {statusBadge}
                  </div>

                  <h3 className="text-sm font-bold font-mono text-[#F5F5F2]">
                    {req.requirement}
                  </h3>

                  {/* Evidence Box */}
                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#1E2227] font-mono text-xs">
                    <span className="text-[10px] uppercase text-[#92979D] block mb-1">AI Extracted Evidence:</span>
                    <p className="text-[#F5F5F2]">{req.evidence}</p>
                    
                    {req.fileMatch && (
                      <div className="mt-2 pt-2 border-t border-[#1E2227] flex items-center justify-between text-[11px] text-[#92979D]">
                        <span className="flex items-center gap-1.5 text-[#FF8A3D]">
                          <FileCode className="w-3.5 h-3.5" />
                          {req.fileMatch} ({req.lineSpan})
                        </span>
                        <span className="text-[#45D483]">Confidence {req.confidence}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Confidence Metric & Actions */}
                <div className="lg:w-48 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#292D32] pt-3 lg:pt-0 lg:pl-6 space-y-3 font-mono">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#92979D]">CONFIDENCE</span>
                      <span className="text-[#F5F5F2] font-bold">{req.confidence}%</span>
                    </div>
                    <ProgressBar 
                      value={req.confidence} 
                      size="sm" 
                      variant={req.confidence > 90 ? 'success' : req.confidence > 75 ? 'orange' : 'warning'} 
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onNavigate('judge-workspace')}
                  >
                    ANNOTATE
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
