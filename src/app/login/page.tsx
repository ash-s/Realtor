'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { UserRole, EntityType } from '@/types';
import {
  TreePine,
  ShieldCheck,
  UserCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Compass,
  Phone,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [sellerEntityType, setSellerEntityType] = useState<EntityType>('individual');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('alex.wright@investor.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Switch role and update demo defaults cleanly
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'buyer') {
      setEmail('alex.wright@investor.com');
      setPassword('password123');
    } else if (role === 'seller') {
      setEmail('marcus.vance@vancerealty.com');
      setPassword('password123');
    } else {
      setEmail('sarah.jenkins@plotterra.com');
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(selectedRole, selectedRole === 'seller' ? sellerEntityType : 'individual');
      if (selectedRole === 'admin') router.push('/admin');
      else if (selectedRole === 'seller') router.push('/seller');
      else router.push('/buyer');
    }, 300);
  };

  const handleQuickDemo = (role: UserRole, entityType: EntityType, path: string) => {
    setIsLoading(true);
    login(role, entityType);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <TreePine className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">PlotTerra</span>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline ml-2 border-l border-slate-200 pl-2">
              Real Estate & Land Platform
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          <span>Explore Map</span>
        </Link>
      </header>

      {/* Main Centered Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Card Header & Mode Switcher */}
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Sign in to your account' : 'Create an account'}
            </h1>
            <p className="text-xs text-slate-500">
              {mode === 'signin'
                ? 'Welcome back. Choose your role to access your dashboard.'
                : 'Get started with verified land acquisition and listing.'}
            </p>

            {/* Simple Mode Toggle */}
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`px-4 py-1.5 rounded-md transition ${
                    mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-4 py-1.5 rounded-md transition ${
                    mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

          {/* Clean Segmented Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('buyer')}
                className={`py-2.5 px-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  selectedRole === 'buyer'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium'
                }`}
              >
                <User className={`w-4 h-4 ${selectedRole === 'buyer' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs">Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('seller')}
                className={`py-2.5 px-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  selectedRole === 'seller'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium'
                }`}
              >
                <UserCheck className={`w-4 h-4 ${selectedRole === 'seller' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs">Seller</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2.5 px-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  selectedRole === 'admin'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-purple-600' : 'text-slate-400'}`} />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>

          {/* Seller Classification (if Seller is active) */}
          {selectedRole === 'seller' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 animate-in fade-in">
              <label className="block text-[11px] font-semibold text-slate-600">
                Seller Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                {(['individual', 'broker', 'company'] as EntityType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSellerEntityType(type)}
                    className={`py-1.5 rounded-lg border capitalize text-center transition ${
                      sellerEntityType === type
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'individual' ? 'Land Owner' : type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-semibold">Password</label>
                {mode === 'signin' && (
                  <span className="text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-slate-600 cursor-pointer font-medium">
                  Remember me for 30 days
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin'
                      ? `Sign In as ${selectedRole === 'buyer' ? 'Buyer' : selectedRole === 'seller' ? 'Seller' : 'Admin'}`
                      : 'Create Account & Continue'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Simple Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[11px] text-slate-400 font-medium shrink-0">
              or quick demo access
            </span>
          </div>

          {/* Clean 1-Click Fast Pass Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('buyer', 'individual', '/buyer')}
              className="py-2 px-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold text-center transition flex flex-col items-center gap-0.5"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Buyer Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('seller', 'individual', '/seller')}
              className="py-2 px-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold text-center transition flex flex-col items-center gap-0.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seller Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'individual', '/admin')}
              className="py-2 px-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold text-center transition flex flex-col items-center gap-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Demo</span>
            </button>
          </div>

          {/* Trust Footnote */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              DTCP Verified
            </span>
            <span>•</span>
            <span>Bank-Grade Escrow</span>
            <span>•</span>
            <span>Zero Spam Vault</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 text-center text-xs text-slate-500 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} PlotTerra GIS Platform. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Contact Security</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
