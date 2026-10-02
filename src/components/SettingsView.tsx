import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Bell, 
  Key, 
  Database, 
  Save, 
  Check, 
  User, 
  Mail, 
  Terminal,
  Server
} from 'lucide-react';
import { Card, Badge, Button, Input } from './CommonUI';

interface SettingsViewProps {
  onNavigate: (view: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'criteria' | 'ai' | 'system' | 'security' | 'notifications'>('criteria');
  const [saved, setSaved] = useState(false);

  // Criteria Weights
  const [weights, setWeights] = useState({
    requirement: 25,
    codeQuality: 20,
    security: 20,
    testing: 15,
    documentation: 10,
    uiUx: 10
  });

  // AI Inference settings
  const [aiModel, setAiModel] = useState('claude-3-7-sonnet-reasoning');
  const [temperature, setTemperature] = useState(0.1);
  const [strictMemoryChecking, setStrictMemoryChecking] = useState(true);
  const [sandboxTimeoutSec, setSandboxTimeoutSec] = useState(120);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">PLATFORM PARAMETERS</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Platform Settings & AI Configuration
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          {saved ? 'SETTINGS COMMITTED' : 'SAVE CONFIGURATION'}
        </Button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-[#292D32] gap-4 font-mono text-xs overflow-x-auto">
        {[
          { id: 'criteria', label: 'Evaluation Weights' },
          { id: 'ai', label: 'AI Inference Engines' },
          { id: 'system', label: 'Sandbox Runners & Cluster' },
          { id: 'security', label: 'Access Control & API Keys' },
          { id: 'notifications', label: 'Webhook Relays' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition-colors uppercase whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#FF6A1A] text-[#FF8A3D] font-bold'
                : 'border-transparent text-[#92979D] hover:text-[#F5F5F2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Criteria Weights */}
      {activeTab === 'criteria' && (
        <Card title="Dimension Weight Allocation" badge={<Badge variant="orange">100% TOTAL</Badge>}>
          <p className="text-xs font-mono text-[#92979D] mb-6">
            Adjust the mathematical weight assigned to each automated and judicial evaluation criterion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#F5F5F2]">Requirement Compliance</span>
                  <span className="text-[#FF8A3D] font-bold">{weights.requirement}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.requirement}
                  onChange={(e) => setWeights({ ...weights, requirement: parseInt(e.target.value) })}
                  className="w-full accent-[#FF6A1A] bg-[#181B1F] h-1.5 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#F5F5F2]">Code Quality & AST</span>
                  <span className="text-[#FF8A3D] font-bold">{weights.codeQuality}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.codeQuality}
                  onChange={(e) => setWeights({ ...weights, codeQuality: parseInt(e.target.value) })}
                  className="w-full accent-[#FF6A1A] bg-[#181B1F] h-1.5 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#F5F5F2]">Security & Taint Defense</span>
                  <span className="text-[#FF8A3D] font-bold">{weights.security}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.security}
                  onChange={(e) => setWeights({ ...weights, security: parseInt(e.target.value) })}
                  className="w-full accent-[#FF6A1A] bg-[#181B1F] h-1.5 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#F5F5F2]">Testing Rigor & Coverage</span>
                  <span className="text-[#FF8A3D] font-bold">{weights.testing}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.testing}
                  onChange={(e) => setWeights({ ...weights, testing: parseInt(e.target.value) })}
                  className="w-full accent-[#FF6A1A] bg-[#181B1F] h-1.5 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#F5F5F2]">Documentation & ADRs</span>
                  <span className="text-[#FF8A3D] font-bold">{weights.documentation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.documentation}
                  onChange={(e) => setWeights({ ...weights, documentation: parseInt(e.target.value) })}
                  className="w-full accent-[#FF6A1A] bg-[#181B1F] h-1.5 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#F5F5F2]">UI/UX Experience</span>
                  <span className="text-[#FF8A3D] font-bold">{weights.uiUx}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.uiUx}
                  onChange={(e) => setWeights({ ...weights, uiUx: parseInt(e.target.value) })}
                  className="w-full accent-[#FF6A1A] bg-[#181B1F] h-1.5 rounded-lg"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: AI Config */}
      {activeTab === 'ai' && (
        <Card title="AI AST Reasoning Engine Parameters">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#92979D] uppercase block mb-1">Primary LLM Analysis Backend</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg p-2.5 focus:outline-none focus:border-[#FF6A1A]"
              >
                <option value="claude-3-7-sonnet-reasoning">Claude 3.7 Sonnet (Extended Reasoning)</option>
                <option value="gpt-4o-code-intel">GPT-4o Code Intelligence Cluster</option>
                <option value="gemini-1-5-pro-ast">Gemini 1.5 Pro AST Context Engine</option>
                <option value="deepseek-r1-eval">DeepSeek-R1 Local Air-gapped Host</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#92979D] uppercase block mb-1">Sampling Temperature (Determinism)</label>
              <input
                type="number"
                step="0.05"
                min="0.0"
                max="1.0"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg p-2.5 focus:outline-none focus:border-[#FF6A1A]"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: System & Sandbox */}
      {activeTab === 'system' && (
        <Card title="Sandbox Isolation Cluster">
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F5F5F2] block">eBPF Telemetry Hook Enforcement</span>
                <span className="text-[#92979D] text-[11px]">Trace syscall latency and detect rogue file encryption bursts</span>
              </div>
              <input
                type="checkbox"
                checked={strictMemoryChecking}
                onChange={(e) => setStrictMemoryChecking(e.target.checked)}
                className="accent-[#FF6A1A] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#181B1F] border border-[#292D32] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F5F5F2] block">Container Execution Timeout (Seconds)</span>
                <span className="text-[#92979D] text-[11px]">Hard SIGKILL ceiling for runaway build processes</span>
              </div>
              <input
                type="number"
                value={sandboxTimeoutSec}
                onChange={(e) => setSandboxTimeoutSec(parseInt(e.target.value))}
                className="w-24 bg-[#111316] text-[#F5F5F2] border border-[#292D32] rounded p-1 text-center font-bold"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <Card title="Admin Credentials & API Key Relay">
          <div className="space-y-4 font-mono text-xs max-w-xl">
            <Input label="Admin Relayed Secret Token" type="password" value="sk_forgeval_live_83917401a9" readOnly />
            <Input label="GitHub Enterprise Token" type="password" value="ghp_internal_mirror_9921b" readOnly />
            <Button variant="outline" size="sm">ROTATE API KEYS</Button>
          </div>
        </Card>
      )}

      {/* Tab 5: Webhooks */}
      {activeTab === 'notifications' && (
        <Card title="Outbound Webhook Notifications">
          <div className="space-y-4 font-mono text-xs max-w-xl">
            <Input label="Discord / Slack Judge Alert Webhook" placeholder="https://discord.com/api/webhooks/..." />
            <Input label="Score Publication Endpoint" placeholder="https://hackathon.internal/api/v1/scores" />
            <Button variant="primary" size="sm">TEST WEBHOOK FIRING</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

// Admin Profile View
export const ProfileView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs uppercase tracking-widest text-[#FF8A3D]">AUTHENTICATED OPERATOR</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F5F2] uppercase">
            Admin Profile & Judicial Signature
          </h1>
        </div>

        <Button variant="secondary" size="sm" onClick={() => onNavigate('dashboard')}>
          BACK TO DASHBOARD
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center md:col-span-1">
          <div className="w-20 h-20 rounded-2xl bg-[#FF6A1A] mx-auto flex items-center justify-center font-black text-[#08090B] text-2xl mb-4 orange-glow">
            MV
          </div>
          <h2 className="text-lg font-bold text-[#F5F5F2]">Marcus Vance</h2>
          <p className="text-xs text-[#92979D] mt-0.5">Chief Evaluation Officer</p>
          <div className="mt-4 flex justify-center">
            <Badge variant="orange">SIGNER LEVEL 4</Badge>
          </div>
        </Card>

        <Card title="Operator Telemetry" className="md:col-span-2">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#1E2227]">
              <span className="text-[#92979D]">Public Signature Key:</span>
              <span className="text-[#F5F5F2] font-mono">ed25519:78a1...94e2</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1E2227]">
              <span className="text-[#92979D]">Verified Reviews:</span>
              <span className="text-[#45D483] font-bold">14 Submissions</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1E2227]">
              <span className="text-[#92979D]">Assigned Tracks:</span>
              <span className="text-[#F5F5F2]">FinTech & Distributed Systems</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#92979D]">Cluster Node:</span>
              <span className="text-[#FF8A3D]">control-plane-us-east-1</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
