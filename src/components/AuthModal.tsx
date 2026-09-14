import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { X, Mail, Lock, LogIn, UserPlus, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  // Password validation checks
  const isMinLength = password.length >= 6;
  const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp && !isMinLength) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase client is not configured in environment variables.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registration successful! Check your email to confirm.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Signed in successfully!' });
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-100 font-display">
            {isSignUp ? 'Create Account' : 'Sign in to Parlo'}
          </h3>
          <p className="text-xs text-slate-400">
            Sync your XP, hearts, and analytics across all your devices.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300">
            <p className="font-bold">Guest Mode Active</p>
            <p className="text-[11px] text-amber-400/80 mt-0.5">
              Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable cloud sync. Your progress is saved locally in your browser storage.
            </p>
          </div>
        )}

        {message && (
          <div className={`p-3 rounded-xl text-xs font-medium ${
            message.type === 'error' 
              ? 'bg-rose-950/80 border border-rose-900 text-rose-300' 
              : 'bg-emerald-950/80 border border-emerald-900 text-emerald-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 outline-none transition-all"
              />
            </div>

            {/* Password Schema Guidelines & Helper */}
            {isSignUp && (
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                <p className="text-slate-400 font-bold">Password Schema Requirements:</p>
                <div className="flex items-center space-x-1.5">
                  {isMinLength ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={isMinLength ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                    At least 6 characters long
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {hasNumberOrSpecial ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={hasNumberOrSpecial ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                    Includes number or symbol (Recommended)
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured || (isSignUp && !isMinLength)}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up now"}
          </button>
        </div>

      </div>
    </div>
  );
};
