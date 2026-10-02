import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Key, Phone, User, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from './CommonUI';
import { authApi } from '../services/api';

interface AuthScreenProps {
  mode: 'login' | 'register';
  onNavigate: (view: string) => void;
  onSuccess: (user?: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ mode, onNavigate, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'PARTICIPANT' | 'JUDGE' | 'ADMIN'>('PARTICIPANT');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await authApi.register(name.trim(), email.trim(), password, role, phone.trim() || undefined);
        onSuccess(res.user);
      } else {
        const res = await authApi.login(email.trim(), password);
        onSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (demoEmail: string, demoRole: 'PARTICIPANT' | 'JUDGE' | 'ADMIN') => {
    setEmail(demoEmail);
    setPassword('password123');
    setRole(demoRole);
  };

  return (
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center p-4 relative font-sans">
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
          {mode === 'login' ? 'PLATFORM LOGIN' : 'PARTICIPANT & BUILDER REGISTRATION'}
        </p>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-md relative z-10">
        <Card glow className="bg-[#111316]/95 border-[#292D32]">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-mono flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <Input
                  label="Full Name *"
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Mobile Number (Optional)"
                  placeholder="+1-555-0192"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#292D32] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#FF6A1A]/50 transition-colors"
                  >
                    <option value="PARTICIPANT">Participant (Hackathon Builder)</option>
                    <option value="JUDGE">Judge (Evaluator)</option>
                    <option value="ADMIN">Admin / Organizer</option>
                  </select>
                </div>
              </>
            )}

            <Input
              label="Email Address *"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              placeholder="developer@forgeeval.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password *"
              type="password"
              icon={<Lock className="w-4 h-4" />}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {mode === 'register' && (
              <Input
                label="Confirm Password *"
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
                {mode === 'login' ? 'SIGN IN' : 'CREATE PARTICIPANT ACCOUNT'}
              </Button>
            </div>
          </form>

          {/* Quick Demo Fill Buttons (Dev only) */}
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5 text-center">
              Quick Development Accounts
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => fillDemoCreds('dev@forgeeval.com', 'PARTICIPANT')}
                className="py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 transition-colors text-center"
              >
                Participant
              </button>
              <button
                type="button"
                onClick={() => fillDemoCreds('judge@forgeeval.com', 'JUDGE')}
                className="py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 transition-colors text-center"
              >
                Judge
              </button>
              <button
                type="button"
                onClick={() => fillDemoCreds('admin@forgeeval.com', 'ADMIN')}
                className="py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 transition-colors text-center"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E2227] flex items-center justify-between text-xs font-mono">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => alert('Demo reset credentials: dev@forgeeval.com / password123')}
                  className="text-[#92979D] hover:text-[#F5F5F2] transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-[#FF8A3D] hover:underline"
                >
                  Register as builder &rarr;
                </button>
              </>
            ) : (
              <div className="w-full text-center">
                <span className="text-[#92979D]">Already have an account? </span>
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
