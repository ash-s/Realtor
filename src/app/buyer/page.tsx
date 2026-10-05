'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Heart,
  HelpCircle,
  MapPin,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  TreePine,
  UserCheck,
  Building2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Download,
  Send,
  X
} from 'lucide-react';
import PropertyDetailModal from '@/components/property/PropertyDetailModal';
import CreateDealModal from '@/components/deals/CreateDealModal';
import { formatCurrency, formatNumber } from '@/lib/formatters';

export default function BuyerDashboardPage() {
  const {
    currentUser,
    dealTickets,
    properties,
    setSelectedProperty,
    setIsDetailModalOpen,
    setIsDealModalOpen,
    setIsContactModalOpen,
    setContactProperty,
    sendBuyerMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'visits' | 'deals' | 'saved' | 'vault'>('visits');
  const [activeChatDealId, setActiveChatDealId] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState('');

  // Filter deals where user is the buyer or all active buyer demo deals
  const myDeals = dealTickets;
  const myVisits = dealTickets.filter(d => d.scheduledVisitDate);
  const currentChatDeal = dealTickets.find(d => d.id === activeChatDealId) || null;
  const savedProperties = properties.slice(0, 3); // demo shortlisted properties

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Buyer Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                👤 Verified Buyer Account
              </span>
              <span className="text-xs font-semibold text-blue-200">
                KYC Level 2 Cleared
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser?.name || 'Alexander Wright'}
            </h1>
            <p className="text-sm text-blue-100 max-w-xl font-normal">
              Track your scheduled joint site visits, submit offers directly through your Admin Concierge, and inspect verified cadastral land surveys.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded-2xl bg-white text-blue-800 font-extrabold text-xs shadow-md hover:bg-blue-50 transition flex items-center gap-2 shrink-0"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Explore GIS Map</span>
            </Link>
            <button
              onClick={() => {
                if (properties[0]) {
                  setSelectedProperty(properties[0]);
                  setIsDealModalOpen(true);
                }
              }}
              className="px-5 py-3 rounded-2xl bg-blue-600/60 hover:bg-blue-600 border border-white/30 text-white font-extrabold text-xs transition flex items-center gap-2 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule New Visit</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Site Visits Scheduled</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{myVisits.length}</div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Admin Escorted Visits</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Active Concierge Deals</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{myDeals.length}</div>
            <div className="text-[11px] font-semibold text-blue-600">
              Escrow Facilitation Active
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Shortlisted Lands</span>
              <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{savedProperties.length}</div>
            <div className="text-[11px] font-semibold text-slate-500">
              DTCP / RERA Verified
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Dedicated Concierge</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm font-bold text-slate-900 pt-1">Sarah Jenkins</div>
            <div className="text-[11px] font-semibold text-purple-600 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              <span>Available 24/7 for Site Tours</span>
            </div>
          </div>
        </div>

        {/* Buyer Tabs Navigation */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'visits'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Scheduled Site Visits ({myVisits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'deals'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Offers & Concierge Escrow ({myDeals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Shortlisted Parcels ({savedProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'vault'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Legal Documents Vault</span>
          </button>
        </div>

        {/* TAB 1: Scheduled Site Visits */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Upcoming Physical Site Visits with Admin Concierge
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Admin coordinates vehicle and surveyor at site
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myVisits.map((deal, idx) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Site Visit Confirmed
                        </span>
                        {deal.plotNumber && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            Plot #{deal.plotNumber}
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 mt-1">
                        {deal.propertyTitle}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Chengalpattu (Chennai Suburbs) • Survey #302/2A</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block">Offer Price</span>
                      <span className="text-base font-black text-slate-900" suppressHydrationWarning>
                        {formatCurrency(deal.offerPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Visit Details Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Scheduled Visit:</span>
                      </span>
                      <span className="font-bold text-slate-800">{deal.scheduledVisitDate || 'Tomorrow'} at 10:30 AM</span>
                    </div>

                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Assigned Officer:</span>
                      </span>
                      <span className="font-bold text-slate-800">Sarah Jenkins (PlotTerra Admin)</span>
                    </div>

                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Land Verification:</span>
                      </span>
                      <span className="font-bold text-emerald-700">DTCP Approved & Boundary Pegged</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Link
                      href="/"
                      onClick={() => {
                        const prop = properties.find(p => p.id === deal.propertyId);
                        if (prop) setSelectedProperty(prop);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold text-center transition flex items-center justify-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>View on Google Map</span>
                    </Link>

                    <button
                      onClick={() => {
                        const prop = properties.find(p => p.id === deal.propertyId) || null;
                        setContactProperty(prop);
                        setIsContactModalOpen(true);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                      <span>Contact Admin</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Offers & Escrow Deals */}
        {activeTab === 'deals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Concierge Mediated Deal Pipeline
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Bank-Grade Escrow & Anti-Circumvention Protection
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Deal ID & Property</th>
                      <th className="py-3 px-4">Offer Price</th>
                      <th className="py-3 px-4">Current Stage</th>
                      <th className="py-3 px-4">Concierge Thread</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myDeals.map(deal => {
                      const msgCount = deal.messages?.length || 0;
                      const lastMsg = msgCount > 0 ? deal.messages![msgCount - 1] : null;
                      const hasAdminReply = lastMsg?.senderRole === 'admin';

                      return (
                        <tr key={deal.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[11px] text-slate-400 font-bold">{deal.id}</span>
                            <div className="font-bold text-slate-900 text-xs">{deal.propertyTitle}</div>
                            {deal.plotNumber && (
                              <span className="text-[10px] text-blue-600 font-bold">Venture Plot #{deal.plotNumber}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900" suppressHydrationWarning>
                            {formatCurrency(deal.offerPrice)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize bg-blue-50 text-blue-700 border border-blue-200">
                              <Clock className="w-3 h-3" />
                              <span>{deal.stage.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {hasAdminReply ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                                🛡️ Admin Replied
                              </span>
                            ) : msgCount > 0 ? (
                              <span className="text-[11px] text-slate-500 font-medium">
                                {msgCount} message{msgCount > 1 ? 's' : ''} logged
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">Direct Inbound</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => setActiveChatDealId(deal.id)}
                              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Messages & Escrow</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Shortlisted Properties */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Your Saved Plots & Land Parcels
              </h2>
              <Link href="/" className="text-xs text-blue-600 font-bold hover:underline">
                Explore More on Map →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedProperties.map(prop => (
                <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                  <div className="relative h-44 w-full">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-900">
                        {prop.verification.approvalType} Approved
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white font-black text-xs" suppressHydrationWarning>
                      {formatCurrency(prop.price)}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{prop.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{prop.location.city} • Survey #{prop.verification.surveyNumber}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mt-2">
                        <span suppressHydrationWarning>{formatNumber(prop.totalSqft)} sq ft</span>
                        <span>•</span>
                        <span>{prop.roadWidthFt} ft Road Frontage</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href="/"
                        onClick={() => setSelectedProperty(prop)}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs text-center shadow-xs hover:bg-blue-700 transition"
                      >
                        Fly on GIS Map
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedProperty(prop);
                          setIsDealModalOpen(true);
                        }}
                        className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 hover:bg-emerald-100 transition"
                      >
                        Book Visit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Legal Documents Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Verified Title Deeds & Sanctioned Blueprints
              </h2>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified by Legal Team</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">DTCP Sanctioned Layout Blueprint</h4>
                      <p className="text-xs text-slate-500">Ananya Palm Meadows • DTCP/TN/LP-492/2026</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Approved masterplan showing 40-ft bitumen access roads, public park reservation, and plot demarcation coordinates.
                </p>
                <button
                  onClick={() => alert('Downloading official DTCP Sanctioned Blueprint PDF...')}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Sanction Certificate (PDF)</span>
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">30-Year Encumbrance Search (EC)</h4>
                      <p className="text-xs text-slate-500">Survey 118/4B • Pollachi (Coimbatore District)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Nil Encumbrance
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Clear title certification proving zero mortgage liability, no bank attachment, and single undisputed ownership history.
                </p>
                <button
                  onClick={() => alert('Downloading 30-Year Encumbrance Certificate...')}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Legal Search Certificate</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <PropertyDetailModal />
      <CreateDealModal />

      {/* Interactive Deal Concierge & Message Thread Modal */}
      {currentChatDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col text-stone-900 max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900">
                    Admin Concierge Room
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Deal #{currentChatDeal.id} • Officer Sarah Jenkins
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveChatDealId(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Summary Banner */}
            <div className="px-6 py-3 bg-stone-50/70 border-b border-stone-100 flex items-center justify-between text-xs shrink-0">
              <div>
                <div className="font-bold text-stone-900">{currentChatDeal.propertyTitle}</div>
                <div className="text-[11px] text-stone-500">
                  {currentChatDeal.plotNumber || 'Land Asset'} • Status:{' '}
                  <span className="font-bold text-blue-700 capitalize">
                    {currentChatDeal.stage.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-stone-400 font-bold uppercase">Offer Amount</div>
                <div className="font-extrabold text-stone-900" suppressHydrationWarning>
                  {formatCurrency(currentChatDeal.offerPrice)}
                </div>
              </div>
            </div>

            {/* Message Thread List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/50">
              {(!currentChatDeal.messages || currentChatDeal.messages.length === 0) ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No messages yet. Send a direct inquiry to Officer Sarah Jenkins below.
                </div>
              ) : (
                currentChatDeal.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderRole === 'buyer' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold text-stone-600">
                        {msg.senderRole === 'admin' ? '🛡️ Sarah Jenkins (Admin Concierge)' : '👤 You (Buyer)'}
                      </span>
                      <span className="text-[9px] text-stone-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                        msg.senderRole === 'buyer'
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Buyer Reply Bar */}
            <div className="p-4 bg-white border-t border-stone-100 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={chatInputText}
                onChange={e => setChatInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && chatInputText.trim()) {
                    sendBuyerMessage(currentChatDeal.id, chatInputText.trim());
                    setChatInputText('');
                  }
                }}
                placeholder="Type your message to Sarah Jenkins..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition"
              />
              <button
                onClick={() => {
                  if (!chatInputText.trim()) return;
                  sendBuyerMessage(currentChatDeal.id, chatInputText.trim());
                  setChatInputText('');
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
