
import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication delay
    setTimeout(() => {
      onLogin({
        id: '123',
        username: username,
        name: isLogin ? username : name
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-100">
        
        {/* Left Side: Brand Info */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <i className="fas fa-leaf text-2xl"></i>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Your Journey to Better Health Starts Here.</h1>
            <p className="text-emerald-50 opacity-90 leading-relaxed">
              Experience the power of Gemini-powered nutrition advice, personalized meal plans, and real-time intake tracking.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <i className="fas fa-check text-sm"></i>
              </div>
              <span className="text-sm font-medium">AI-Generated 7-Day Meal Plans</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <i className="fas fa-check text-sm"></i>
              </div>
              <span className="text-sm font-medium">Smart Grocery Consolidation</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin 
                ? 'Please enter your details to sign in.' 
                : 'Join NutriGenie to start your healthy transformation.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <i className="fas fa-user-circle absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nutrigenie_fan"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-[10px] text-emerald-600 font-bold uppercase hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-6">
            <div className="flex items-center gap-4 text-slate-300 text-xs font-bold uppercase tracking-widest">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span>Or continue with</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 shadow-sm">
                <i className="fab fa-google text-red-500"></i> Google
              </button>
              <button className="py-3 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 shadow-sm">
                <i className="fab fa-apple text-slate-900"></i> Apple
              </button>
            </div>

            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
