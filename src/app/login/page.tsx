'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { UserRole, EntityType } from '@/types';
import {
  TreePine,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Compass,
  CheckCircle2,
  Sparkles,
  User,
  Eye,
  EyeOff,
  Zap,
  Globe2,
  Layers,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import DigitalTwin3DVisualizer from '@/components/auth/DigitalTwin3DVisualizer';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [activeTab, setActiveTab] = useState<UserRole>('buyer');
  const [sellerEntityType, setSellerEntityType] = useState<EntityType>('individual');
  const [email, setEmail] = useState('alex.wright@investor.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Switch Role & Pre-populate realistic credentials
  const handleSelectRole = (role: UserRole) => {
    setActiveTab(role);
    if (role === 'buyer') {
      setEmail('alex.wright@investor.com');
      setPassword('buyer@pass123');
    } else if (role === 'seller') {
      setEmail('marcus.vance@vancerealty.com');
      setPassword('seller@pass123');
    } else {
      setEmail('sarah.jenkins@plotterra.com');
      setPassword('admin@pass123');
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(activeTab, activeTab === 'seller' ? sellerEntityType : 'individual');
      if (activeTab === 'admin') router.push('/admin');
      else if (activeTab === 'seller') router.push('/seller');
      else router.push('/buyer');
    }, 400);
  };

  const handleQuickDemoLogin = (role: UserRole, entityType: EntityType, redirectPath: string) => {
    setIsLoading(true);
    login(role, entityType);
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-30 border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-white tracking-tight">PlotTerra</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                3D GIS
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block font-medium">
              Land & Real Estate Acquisition Digital Twin
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-bold text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>GIS Map Explorer</span>
            <ChevronRight className="w-3 h-3 text-stone-500" />
          </Link>
        </div>
      </header>

      {/* Main Grid: 3D Visualization + Login Form */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          
          {/* LEFT COLUMN (7 COLS): 3D Video & LiDAR Topography Digital Twin */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  Photogrammetry & Drone Feed
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Interactive 3D Digital Twin Viewer
                </h2>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-stone-900 border border-stone-800 text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live 60 FPS
              </span>
            </div>

            {/* Embedded 3D Component */}
            <div className="h-[460px] sm:h-[540px] lg:h-[620px] w-full">
              <DigitalTwin3DVisualizer activeRole={activeTab} />
            </div>

            {/* Platform Feature Trust Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>DTCP Verified</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1 font-medium leading-tight">
                  Perimeter survey coordinates pegged on satellite.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Protected Escrow</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1 font-medium leading-tight">
                  Zero spam. Direct seller privacy held in vault.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Interactive 3D</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1 font-medium leading-tight">
                  Topographical contours & sub-division layouts.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 COLS): Premium Login Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-stone-900/90 backdrop-blur-2xl border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                    Role-Based Access
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">Single Sign-On</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Sign In to Portal
                </h1>
                <p className="text-xs text-stone-400 font-medium">
                  Select your persona to enter your personalized real estate workstation
                </p>
              </div>

              {/* Persona Tab Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-stone-950/80 rounded-2xl border border-stone-800/90 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleSelectRole('buyer')}
                  className={`py-2.5 px-2 rounded-xl transition flex flex-col items-center gap-1 ${
                    activeTab === 'buyer'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Buyer</span>
                  <span className="text-[9px] font-normal opacity-80">Escrow & Visits</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('seller')}
                  className={`py-2.5 px-2 rounded-xl transition flex flex-col items-center gap-1 ${
                    activeTab === 'seller'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Seller</span>
                  <span className="text-[9px] font-normal opacity-80">List & Cadastral</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`py-2.5 px-2 rounded-xl transition flex flex-col items-center gap-1 ${
                    activeTab === 'admin'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                  <span className="text-[9px] font-normal opacity-80">Concierge Desk</span>
                </button>
              </div>

              {/* Seller Classification Sub-selector */}
              {activeTab === 'seller' && (
                <div className="p-3 bg-stone-950/70 border border-emerald-500/30 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-400">Seller Entity Type:</span>
                    <span className="text-[10px] text-stone-400 font-mono">KYC Required</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                    {(['individual', 'broker', 'company'] as EntityType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSellerEntityType(type)}
                        className={`py-1.5 px-2 rounded-xl border capitalize transition text-center ${
                          sellerEntityType === type
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                            : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                        }`}
                      >
                        {type === 'individual' ? 'Land Owner' : type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-stone-300 font-bold">
                      Password
                    </label>
                    <span className="text-[11px] text-stone-500 hover:text-stone-300 cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300 transition"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'buyer'
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                      : activeTab === 'seller'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                      : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        Enter {activeTab === 'buyer' ? 'Buyer Portal' : activeTab === 'seller' ? 'Seller Portal' : 'Admin Concierge'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Instant 1-Click Fast Pass Evaluation */}
              <div className="pt-4 border-t border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-stone-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Instant 1-Click Demo Portals
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">No typing required</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('buyer', 'individual', '/buyer')}
                    className="p-2.5 rounded-xl border border-blue-900/60 bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 font-bold text-center transition flex flex-col items-center gap-1 group"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px]">Buyer Demo</span>
                    <span className="text-[9px] text-stone-400 font-normal">Escrow & Visits</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('seller', 'individual', '/seller')}
                    className="p-2.5 rounded-xl border border-emerald-900/60 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-bold text-center transition flex flex-col items-center gap-1 group"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px]">Seller Demo</span>
                    <span className="text-[9px] text-stone-400 font-normal">Plot Inventory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin', 'individual', '/admin')}
                    className="p-2.5 rounded-xl border border-purple-900/60 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 font-bold text-center transition flex flex-col items-center gap-1 group"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px]">Admin Desk</span>
                    <span className="text-[9px] text-stone-400 font-normal">Deal CRM & Chat</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-stone-800/80 bg-stone-900/40 backdrop-blur-md py-4 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PlotTerra Real Estate Platform • Google Maps Satellite CAD • Bank-Grade RLS Protection</span>
          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <span>DTCP Cadastral Verified</span>
            <span>•</span>
            <span>Anti-Circumvention Escrow</span>
            <span>•</span>
            <span>LiDAR 3D Digital Twin</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
