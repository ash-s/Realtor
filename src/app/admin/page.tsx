'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import AdminDealDesk from '@/components/admin/AdminDealDesk';
import AddPropertyModal from '@/components/seller/AddPropertyModal';
import PropertyDetailModal from '@/components/property/PropertyDetailModal';
import {
  ShieldCheck,
  PlusCircle,
  Compass,
  ArrowRight,
  Sparkles,
  Lock,
  Building2,
  TreePine,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, setIsAddPropertyModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col text-stone-900 font-sans">
      {/* Shared Ultra-Clean Navbar */}
      <Navbar />

      {/* Main Admin Concierge Desk Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Executive Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-bold tracking-tight">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PlotTerra Command Concierge</span>
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                Broker License #CA-8891-DTCP
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Anti-Circumvention Active</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Land Mediation & Brokerage Desk
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
              You are the central deal facilitator. Connect qualified buyers with verified land owners, schedule field surveyor inspections, verify cadastral title deeds, and escrow tokens safely.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-stone-600" />
              <span>Public GIS Map</span>
            </Link>

            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>+ Add Direct Verified Listing</span>
            </button>
          </div>
        </div>

        {/* The Full SaaS Deal CRM Kanban, Visits & KYC Desk */}
        <AdminDealDesk />

      </main>

      {/* Global Modals */}
      <AddPropertyModal />
      <PropertyDetailModal />

    </div>
  );
}
