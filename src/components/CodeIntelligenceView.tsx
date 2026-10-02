import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Code2, 
  Database, 
  KeyRound, 
  Boxes, 
  FileCode, 
  FolderTree, 
  GitCommit, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Submission } from '../types';
import { Card, Badge, Button, ProgressBar } from './CommonUI';

interface CodeIntelligenceViewProps {
  submission: Submission;
  onNavigate: (view: string) => void;
}

export const CodeIntelligenceView: React.FC<CodeIntelligenceViewProps> = ({
  submission,
  onNavigate
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('crates/sentinel-core/src/engine.rs');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">DEEP SYNTACTIC & ARCHITECTURAL AUDIT</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Code Intelligence & AST Analytics
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Analyzed target: <span className="text-[#F5F5F2] font-semibold">{submission.team}</span> ({submission.repository})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('security')}>
            SECURITY VULNERABILITIES
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('runtime')}>
            RUNTIME HARNESS
          </Button>
        </div>
      </div>

      {/* 4-Panel Metric Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <span className="text-[10px] font-mono text-[#92979D] uppercase block">Language Composition</span>
          <div className="text-xl font-bold font-mono text-[#F5F5F2] mt-1">Rust 78% / TS 22%</div>
          <div className="w-full h-1.5 bg-[#181B1F] rounded-full overflow-hidden mt-2 flex">
            <div className="bg-[#FF6A1A] h-full" style={{ width: '78%' }} />
            <div className="bg-[#38BDF8] h-full" style={{ width: '22%' }} />
          </div>
        </Card>

        <Card>
          <span className="text-[10px] font-mono text-[#92979D] uppercase block">Cyclomatic Complexity</span>
          <div className="text-xl font-bold font-mono text-[#45D483] mt-1">7.2 (Optimal)</div>
          <p className="text-[10px] font-mono text-[#92979D] mt-1">Standard target &lt; 10.0</p>
        </Card>

        <Card>
          <span className="text-[10px] font-mono text-[#92979D] uppercase block">Memory Model Safety</span>
          <div className="text-xl font-bold font-mono text-[#F5F5F2] mt-1">100% Safe Rust</div>
          <p className="text-[10px] font-mono text-[#45D483] mt-1">0 `unsafe` blocks located</p>
        </Card>

        <Card>
          <span className="text-[10px] font-mono text-[#92979D] uppercase block">Modular Cohesion</span>
          <div className="text-xl font-bold font-mono text-[#FF8A3D] mt-1">Grade A (94/100)</div>
          <p className="text-[10px] font-mono text-[#92979D] mt-1">Decoupled domain crates</p>
        </Card>
      </div>

      {/* Structural Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Structure & Modules */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Architecture & Subsystems" badge={<Badge variant="orange">DECONSTRUCTED</Badge>}>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32]">
                <div className="flex items-center gap-2 text-[#FF8A3D] font-bold mb-1">
                  <Boxes className="w-4 h-4 text-[#FF6A1A]" />
                  <span>Streaming Ingestion Engine</span>
                </div>
                <p className="text-[#92979D] text-[11px]">
                  Multi-producer lockfree mpsc pipeline feeding into Tokio tasks. Memory consumption bounded via backpressure token channel.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32]">
                <div className="flex items-center gap-2 text-[#F5F5F2] font-bold mb-1">
                  <Database className="w-4 h-4 text-[#38BDF8]" />
                  <span>State Storage: RocksDB + In-Memory DashMap</span>
                </div>
                <p className="text-[#92979D] text-[11px]">
                  Zero serialization penalty on read path. Bloom filter pre-checks reduce disk read amplification by 92%.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32]">
                <div className="flex items-center gap-2 text-[#F5F5F2] font-bold mb-1">
                  <KeyRound className="w-4 h-4 text-[#45D483]" />
                  <span>Cryptographic Attestation & Auth</span>
                </div>
                <p className="text-[#92979D] text-[11px]">
                  Ring library ED25519 node signature verification. Constant-time comparison defends against side-channel latency leaks.
                </p>
              </div>
            </div>
          </Card>

          <Card title="File Browser for AST Inspector">
            <div className="space-y-1 font-mono text-xs">
              {[
                'crates/sentinel-core/src/engine.rs',
                'crates/sentinel-core/src/graph.rs',
                'crates/sentinel-core/src/verifier.rs',
                'tests/integration_stress_spec.rs'
              ].map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                    selectedFile === f ? 'bg-[#FF6A1A]/15 text-[#FF8A3D] border border-[#FF6A1A]/40' : 'text-[#92979D] hover:bg-[#181B1F]'
                  }`}
                >
                  <span className="truncate">{f}</span>
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Code Viewer / Syntax Inspector */}
        <div className="lg:col-span-7">
          <Card 
            title={`Source Code Inspector: ${selectedFile.split('/').pop()}`}
            badge={<Badge variant="neutral">READONLY AST</Badge>}
          >
            <div className="bg-[#08090B] p-4 rounded-lg border border-[#292D32] font-mono text-xs text-[#F5F5F2] overflow-x-auto">
              <pre className="leading-relaxed">
{`// Auto-extracted AST trace from ${selectedFile}
use std::sync::Arc;
use tokio::sync::mpsc;
use arc_swap::ArcSwap;

/// Autonomous sliding window transaction classification engine
pub struct SentinelEngine {
    state_matrix: Arc<ArcSwap<RuleGraph>>,
    ingress_tx: mpsc::Sender<TransactionPayload>,
    telemetry: Arc<MetricsCollector>,
}

impl SentinelEngine {
    #[inline(always)]
    pub async fn classify_batch(&self, batch: Vec<TransactionPayload>) -> Result<VerdictVector, EngineError> {
        // REQ-PERF-01: Zero allocation fast path
        let active_graph = self.state_matrix.load();
        let mut results = Vec::with_capacity(batch.len());
        
        for item in batch {
            let score = active_graph.traverse_risk_edges(&item.origin_iban, 2)?;
            results.push(score);
        }
        
        Ok(VerdictVector::from(results))
    }
}`}
              </pre>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#181B1F] border border-[#292D32] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#45D483]" />
                <span className="text-[#92979D]">AST Rule Match:</span>
                <span className="text-[#F5F5F2] font-bold">ArcSwap pointer reload validated</span>
              </div>
              <span className="text-[#FF8A3D]">Lines 12-28</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
