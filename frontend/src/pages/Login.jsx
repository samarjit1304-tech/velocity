import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        dispatch(setCredentials(res.data));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Sign In for testing purposes
  const handleQuickSignIn = (role) => {
    if (role === 'admin') {
      setEmail('admin@velocityx.com');
      setPassword('admin123');
    } else {
      setEmail('user@velocityx.com');
      setPassword('user123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 space-y-8 text-white">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-display">Elite Access</span>
        <h1 className="text-3xl font-black tracking-tight uppercase font-display">Sign In</h1>
      </div>

      {error && (
        <p className="text-xs uppercase tracking-wider text-red bg-red/10 px-4 py-3 rounded-xl border border-red/20">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 pl-10 text-xs font-light text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
            <Mail size={14} className="absolute left-3.5 top-3.5 text-grey-medium" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Password</label>
            <Link to="/forgot-password" className="text-[9px] uppercase tracking-wider text-grey-medium hover:text-primary transition-colors">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 pl-10 text-xs font-light text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
            <KeyRound size={14} className="absolute left-3.5 top-3.5 text-grey-medium" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-primary hover:bg-orange text-white rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 shadow-premium transition-all mt-6"
        >
          <span>{loading ? 'Verifying...' : 'Sign In'}</span>
          <ArrowRight size={14} />
        </button>

      </form>

      {/* Quick Access sandbox helper */}
      <div className="bg-charcoal p-6 rounded-2xl space-y-3 border border-white/5">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-lime font-display">Sandbox Credentials Loader</h4>
        <p className="text-[9px] text-grey-light font-light leading-relaxed">
          Quickly populate standard seeded credentials to inspect different role configurations.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => handleQuickSignIn('user')}
            className="bg-dark hover:bg-dark/80 border border-white/10 text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg text-white flex-1 font-semibold transition-colors hover:border-primary"
          >
            Load User
          </button>
          <button
            onClick={() => handleQuickSignIn('admin')}
            className="bg-dark hover:bg-dark/80 border border-white/10 text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg text-orange flex-1 font-semibold transition-colors hover:border-orange"
          >
            Load Admin
          </button>
        </div>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-grey-medium font-light">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register now
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Login;
