import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { KeyRound, Mail, User, ArrowRight, Check } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        dispatch(setCredentials(res.data));
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 space-y-8 text-white">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-display">Join the Ranks</span>
        <h1 className="text-3xl font-black tracking-tight uppercase font-display">Create Account</h1>
      </div>

      {error && (
        <p className="text-xs uppercase tracking-wider text-red bg-red/10 px-4 py-3 rounded-xl border border-red/20">
          {error}
        </p>
      )}

      {success && (
        <p className="text-xs uppercase tracking-wider text-green-300 bg-green-950 px-4 py-3 rounded-xl border border-green-900 flex items-center">
          <Check size={14} className="mr-2" />
          <span>{success}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Full Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 pl-10 text-xs font-light text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
            <User size={14} className="absolute left-3.5 top-3.5 text-grey-medium" />
          </div>
        </div>

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
          <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Password</label>
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

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          <span>{loading ? 'Processing...' : 'Register'}</span>
          <ArrowRight size={14} />
        </button>

      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-grey-medium font-light">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in now
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Register;
