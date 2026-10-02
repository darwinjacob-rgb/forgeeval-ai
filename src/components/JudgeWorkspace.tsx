import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  FolderGit2, 
  FileCode, 
  Layers, 
  ShieldAlert, 
  Save, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Submission, JudgeEvaluation, RequirementItem } from '../types';
import { Card, Badge, Button, Input, ProgressBar } from './CommonUI';

interface JudgeWorkspaceProps {
  submission: Submission;
  requirements: RequirementItem[];
  onSaveEvaluation: (evaluation: JudgeEvaluation) => void;
  onNavigate: (view: string) => void;
}

export const JudgeWorkspace: React.FC<JudgeWorkspaceProps> = ({
  submission,
  requirements,
  onSaveEvaluation,
  onNavigate
}) => {
  // Local judge grading state
  const [scores, setScores] = useState({
    requirementCompliance: submission.criteriaScores.requirement,
    codeQuality: submission.criteriaScores.codeQuality,
    security: submission.criteriaScores.security,
    testing: submission.criteriaScores.testing,
    documentation: submission.criteriaScores.documentation,
    uiUx: submission.criteriaScores.uiUx
  });

  const [comments, setComments] = useState({
    strengths: 'Outstanding zero-allocation stream parsing and robust test fixture reproduction.',
    flaws: 'BFS traversal loop is depth-limited to 2 instead of 3 hops specified in the prompt requirement.',
    evidenceNotes: 'Traced verifier.rs and validated k6 stress latency benchmark logs.'
  });

  const [finalNotes, setFinalNotes] = useState('Recommended candidate for Top 3 Grand Prize.');
  const [saved, setSaved] = useState(false);

  const handleScoreChange = (dim: keyof typeof scores, val: number) => {
    setScores(prev => ({
      ...prev,
      [dim]: Math.min(100, Math.max(0, val))
    }));
  };

  const calculatedWeightedScore = (
    scores.requirementCompliance * 0.25 +
    scores.codeQuality * 0.20 +
    scores.security * 0.20 +
    scores.testing * 0.15 +
    scores.documentation * 0.10 +
    scores.uiUx * 0.10
  ).toFixed(1);

  const handleCommit = () => {
    const evalData: JudgeEvaluation = {
      submissionId: submission.id,
      judgeName: 'Marcus Vance',
      timestamp: new Date().toISOString(),
      scores,
      comments,
      finalNotes,
      verified: true
    };
    onSaveEvaluation(evalData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">DELIBERATION & SCORING DESK</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Judge Evaluation Workspace
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Reviewing Team: <span className="text-[#F5F5F2] font-semibold">{submission.team}</span> &bull; Problem Track: <span className="text-[#FF8A3D]">{submission.problemTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('results')}>
            VIEW RESULTS MATRIX
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Save className="w-4 h-4" />}
            onClick={handleCommit}
          >
            {saved ? 'SCORE COMMITTED!' : 'COMMIT FINAL SCORE'}
          </Button>
        </div>
      </div>

      {/* 3-Column Studio Layout: Left: Sub Info | Center: Evidence | Right: Scoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Submission Metadata & Repo Quick Look (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card title="Target Dossier">
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32]">
                <span className="text-[10px] text-[#92979D] uppercase block">Team Name</span>
                <span className="text-sm font-bold text-[#F5F5F2]">{submission.team}</span>
              </div>

              <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32]">
                <span className="text-[10px] text-[#92979D] uppercase block">Repository & Branch</span>
                <a 
                  href={submission.repository} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#FF8A3D] text-[11px] truncate flex items-center gap-1 hover:underline mt-0.5"
                >
                  <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{submission.repository.replace('https://github.com/', '')}</span>
                </a>
                <span className="text-[10px] text-[#92979D] block mt-1">Branch: {submission.branch}</span>
              </div>

              <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32]">
                <span className="text-[10px] text-[#92979D] uppercase block">Primary Tech Stack</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {submission.frameworks.map((fw, i) => (
                    <span key={i} className="text-[10px] bg-[#111316] border border-[#292D32] px-1.5 py-0.5 rounded text-[#F5F5F2]">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32]">
                <span className="text-[10px] text-[#92979D] uppercase block">Sandbox Test Summary</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[#45D483] font-bold">48 / 48 Passed</span>
                  <span className="text-[10px] text-[#92979D]">Cover: {submission.metrics.testCoverage}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Column: Evidence & AI Analysis Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card title="AI Traced Evidence Digest" badge={<Badge variant="orange">EVIDENCE-DRIVEN</Badge>}>
            <div className="space-y-3 font-mono text-xs max-h-[580px] overflow-y-auto pr-1">
              {requirements.slice(0, 5).map((req) => (
                <div key={req.id} className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF8A3D]">{req.code}</span>
                    <Badge variant={req.status === 'SATISFIED' ? 'success' : req.status === 'PARTIAL' ? 'warning' : 'danger'}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="font-semibold text-[#F5F5F2] text-[11px]">{req.requirement}</div>
                  <div className="p-2 rounded bg-[#08090B] border border-[#1E2227] text-[10px] text-[#92979D]">
                    <span className="text-[#45D483] block font-bold mb-0.5">Automated Evidence:</span>
                    {req.evidence}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Judge Score Input & Comments (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Judge Deliberation Panel" glow>
            {/* Realtime Weighted Score Header */}
            <div className="p-4 rounded-xl bg-[#08090B] border border-[#FF6A1A]/40 text-center mb-4 font-mono">
              <span className="text-[10px] uppercase text-[#92979D] tracking-wider block">Computed Weighted Score</span>
              <div className="text-4xl font-black text-[#FF6A1A] my-1">
                {calculatedWeightedScore}
                <span className="text-sm font-normal text-[#92979D]"> / 100</span>
              </div>
              <span className="text-[10px] text-[#92979D]">Weights: Req 25% | Code 20% | Sec 20% | Test 15% | Doc 10% | UI 10%</span>
            </div>

            {/* Criteria Sliders / Inputs */}
            <div className="space-y-3 font-mono text-xs">
              {[
                { id: 'requirementCompliance', label: 'Requirement Compliance (25%)', val: scores.requirementCompliance },
                { id: 'codeQuality', label: 'Code Quality & AST (20%)', val: scores.codeQuality },
                { id: 'security', label: 'Security & Taint Defense (20%)', val: scores.security },
                { id: 'testing', label: 'Testing Rigor & Coverage (15%)', val: scores.testing },
                { id: 'documentation', label: 'Documentation & ADRs (10%)', val: scores.documentation },
                { id: 'uiUx', label: 'UI/UX & Telemetry (10%)', val: scores.uiUx }
              ].map((c) => (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[#92979D]">{c.label}</span>
                    <span className="text-xs font-bold text-[#F5F5F2]">{c.val}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={c.val}
                    onChange={(e) => handleScoreChange(c.id as any, parseInt(e.target.value))}
                    className="w-full accent-[#FF6A1A] bg-[#181B1F] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Qualitative Notes */}
            <div className="space-y-3 pt-4 border-t border-[#292D32] mt-4 font-mono text-xs">
              <div>
                <label className="text-[10px] uppercase text-[#45D483] font-bold block mb-1">Observed Strengths</label>
                <textarea
                  rows={2}
                  value={comments.strengths}
                  onChange={(e) => setComments({ ...comments, strengths: e.target.value })}
                  className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF6A1A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#FF5C5C] font-bold block mb-1">Observed Flaws / Gaps</label>
                <textarea
                  rows={2}
                  value={comments.flaws}
                  onChange={(e) => setComments({ ...comments, flaws: e.target.value })}
                  className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF6A1A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#FF8A3D] font-bold block mb-1">Final Judge Notes</label>
                <textarea
                  rows={2}
                  value={finalNotes}
                  onChange={(e) => setFinalNotes(e.target.value)}
                  className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF6A1A]"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleCommit}
              >
                SAVE EVALUATION VERDICT
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
