import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  Server,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Submission } from '../types';
import { Card, Badge, Button, ProgressBar } from './CommonUI';

interface RuntimeTestingViewProps {
  submission: Submission;
  onNavigate: (view: string) => void;
}

export const RuntimeTestingView: React.FC<RuntimeTestingViewProps> = ({
  submission,
  onNavigate
}) => {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState(submission.runtimeLogs);

  const handleRerun = () => {
    setRunning(true);
    setLogs([
      { timestamp: '00:00:00.010', level: 'SYSTEM', message: 'Re-initializing ephemeral container sandbox on worker-node-04...' },
      { timestamp: '00:00:00.412', level: 'INFO', message: 'Cloning commit sha 7f9a2c3 into ephemeral ramdisk...' }
    ]);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        { timestamp: '00:00:01.890', level: 'INFO', message: 'Invoking test harness: cargo test --release -- --nocapture' },
        { timestamp: '00:00:05.120', level: 'INFO', message: 'Running test_latency_under_50k_qps ... pass (4.62ms)' }
      ]);
    }, 700);

    setTimeout(() => {
      setLogs(submission.runtimeLogs);
      setRunning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#45D483] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">DETERMINISTIC SANDBOX RUNNER</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Runtime Testing & Execution Sandbox
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Live execution profile: <span className="text-[#F5F5F2] font-semibold">{submission.team}</span> &bull; Status: <span className="text-[#45D483]">{submission.buildStatus}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />}
            onClick={handleRerun}
            disabled={running}
          >
            {running ? 'TESTING...' : 'RE-EXECUTE SANDBOX'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('judge-workspace')}
          >
            SCORE PERFORMANCE
          </Button>
        </div>
      </div>

      {/* KPI Diagnostic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="bg-[#111316] border border-[#292D32] p-3 rounded-xl">
          <span className="text-[10px] text-[#92979D] uppercase block">Build Status</span>
          <div className="text-lg font-bold text-[#45D483] mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {submission.buildStatus}
          </div>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-3 rounded-xl">
          <span className="text-[10px] text-[#92979D] uppercase block">Test Suites</span>
          <div className="text-lg font-bold text-[#F5F5F2] mt-1">48 / 48 PASS</div>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-3 rounded-xl">
          <span className="text-[10px] text-[#92979D] uppercase block">Execution Time</span>
          <div className="text-lg font-bold text-[#FF8A3D] mt-1">{submission.executionTime}</div>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-3 rounded-xl">
          <span className="text-[10px] text-[#92979D] uppercase block">Exit Code</span>
          <div className="text-lg font-bold text-[#45D483] mt-1">{submission.exitCode} (SUCCESS)</div>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-3 rounded-xl">
          <span className="text-[10px] text-[#92979D] uppercase block">Warnings</span>
          <div className="text-lg font-bold text-[#FFB547] mt-1">1 Non-fatal</div>
        </div>

        <div className="bg-[#111316] border border-[#292D32] p-3 rounded-xl">
          <span className="text-[10px] text-[#92979D] uppercase block">Errors</span>
          <div className="text-lg font-bold text-[#45D483] mt-1">0 Fatal</div>
        </div>
      </div>

      {/* Terminal Style Execution Console */}
      <Card 
        title="Live Container STDOUT / STDERR Telemetry" 
        badge={<Badge variant="orange" pulse>SANDBOX STREAM</Badge>}
        action={
          <div className="flex items-center gap-2 text-xs font-mono text-[#92979D]">
            <span>NODE: sand-us-east-49</span>
            <span>MEM: 1.42GB / 2.0GB</span>
          </div>
        }
      >
        <div className="bg-[#050608] p-4 rounded-xl border border-[#292D32] font-mono text-xs overflow-x-auto min-h-[340px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2227] text-[#92979D] mb-3 text-[11px]">
            <span>$ forgerun --isolate=seccomp --timeout=120s --target=cargo-test</span>
            <span className="text-[#45D483]">CONNECTED</span>
          </div>

          <div className="space-y-1.5 leading-relaxed">
            {logs.map((log, i) => {
              const levelColor = 
                log.level === 'SYSTEM' ? 'text-[#FF8A3D]' :
                log.level === 'INFO' ? 'text-[#38BDF8]' :
                log.level === 'WARN' ? 'text-[#FFB547]' : 'text-[#FF5C5C]';

              return (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#92979D]/60 select-none text-[10px] shrink-0 pt-0.5">{log.timestamp}</span>
                  <span className={`text-[10px] font-bold shrink-0 ${levelColor}`}>[{log.level}]</span>
                  <span className="text-[#F5F5F2]">{log.message}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-3 border-t border-[#1E2227] flex items-center gap-2 text-xs text-[#45D483]">
            <span className="animate-pulse">&gt;&gt;</span>
            <span>All execution assertions satisfied without timeout or memory fault.</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
