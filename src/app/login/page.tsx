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
  User
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [activeTab, setActiveTab] = useState<UserRole>('buyer');
  const [sellerEntityType, setSellerEntityType] = useState<EntityType>('individual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(activeTab, activeTab === 'seller' ? sellerEntityType : 'individual');
    if (activeTab === 'admin') router.push('/admin');
    else if (activeTab === 'seller') router.push('/seller');
    else router.push('/buyer');
  };

  const handleQuickDemoLogin = (role: UserRole, entityType: EntityType, redirectPath: string) => {
    login(role, entityType);
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans">
      
      {/* Top Simple Bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <TreePine className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-900">PlotTerra</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">GIS SATELLITE</span>
        </Link>

        <Link
          href="/"
          className="text-xs font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1"
        >
          <span>← Back to GIS Map Explorer</span>
        </Link>
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to Your Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Choose your role below to access your dedicated command dashboard
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-3 rounded-xl transition flex flex-col items-center gap-1 ${
                activeTab === 'buyer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Buyer Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('seller')}
              className={`py-3 rounded-xl transition flex flex-col items-center gap-1 ${
                activeTab === 'seller'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Seller Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`py-3 rounded-xl transition flex flex-col items-center gap-1 ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Concierge</span>
            </button>
          </div>

          {/* Role Purpose Card */}
          <div className="p-3.5 rounded-2xl border text-xs space-y-1 bg-slate-50 border-slate-200">
            {activeTab === 'buyer' && (
              <>
                <span className="font-extrabold text-blue-900 block text-xs">👤 Individual & Institutional Buyers</span>
                <span className="text-slate-600 block">
                  Tour verified parcels, book admin-escorted physical site visits, and submit escrow offers.
                </span>
              </>
            )}

            {activeTab === 'seller' && (
              <>
                <span className="font-extrabold text-emerald-900 block text-xs">🏡 Land Owners, Brokers & Developers</span>
                <span className="text-slate-600 block">
                  Upload legal title deeds, draft georeferenced Google Maps boundaries, and receive verified leads.
                </span>
              </>
            )}

            {activeTab === 'admin' && (
              <>
                <span className="font-extrabold text-purple-900 block text-xs">🛡️ Admin Concierge & Deal Facilitation Desk</span>
                <span className="text-slate-600 block">
                  Verify title deeds, mediate negotiations, manage token escrow, and coordinate joint site visits.
                </span>
              </>
            )}
          </div>

          {/* Seller Subtype Toggle (If Seller Tab is selected) */}
          {activeTab === 'seller' && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in">
              <label className="text-[11px] font-extrabold text-emerald-900 block">Select Seller Classification:</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {(['individual', 'broker', 'company'] as EntityType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSellerEntityType(type)}
                    className={`py-2 px-2 rounded-xl border capitalize transition ${
                      sellerEntityType === type
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={
                    activeTab === 'admin'
                      ? 'admin@plotterra.com'
                      : activeTab === 'seller'
                      ? 'seller@verified.com'
                      : 'buyer@investcapital.com'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                  : activeTab === 'seller'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
              }`}
            >
              <span>Sign In to {activeTab === 'admin' ? 'Admin Desk' : activeTab === 'seller' ? 'Seller Portal' : 'Buyer Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Instant 1-Click Demo Login (Instant Evaluation) */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 1-Click Demo Portals:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                onClick={() => handleQuickDemoLogin('buyer', 'individual', '/buyer')}
                className="p-3 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 font-bold text-center transition flex flex-col items-center gap-1"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Enter as Buyer</span>
                <span className="text-[10px] text-blue-600 font-normal">Dashboard & Visits</span>
              </button>

              <button
                onClick={() => handleQuickDemoLogin('seller', 'individual', '/seller')}
                className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 font-bold text-center transition flex flex-col items-center gap-1"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Enter as Seller</span>
                <span className="text-[10px] text-emerald-600 font-normal">Inventory & Boundaries</span>
              </button>

              <button
                onClick={() => handleQuickDemoLogin('admin', 'individual', '/admin')}
                className="p-3 rounded-2xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-900 font-bold text-center transition flex flex-col items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Enter as Admin</span>
                <span className="text-[10px] text-purple-600 font-normal">Deal Escrow CRM</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 font-medium">
        PlotTerra Real Estate Platform • Google Maps Satellite Engine • Bank-Grade RLS Protection
      </div>

    </div>
  );
}
