import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const AdminLoginPage: React.FC = () => {
  const { user, login, adminProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      await login(username.trim(), password);
      toast.success('Welcome back to JM INTERIOR Studio Administration.');
      navigate('/admin');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid username or credentials.');
      toast.error('Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 px-4 sm:px-6 py-12">
      <div className="max-w-md w-full space-y-8 bg-stone-950 p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-wood-800 text-stone-100 flex items-center justify-center border border-wood-600/40 shadow-lg">
            <Lock className="w-6 h-6 text-wood-300" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
            JM INTERIOR
          </h2>
          <p className="text-xs uppercase tracking-widest text-wood-400 font-semibold">
            Administrative Studio Portal
          </p>
          <p className="text-xs text-stone-400">
            Authorized management for K. Selvam & studio personnel.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={adminProfile?.username || 'SELVAM'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-wood-500 focus:ring-1 focus:ring-wood-500 outline-none transition"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-wood-500 focus:ring-1 focus:ring-wood-500 outline-none transition"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full py-3.5 text-sm uppercase tracking-wider bg-wood-700 hover:bg-wood-800 border-wood-600"
          >
            Access Studio Dashboard
          </Button>
        </form>

        {/* First-time Setup Helper */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={async () => {
              if (window.confirm("Initialize or seed first-time admin account (SELVAM) and site settings into Firebase?")) {
                const { initializeFirstAdminAndData } = await import('../../utils/initAdmin');
                setLoading(true);
                const res = await initializeFirstAdminAndData();
                setLoading(false);
                if (res.success) {
                  toast.success(res.message);
                } else {
                  toast.error(res.message);
                }
              }
            }}
            className="text-[11px] text-stone-500 hover:text-wood-400 transition underline underline-offset-2"
          >
            First-time Firebase project setup / Seed Admin
          </button>
        </div>

        <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <Link to="/" className="hover:text-stone-300 transition">
            ← Return to Public Website
          </Link>
          <div className="flex items-center gap-1 text-wood-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Firebase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

