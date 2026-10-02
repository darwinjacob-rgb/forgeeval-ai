import React, { useState } from 'react';
import { 
  FilePlus, 
  ArrowLeft, 
  Check, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  FileCode2, 
  Layout, 
  BookOpen,
  Plus
} from 'lucide-react';
import { Problem } from '../types';
import { Card, Button, Input } from './CommonUI';

interface CreateProblemViewProps {
  onCancel: () => void;
  onCreate: (prob: Problem) => void;
}

export const CreateProblemView: React.FC<CreateProblemViewProps> = ({ onCancel, onCreate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Problem['category']>('Distributed Systems');
  const [difficulty, setDifficulty] = useState<Problem['difficulty']>('HARD');
  const [description, setDescription] = useState('');
  
  // Specific requirements inputs
  const [inputReqs, setInputReqs] = useState('Protobuf schema v3 definition\nTLS certificate thumbprint\nNonce seed header');
  const [outputReqs, setOutputReqs] = useState('Merkle execution proof receipt\nJSON event stream vector\nZero memory trace exit');
  const [funcReqs, setFuncReqs] = useState('Sliding window aggregation over 10s\nConsensus roundtrip under 300ms');
  const [techReqs, setTechReqs] = useState('Rust or Go 1.22+ runtime\nNo external C dynamic libraries');
  const [secReqs, setSecReqs] = useState('Strict memory safety\nNo hardcoded secrets\nJWT signature verification');
  const [perfReqs, setPerfReqs] = useState('P99 latency < 5ms\nMemory capped at 512MB RSS');
  const [uiUxReqs, setUiUxReqs] = useState('Live WebSocket status indicator\nDark command center telemetry theme');
  const [docReqs, setDocReqs] = useState('ADR 001 design decision document\nDeterministic Dockerfile build steps');

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const newProb: Problem = {
      id: `prob-${Date.now()}`,
      code: `FG-${Math.floor(100 + Math.random() * 900)}`,
      title: title || 'Distributed Consensus Layer',
      category,
      difficulty,
      submissionsCount: 0,
      requirementsCount: 16,
      status: 'ACTIVE',
      deadline: '2026-10-31T23:59:00Z',
      description: description || 'High-throughput fault-tolerant engine with cryptographic trace verifiability.',
      inputRequirements: inputReqs.split('\n').filter(Boolean),
      outputRequirements: outputReqs.split('\n').filter(Boolean),
      functionalRequirements: funcReqs.split('\n').filter(Boolean),
      technicalRequirements: techReqs.split('\n').filter(Boolean),
      securityRequirements: secReqs.split('\n').filter(Boolean),
      performanceRequirements: perfReqs.split('\n').filter(Boolean),
      uiUxRequirements: uiUxReqs.split('\n').filter(Boolean),
      docRequirements: docReqs.split('\n').filter(Boolean)
    };

    setTimeout(() => {
      setSaving(false);
      onCreate(newProb);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-[#292D32]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={onCancel}>
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold font-mono text-[#F5F5F2] uppercase">
              Configure New Problem Statement
            </h1>
            <p className="text-xs font-mono text-[#92979D]">
              Define automated test boundaries and AST extraction criteria for hackathon participants.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            CANCEL
          </Button>
          <Button variant="primary" size="sm" loading={saving} onClick={handleSubmit}>
            CREATE PROBLEM SPEC
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Metadata */}
        <Card title="1. Track Metadata & Identification">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Problem Title"
                placeholder="e.g. Autonomous Fraud Sentinel: Zero-Latency Transaction Interceptor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono tracking-wider uppercase text-[#92979D] font-medium block mb-1.5">
                Category Track
              </label>
              <select
                className="w-full bg-[#111316] text-[#F5F5F2] border border-[#292D32] rounded-[10px] px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="FinTech">FinTech</option>
                <option value="AI & Agents">AI & Agents</option>
                <option value="Distributed Systems">Distributed Systems</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Web3 Infrastructure">Web3 Infrastructure</option>
                <option value="DevOps & Tooling">DevOps & Tooling</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono tracking-wider uppercase text-[#92979D] font-medium block mb-1.5">
                Difficulty Evaluation Ceiling
              </label>
              <select
                className="w-full bg-[#111316] text-[#F5F5F2] border border-[#292D32] rounded-[10px] px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="CRITICAL">CRITICAL (eBPF, Kernel, Zero-Knowledge)</option>
                <option value="HARD">HARD (Distributed Consensus, High-Concurrency)</option>
                <option value="MEDIUM">MEDIUM (Full-Stack Streaming & State)</option>
                <option value="EASY">EASY (Standard CRUD & Tooling)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-mono tracking-wider uppercase text-[#92979D] font-medium block mb-1.5">
                Problem Description & Objective
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#111316] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-sm font-mono focus:outline-none focus:border-[#FF6A1A]"
                placeholder="High-level engineering mission statement describing problem, adversary models, and architectural intent..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Input & Output Payloads */}
        <Card title="2. Payload & Boundary Interfaces">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-[#FF8A3D] font-semibold block mb-1">
                Input Requirements (One per line)
              </label>
              <textarea
                rows={4}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={inputReqs}
                onChange={(e) => setInputReqs(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-[#FF8A3D] font-semibold block mb-1">
                Output Requirements (One per line)
              </label>
              <textarea
                rows={4}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={outputReqs}
                onChange={(e) => setOutputReqs(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Multi-Dimensional Requirements Specification */}
        <Card title="3. Multi-Dimensional Evaluation Criteria">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono uppercase text-[#F5F5F2] font-bold flex items-center gap-2 mb-1.5">
                <FileCode2 className="w-4 h-4 text-[#FF6A1A]" />
                Functional Requirements
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={funcReqs}
                onChange={(e) => setFuncReqs(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#F5F5F2] font-bold flex items-center gap-2 mb-1.5">
                <Cpu className="w-4 h-4 text-[#FF6A1A]" />
                Technical & Language Constraints
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={techReqs}
                onChange={(e) => setTechReqs(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#F5F5F2] font-bold flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF5C5C]" />
                Security & Threat Defense Criteria
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={secReqs}
                onChange={(e) => setSecReqs(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#F5F5F2] font-bold flex items-center gap-2 mb-1.5">
                <Terminal className="w-4 h-4 text-[#45D483]" />
                Performance & Latency Thresholds
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={perfReqs}
                onChange={(e) => setPerfReqs(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#F5F5F2] font-bold flex items-center gap-2 mb-1.5">
                <Layout className="w-4 h-4 text-[#38BDF8]" />
                UI/UX Requirements
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={uiUxReqs}
                onChange={(e) => setUiUxReqs(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#F5F5F2] font-bold flex items-center gap-2 mb-1.5">
                <BookOpen className="w-4 h-4 text-[#FFB547]" />
                Documentation & Verifiability
              </label>
              <textarea
                rows={3}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-[10px] p-3 text-xs font-mono focus:outline-none focus:border-[#FF6A1A]"
                value={docReqs}
                onChange={(e) => setDocReqs(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#292D32]">
          <Button variant="secondary" size="lg" onClick={onCancel}>
            DISCARD
          </Button>
          <Button variant="primary" size="lg" loading={saving} type="submit">
            COMMIT PROBLEM DEFINITION
          </Button>
        </div>
      </form>
    </div>
  );
};
