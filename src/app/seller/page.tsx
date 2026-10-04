'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  TreePine,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  LogOut,
  Layers,
  FileText,
  DollarSign,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import AddPropertyModal from '@/components/seller/AddPropertyModal';
import { formatCurrency, formatNumber, formatDate } from '@/lib/formatters';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { currentUser, properties, dealTickets, setIsAddPropertyModalOpen, logout } = useApp();

  // If not logged in or not seller/admin, can still preview
  const sellerProperties = properties; // in real backend: properties.filter(p => p.seller.id === currentUser?.id)
  const incomingInquiries = dealTickets;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      
      {/* Top Seller Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-sm font-bold text-xs">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">PlotTerra</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 ml-1.5">
                SELLER PORTAL
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition hidden sm:block"
          >
            ← Public GIS Map
          </Link>

          <button
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Land Parcel</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              {currentUser?.name ? currentUser.name.charAt(0) : 'S'}
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Seller Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Profile & Status Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser?.name || 'Authorized Seller Portal'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>KYC Verified Seller</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Manage your land parcels, plotted ventures, legal survey deeds, and track Admin-brokered inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              📐 Plot Land Boundary on Map
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Listed Assets</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{sellerProperties.length}</div>
            <span className="text-xs text-slate-500 mt-0.5 block font-medium">Lands, Plots & Ventures</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Admin Verified & Live</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {sellerProperties.filter(p => p.verification.isVerified).length}
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block font-medium">Visible on Google Maps</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Buyer Inquiries</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">{incomingInquiries.length}</div>
            <span className="text-xs text-slate-500 mt-0.5 block font-medium">Coordinated by Admin</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Valuation</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1" suppressHydrationWarning>
              {formatCurrency(sellerProperties.reduce((acc, p) => acc + p.price, 0))}
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block font-medium">Portfolio value</span>
          </div>
        </div>

        {/* Inventory Table / Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Property Inventory</h3>
              <p className="text-xs text-slate-500 font-medium">All properties uploaded by your account</p>
            </div>
            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              + Add Property
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {sellerProperties.map(property => (
              <div key={property.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{property.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          property.verification.isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {property.verification.isVerified ? '✔ Live on Map' : '⏳ Pending Admin Approval'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {property.location.address}, {property.location.city} • Survey #{property.verification.surveyNumber}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 font-semibold">
                      <span suppressHydrationWarning>Area: {formatNumber(property.totalSqft)} sq ft</span>
                      <span>•</span>
                      <span>Road: {property.roadWidthFt} ft</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold" suppressHydrationWarning>{formatCurrency(property.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    View on GIS Map
                  </Link>
                  <button
                    onClick={() => alert(`Opening Private Vault for Survey #${property.verification.surveyNumber}. Title deed is securely verified.`)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
                  >
                    Vault Documents
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming Inquiries Section (Admin Concierge Mediated) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Buyer Inquiries in Progress (Admin Concierge)</h3>
              <p className="text-xs text-slate-500 font-medium">
                Our Admin team coordinates with prospective buyers and conducts physical on-site surveys before deal closing.
              </p>
            </div>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Zero Direct Spam
            </span>
          </div>

          <div className="space-y-3">
            {incomingInquiries.map(deal => (
              <div
                key={deal.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{deal.propertyTitle}</span>
                    {deal.plotNumber && (
                      <span className="text-[11px] text-blue-700 font-bold">{deal.plotNumber}</span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                      Stage: {deal.stage.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 font-medium" suppressHydrationWarning>
                    Verified Buyer: <span className="font-bold text-slate-800">{deal.buyerName}</span> • Scheduled Visit: {formatDate(deal.scheduledVisitDate)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-700" suppressHydrationWarning>
                    Offer: {formatCurrency(deal.offerPrice)}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Admin Concierge Assigned</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Global Add Property Modal */}
      <AddPropertyModal />

    </div>
  );
}
