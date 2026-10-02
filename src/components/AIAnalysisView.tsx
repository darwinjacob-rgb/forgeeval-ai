import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  FileCode2, 
  Play, 
  RotateCw, 
  ExternalLink,
  ChevronRight,
  Flame,
  Activity,
  Award
} from 'lucide-react';
import { Submission, RequirementItem, Finding } from '../types';
import { Card, Badge, Button, ProgressBar } from './CommonUI';

interface AIAnalysisViewProps {
  submission: Submission;
  requirements: RequirementItem[];
  findings: Finding[];
  onNavigate: (view: string) => void;
}

export const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({
  submission,
  requirements,
  findings,
  onNavigate
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(7); // 0-7 finished

  const analysisDimensions = [
    { id: 'req', name: 'Requirement Mapping & AST Extraction', progress: 100, status: 'COMPLETED', time: '1.2s' },
    { id: 'code', name: 'Code Quality & Structural Syntax', progress: 100, status: 'COMPLETED', time: '2.8s' },
    { id: 'sec', name: 'Security Audit & Memory Bounds', progress: 100, status: 'COMPLETED', time: '3.1s' },
    { id: 'runtime', name: 'Sandboxed Runtime & Latency Check', progress: 100, status: 'COMPLETED', time: '4.4s' },
    { id: 'test', name: 'Test Suite Execution & Coverage', progress: 100, status: 'COMPLETED', time: '1.9s' },
    { id: 'doc', name: 'Documentation & Architecture Specs', progress: 100, status: 'COMPLETED', time: '0.8s' },
    { id: 'ui', name: 'UI / UX Interaction Verification', progress: 100, status: 'COMPLETED', time: '1.5s' }
  ];

  const handleReanalyze = () => {
    setAnalyzing(true);
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          setAnalyzing(false);
          return 7;
        }
        return prev + 1;
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">AI REASONING CORE & PIPELINE</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Multimodal Analysis Engine
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Evaluating submission: <span className="text-[#F5F5F2] font-bold">{submission.team}</span> ({submission.problemTitle})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />}
            onClick={handleReanalyze}
            disabled={analyzing}
          >
            {analyzing ? 'ANALYZING...' : 'RERUN PIPELINE'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('judge-workspace')}
          >
            TRANSMIT TO JUDGES
          </Button>
        </div>
      </div>

      {/* Progress Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7 Dimensions Process Status */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-[#111316] p-4 rounded-xl border border-[#292D32]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono uppercase text-[#F5F5F2] font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#FF6A1A]" />
                Analysis Pipeline Stages
              </span>
              <Badge variant={analyzing ? 'orange' : 'success'} pulse={analyzing}>
                {analyzing ? 'IN PROGRESS' : 'ALL VECTORS EVALUATED'}
              </Badge>
            </div>

            <div className="space-y-3">
              {analysisDimensions.map((dim, idx) => {
                const isCurrent = analyzing && activeStep === idx;
                const isDone = !analyzing || activeStep > idx;

                return (
                  <div 
                    key={dim.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent 
                        ? 'bg-[#181B1F] border-[#FF6A1A] shadow-[0_0_15px_rgba(255,106,26,0.2)]'
                        : isDone
                        ? 'bg-[#111316] border-[#292D32]'
                        : 'bg-[#08090B] border-[#1E2227] opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#FF6A1A] animate-ping' : isDone ? 'bg-[#45D483]' : 'bg-[#292D32]'}`} />
                        <span className={`font-semibold ${isDone ? 'text-[#F5F5F2]' : 'text-[#92979D]'}`}>
                          {dim.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#92979D]">{dim.time}</span>
                        <Badge variant={isDone ? 'success' : isCurrent ? 'orange' : 'neutral'}>
                          {isDone ? 'COMPLETED' : isCurrent ? 'RUNNING' : 'QUEUED'}
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar 
                      value={isDone ? 100 : isCurrent ? 60 : 0} 
                      size="sm" 
                      variant={isDone ? 'success' : 'orange'} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Synthesis & Score Gauge */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Composite Synthesis Vector" badge={<Badge variant="orange">WEIGHTED</Badge>}>
            <div className="text-center py-4 border-b border-[#292D32]">
              <span className="text-[11px] font-mono text-[#92979D] uppercase block">Normalized Overall Quality</span>
              <div className="text-5xl font-black font-mono text-[#F5F5F2] my-2">
                {submission.overallScore.toFixed(1)}
                <span className="text-lg text-[#92979D] font-normal"> / 100</span>
              </div>
              <Badge variant="success">RECOMMENDED FOR FINALIST ROUND</Badge>
            </div>

            <div className="pt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-[#92979D]">
                <span>Requirement Adherence</span>
                <span className="text-[#F5F5F2] font-bold">{submission.criteriaScores.requirement}% (High)</span>
              </div>
              <div className="flex justify-between items-center text-[#92979D]">
                <span>Vulnerabilities Flagged</span>
                <span className="text-[#FF8A3D] font-bold">{submission.metrics.vulnerabilitiesCount} Medium CVE</span>
              </div>
              <div className="flex justify-between items-center text-[#92979D]">
                <span>Execution Efficiency</span>
                <span className="text-[#45D483] font-bold">P99 4.62ms (Pass)</span>
              </div>
              <div className="flex justify-between items-center text-[#92979D]">
                <span>AI Confidence Rating</span>
                <span className="text-[#FF8A3D] font-bold">96.8%</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#292D32] flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-1/2"
                onClick={() => onNavigate('requirements')}
              >
                CHECK EVIDENCE
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-1/2"
                onClick={() => onNavigate('security')}
              >
                SEC FINDINGS
              </Button>
            </div>
          </Card>

          {/* Quick Terminal Snippet */}
          <Card title="Inference Console Stream" badge={<Badge variant="neutral">LIVE</Badge>}>
            <div className="bg-[#08090B] p-3 rounded-lg border border-[#292D32] font-mono text-[11px] text-[#92979D] space-y-1.5 overflow-hidden">
              <div className="text-[#45D483]">&gt; [OK] AST Symbol Table generated: 148 functions mapped</div>
              <div>&gt; [TRACE] Sliding window aggregator confirmed in engine.rs:192</div>
              <div>&gt; [TEST] Target latency 4.8ms achieved (actual 4.62ms)</div>
              <div className="text-[#FFB547]">&gt; [WARN] Depth search capped at 2 hops (spec asked 3 hops)</div>
              <div className="text-[#F5F5F2]">&gt; [FINAL] Ready for Judge deliberation</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
