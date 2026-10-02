import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { Button, Input, Card } from './CommonUI';

interface AuthScreenProps {
  mode: 'login' | 'register';
  onNavigate: (view: string) => void;
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ mode, onNavigate, onSuccess }) => {
  const [email, setEmail] = useState('admin@forgeval.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Marcus Vance');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center p-4 relative">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute w-[500px] h-[500px] bg-[#FF6A1A]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="w-12 h-12 rounded-xl bg-[#FF6A1A] mx-auto flex items-center justify-center font-black text-[#08090B] text-xl font-mono orange-glow-sm mb-3">
          FV
        </div>
        <h1 className="text-2xl font-extrabold font-mono tracking-wider text-[#F5F5F2] uppercase">
          FORGEVAL
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-[#92979D] mt-1">
          {mode === 'login' ? 'EVALUATION CONTROL PORTAL' : 'CREATE ADMIN CREDENTIALS'}
        </p>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-md relative z-10">
        <Card glow className="bg-[#111316]/95 border-[#292D32]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                placeholder="Marcus Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              placeholder="admin@forgeval.internal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={<Lock className="w-4 h-4" />}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {mode === 'register' && (
              <Input
                label="Confirm Password"
                type="password"
                icon={<Key className="w-4 h-4" />}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {mode === 'login' ? 'ENTER COMMAND CENTER' : 'CREATE ACCOUNT'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1E2227] flex items-center justify-between text-xs font-mono">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to admin mail relay.')}
                  className="text-[#92979D] hover:text-[#F5F5F2] transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-[#FF8A3D] hover:underline"
                >
                  Create account &rarr;
                </button>
              </>
            ) : (
              <div className="w-full text-center">
                <span className="text-[#92979D]">Already have access? </span>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-[#FF8A3D] hover:underline ml-1"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center text-xs font-mono text-[#92979D]/70 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#45D483]" />
        <span>End-to-End Cryptographically Attested Hackathon Triage</span>
      </div>
    </div>
  );
};
