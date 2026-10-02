import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  ShieldAlert, 
  Terminal,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Problem } from '../types';
import { Card, Badge, Button, Input } from './CommonUI';

interface ProblemsViewProps {
  problems: Problem[];
  onSelectProblem: (prob: Problem) => void;
  onNavigate: (view: string) => void;
  onTriggerAnalyze: (probId: string) => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({
  problems,
  onSelectProblem,
  onNavigate,
  onTriggerAnalyze
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = problems.filter(p => {
    const matchCat = filter === 'ALL' || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">HACKATHON TRACK SPECIFICATIONS</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Problem Statements & Specs
          </h1>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => onNavigate('create-problem')}
        >
          CREATE PROBLEM
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111316] p-4 rounded-xl border border-[#292D32]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 font-mono text-xs">
          {['ALL', 'FinTech', 'AI & Agents', 'Cybersecurity', 'Web3 Infrastructure'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filter === cat
                  ? 'bg-[#FF6A1A] text-[#08090B] font-bold'
                  : 'bg-[#181B1F] text-[#92979D] hover:text-[#F5F5F2] border border-[#292D32]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search problems by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((prob) => (
          <Card key={prob.id} className="hover:border-[#FF6A1A]/50 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#FF8A3D] bg-[#FF6A1A]/10 border border-[#FF6A1A]/30 px-2 py-0.5 rounded">
                    {prob.code}
                  </span>
                  <Badge variant="neutral">{prob.category}</Badge>
                </div>

                <Badge variant={prob.difficulty === 'CRITICAL' ? 'danger' : prob.difficulty === 'HARD' ? 'warning' : 'neutral'}>
                  {prob.difficulty}
                </Badge>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold font-mono text-[#F5F5F2] mb-2 leading-snug">
                {prob.title}
              </h3>
              <p className="text-xs text-[#92979D] leading-relaxed mb-4 line-clamp-2">
                {prob.description}
              </p>

              {/* Requirements & Submissions Count */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#181B1F] rounded-lg border border-[#292D32] mb-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#92979D] block">REQUIREMENTS</span>
                  <span className="text-[#F5F5F2] font-bold">{prob.requirementsCount} Verified</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#92979D] block">SUBMISSIONS</span>
                  <span className="text-[#FF8A3D] font-bold">{prob.submissionsCount} Repos</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#92979D] block">STATUS</span>
                  <span className="text-[#45D483] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#45D483]" />
                    {prob.status}
                  </span>
                </div>
              </div>

              {/* Mini Requirements Preview Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {prob.functionalRequirements.slice(0, 2).map((req, i) => (
                  <span key={i} className="text-[10px] font-mono bg-[#111316] border border-[#292D32] text-[#92979D] px-2 py-0.5 rounded truncate max-w-[200px]">
                    {req}
                  </span>
                ))}
                {prob.functionalRequirements.length > 2 && (
                  <span className="text-[10px] font-mono text-[#FF6A1A] self-center">
                    +{prob.functionalRequirements.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#1E2227] flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSelectProblem(prob);
                  onNavigate('requirements');
                }}
              >
                VIEW SPECS
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onSelectProblem(prob);
                    onNavigate('submissions');
                  }}
                >
                  SUBMISSIONS ({prob.submissionsCount})
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Play className="w-3.5 h-3.5" />}
                  onClick={() => onTriggerAnalyze(prob.id)}
                >
                  ANALYZE
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
