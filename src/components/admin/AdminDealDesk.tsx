'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { DealStage, DealTicket, Property, KycRecord } from '@/types';
import { formatCurrency, formatNumber, formatDate } from '@/lib/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Layers,
  Building2,
  TreePine,
  MapPin,
  ExternalLink,
  Lock,
  Eye,
  Check,
  X,
  Edit3,
  Trash2,
  Car,
  Compass,
  FileCheck,
  Briefcase,
  ChevronRight,
  LayoutGrid,
  List,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDealDesk() {
  const {
    dealTickets,
    updateDealStage,
    updateDealDetails,
    deleteDealTicket,
    kycRecords,
    approveKyc,
    rejectKyc,
    properties,
    togglePropertyVerification,
    togglePropertyFeatured,
    setIsAddPropertyModalOpen,
    setSelectedProperty,
    setIsDetailModalOpen,
    sendAdminReply,
    unreadAdminMessagesCount
  } = useApp();

  // Hydration safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Active top tab
  const [activeTab, setActiveTab] = useState<'pipeline' | 'visits' | 'inventory' | 'kyc'>('pipeline');

  // Pipeline filters & view mode
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'table'>('kanban');
  const [dealSearchQuery, setDealSearchQuery] = useState('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<'all' | 'land_plot' | 'constructed'>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<'all' | DealStage>('all');

  // Modals state
  const [inspectingDeal, setInspectingDeal] = useState<DealTicket | null>(null);
  const [dealNotesInput, setDealNotesInput] = useState('');
  const [dealOfferPriceInput, setDealOfferPriceInput] = useState<number>(0);
  const [dealVisitDateInput, setDealVisitDateInput] = useState('');
  const [adminReplyInput, setAdminReplyInput] = useState('');

  // KYC Document Preview Modal
  const [previewKycRecord, setPreviewKycRecord] = useState<KycRecord | null>(null);

  // Anti-circumvention landowner unmask state
  const [unmaskedLandownerDealId, setUnmaskedLandownerDealId] = useState<string | null>(null);

  // 6 Mediation Stages Configuration
  const STAGES: {
    id: DealStage;
    label: string;
    stepNumber: string;
    description: string;
    colorBadge: string;
    nextActionLabel: string;
    nextStage: DealStage | null;
  }[] = [
    {
      id: 'new_lead',
      label: 'New Inquiries',
      stepNumber: '01',
      description: 'Incoming buyer interest & visit request',
      colorBadge: 'bg-sky-50 text-sky-700 border-sky-200',
      nextActionLabel: 'Screen & Mark Contacted →',
      nextStage: 'contacted'
    },
    {
      id: 'contacted',
      label: 'Buyer Contacted',
      stepNumber: '02',
      description: 'Intent, budget & financing verified',
      colorBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      nextActionLabel: 'Dispatch Field Visit →',
      nextStage: 'site_visit_scheduled'
    },
    {
      id: 'site_visit_scheduled',
      label: 'Site Visit Set',
      stepNumber: '03',
      description: 'Joint physical survey with concierge',
      colorBadge: 'bg-amber-50 text-amber-800 border-amber-200',
      nextActionLabel: 'Submit to Legal Audit →',
      nextStage: 'legal_verification'
    },
    {
      id: 'legal_verification',
      label: 'Legal Due Diligence',
      stepNumber: '04',
      description: 'Sub-registrar title search & EC check',
      colorBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      nextActionLabel: 'Collect Token Escrow →',
      nextStage: 'token_escrow'
    },
    {
      id: 'token_escrow',
      label: 'Token Escrow',
      stepNumber: '05',
      description: 'Earnest deposit secured in trust',
      colorBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      nextActionLabel: '🎉 Settle & Register Deed',
      nextStage: 'closed'
    },
    {
      id: 'closed',
      label: 'Deal Settled 🏆',
      stepNumber: '06',
      description: 'Sale deed executed & commission collected',
      colorBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      nextActionLabel: 'Deal Finalized',
      nextStage: null
    }
  ];

  // Financial and KPI metrics
  const closedDeals = useMemo(() => dealTickets.filter(d => d.stage === 'closed'), [dealTickets]);
  const activeDeals = useMemo(() => dealTickets.filter(d => d.stage !== 'closed' && d.stage !== 'cancelled'), [dealTickets]);
  
  const totalClosedVolume = useMemo(() => {
    return closedDeals.reduce((sum, d) => sum + d.offerPrice, 0);
  }, [closedDeals]);

  const totalCommissionEarned = useMemo(() => {
    return closedDeals.reduce((sum, d) => sum + (d.offerPrice * (d.commissionRate / 100)), 0);
  }, [closedDeals]);

  const escrowInPipeline = useMemo(() => {
    return dealTickets
      .filter(d => d.stage === 'token_escrow' || d.stage === 'legal_verification')
      .reduce((sum, d) => sum + (d.offerPrice * 0.1), 0); // 10% token deposit estimate
  }, [dealTickets]);

  const scheduledVisitsList = useMemo(() => {
    return dealTickets.filter(d => d.stage === 'site_visit_scheduled' || d.scheduledVisitDate);
  }, [dealTickets]);

  // Filtered Deals
  const filteredDeals = useMemo(() => {
    return dealTickets.filter(deal => {
      const matchesSearch =
        deal.id.toLowerCase().includes(dealSearchQuery.toLowerCase()) ||
        deal.propertyTitle.toLowerCase().includes(dealSearchQuery.toLowerCase()) ||
        deal.buyerName.toLowerCase().includes(dealSearchQuery.toLowerCase()) ||
        deal.buyerPhone.includes(dealSearchQuery) ||
        (deal.plotNumber && deal.plotNumber.toLowerCase().includes(dealSearchQuery.toLowerCase()));

      const matchesChannel = selectedChannelFilter === 'all' || deal.channel === selectedChannelFilter;
      const matchesStage = selectedStageFilter === 'all' || deal.stage === selectedStageFilter;

      return matchesSearch && matchesChannel && matchesStage;
    });
  }, [dealTickets, dealSearchQuery, selectedChannelFilter, selectedStageFilter]);

  // Inbound messages filter
  const inboundMessagesDeals = useMemo(() => {
    return dealTickets.filter(d => d.buyerMessage || (d.messages && d.messages.length > 0));
  }, [dealTickets]);

  // Open deal editor
  const handleOpenDealEditor = (deal: DealTicket) => {
    setInspectingDeal(deal);
    setDealNotesInput(deal.adminNotes || '');
    setDealOfferPriceInput(deal.offerPrice);
    setDealVisitDateInput(deal.scheduledVisitDate ? deal.scheduledVisitDate.split('T')[0] : '');
    setAdminReplyInput('');
  };

  // Save deal updates
  const handleSaveDealUpdates = () => {
    if (!inspectingDeal) return;
    updateDealDetails(inspectingDeal.id, {
      adminNotes: dealNotesInput,
      offerPrice: Number(dealOfferPriceInput),
      scheduledVisitDate: dealVisitDateInput ? new Date(dealVisitDateInput).toISOString() : undefined
    });
    setInspectingDeal(null);
  };

  // Send reply handler
  const handleSendReply = () => {
    if (!inspectingDeal || !adminReplyInput.trim()) return;
    sendAdminReply(inspectingDeal.id, adminReplyInput.trim());
    setAdminReplyInput('');
    // Update local modal state so the new reply immediately renders in modal
    setInspectingDeal(prev => {
      if (!prev) return null;
      return {
        ...prev,
        stage: prev.stage === 'new_lead' ? 'contacted' : prev.stage,
        messages: [
          ...(prev.messages || []),
          {
            id: `msg-${Date.now()}`,
            senderRole: 'admin',
            senderName: 'Sarah Jenkins (Admin Concierge)',
            text: adminReplyInput.trim(),
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  };

  return (
    <div className="space-y-6">

      {/* 1. Executive Performance Bar (Apple & Airbnb Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Commission Revenue */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Brokerage Collected</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tracking-tight" suppressHydrationWarning>
              {formatCurrency(totalCommissionEarned)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-semibold">
              <span>⚡ 2.0% Facilitation Retainer</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Closed Gross Volume */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Settled Land Volume</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tracking-tight" suppressHydrationWarning>
              {formatCurrency(totalClosedVolume)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              {closedDeals.length} deals closed through escrow
            </p>
          </div>
        </div>

        {/* Metric 3: Active Mediation Pipeline */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Active Deals in CRM</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tracking-tight" suppressHydrationWarning>
              {activeDeals.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              Buyers & sellers in mediation
            </p>
          </div>
        </div>

        {/* Metric 4: Scheduled Field Inspections */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Field Site Visits</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tracking-tight" suppressHydrationWarning>
              {scheduledVisitsList.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              Assigned to in-house surveyors
            </p>
          </div>
        </div>

        {/* Metric 5: Escrow In Custody */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Token Escrow Locked</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tracking-tight" suppressHydrationWarning>
              {formatCurrency(escrowInPipeline)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              Under custody pending deed signing
            </p>
          </div>
        </div>

      </div>

      {/* 2. Anti-Circumvention Concierge Notice */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                Concierge Anti-Circumvention Protection Active
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Broker Protected
              </span>
            </div>
            <p className="text-[11px] text-stone-300 font-medium truncate">
              Direct seller contact numbers are masked from buyers. All site surveys, deed audits, and token transfers flow through your concierge desk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>+ Add Verified Listing</span>
          </button>
        </div>
      </div>

      {/* 2.5 Inbound Buyer Messages & Inquiries Alert Strip */}
      {inboundMessagesDeals.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/50 rounded-2xl p-4 sm:px-6 sm:py-4 border border-blue-200/90 shadow-[0_4px_16px_rgba(37,99,235,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-blue-950 truncate">
                  {inboundMessagesDeals.length} Inbound Buyer Message{inboundMessagesDeals.length > 1 ? 's' : ''} Received
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">
                  Direct Inquiries
                </span>
              </div>
              <p className="text-xs text-blue-800 font-medium truncate mt-0.5">
                From <strong>{inboundMessagesDeals[0].buyerName}</strong>: "{inboundMessagesDeals[0].buyerMessage || 'Interested in property inspection and title verification'}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenDealEditor(inboundMessagesDeals[0])}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <span>View & Reply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Sub-Desk Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-2 overflow-x-auto gap-3">
        <div className="flex items-center gap-2 shrink-0">
          
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'pipeline'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Deal Pipeline ({dealTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('visits')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'visits'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Site Visits Dispatch ({scheduledVisitsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'inventory'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Property & Sanctions ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'kyc'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>KYC Compliance ({kycRecords.filter(k => k.status === 'pending').length} Pending)</span>
          </button>

        </div>

        {/* View mode toggle (Kanban vs Table) when inside pipeline tab */}
        {activeTab === 'pipeline' && (
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200/80 shrink-0">
            <button
              onClick={() => setPipelineViewMode('kanban')}
              className={`p-1.5 rounded-full transition ${
                pipelineViewMode === 'kanban'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPipelineViewMode('table')}
              className={`p-1.5 rounded-full transition ${
                pipelineViewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Spreadsheet Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEAL MEDIATION PIPELINE                                            */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={dealSearchQuery}
                  onChange={e => setDealSearchQuery(e.target.value)}
                  placeholder="Search deal ID, buyer name, phone, or property..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition"
                />
              </div>

              {dealSearchQuery && (
                <button
                  onClick={() => setDealSearchQuery('')}
                  className="text-xs text-stone-400 hover:text-stone-700 font-semibold px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Channel Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200/70">
              <button
                onClick={() => setSelectedChannelFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  selectedChannelFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All Channels
              </button>
              <button
                onClick={() => setSelectedChannelFilter('land_plot')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
                  selectedChannelFilter === 'land_plot'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <TreePine className="w-3 h-3" />
                <span>Land</span>
              </button>
              <button
                onClick={() => setSelectedChannelFilter('constructed')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
                  selectedChannelFilter === 'constructed'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Villas</span>
              </button>
            </div>

            {/* Stage Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 font-medium">Stage:</span>
              <select
                value={selectedStageFilter}
                onChange={e => setSelectedStageFilter(e.target.value as any)}
                className="bg-stone-50 border border-stone-200 rounded-full px-3 py-1.5 text-xs text-stone-800 font-semibold focus:outline-none focus:border-stone-900"
              >
                <option value="all">All 6 Stages</option>
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* VIEW A: KANBAN BOARD */}
          {pipelineViewMode === 'kanban' && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-stone-300">
              {STAGES.map(stage => {
                const stageDeals = filteredDeals.filter(d => d.stage === stage.id);

                return (
                  <div
                    key={stage.id}
                    className="min-w-[285px] max-w-[320px] flex-1 bg-stone-100/60 rounded-2xl p-3 border border-stone-200/80 flex flex-col justify-between"
                  >
                    {/* Stage Header */}
                    <div className="pb-2.5 mb-2.5 border-b border-stone-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-700">
                            {stage.stepNumber}
                          </span>
                          <span className="text-xs font-bold text-stone-900">{stage.label}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.colorBadge}`}>
                          {stageDeals.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-medium mt-1 truncate">
                        {stage.description}
                      </p>
                    </div>

                    {/* Stage Cards Container */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[640px] pr-1">
                      {stageDeals.map(deal => (
                        <div
                          key={deal.id}
                          className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-2.5 hover:border-stone-300 transition"
                        >
                          {/* Top Row: Deal ID & Channel */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold">
                              {deal.id}
                            </span>
                            <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                              {deal.channel === 'land_plot' ? (
                                <TreePine className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Building2 className="w-3 h-3 text-blue-600" />
                              )}
                              <span>{deal.channel === 'land_plot' ? 'Land' : 'Villa'}</span>
                            </span>
                          </div>

                          {/* Property Title & Plot */}
                          <div>
                            <h5 className="font-bold text-stone-900 text-xs line-clamp-1">
                              {deal.propertyTitle}
                            </h5>
                            {deal.plotNumber && (
                              <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                                {deal.plotNumber}
                              </div>
                            )}
                          </div>

                          {/* Buyer Details */}
                          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-stone-400">Buyer</span>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded-full">
                                Verified Intent
                              </span>
                            </div>
                            <div className="text-xs font-bold text-stone-900 truncate">
                              {deal.buyerName}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-stone-600 pt-0.5">
                              <span className="font-mono">{deal.buyerPhone}</span>
                              <a
                                href={`tel:${deal.buyerPhone}`}
                                className="p-1 rounded hover:bg-stone-200 text-stone-600"
                                title="Call Buyer"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          {/* Inbound Buyer Message / Inquiry Quote */}
                          {deal.buyerMessage && (
                            <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200/90 text-xs space-y-1">
                              <div className="flex items-center justify-between text-blue-900 font-bold text-[10px]">
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3 text-blue-600" />
                                  <span>Inbound Message</span>
                                </span>
                                <span className="text-[10px] text-blue-600 font-mono">
                                  {deal.messages?.length || 1} msg
                                </span>
                              </div>
                              <p className="text-blue-950 font-normal italic text-[11px] leading-relaxed line-clamp-2">
                                "{deal.buyerMessage}"
                              </p>
                            </div>
                          )}

                          {/* Anti-circumvention Seller Shield */}
                          <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-600" />
                                <span>Seller Identity</span>
                              </span>
                              <button
                                onClick={() =>
                                  setUnmaskedLandownerDealId(
                                    unmaskedLandownerDealId === deal.id ? null : deal.id
                                  )
                                }
                                className="text-[10px] font-bold text-amber-800 underline hover:text-amber-950"
                              >
                                {unmaskedLandownerDealId === deal.id ? 'Hide' : 'Reveal'}
                              </button>
                            </div>
                            {unmaskedLandownerDealId === deal.id ? (
                              <div className="mt-1 pt-1 border-t border-amber-200 font-mono text-[10px] text-amber-950">
                                Protected Landowner Dossier: <strong>Robert Hastings</strong> (+1 555-891-2300)
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-700 block truncate">
                                Masked from buyer. Admin escort mandated.
                              </span>
                            )}
                          </div>

                          {/* Financial Offer & 2% Brokerage */}
                          <div className="flex justify-between items-center pt-1 border-t border-stone-100 text-xs">
                            <div>
                              <span className="text-[10px] text-stone-400 font-bold block uppercase">
                                Offer Price
                              </span>
                              <span className="font-extrabold text-stone-900 font-mono" suppressHydrationWarning>
                                {formatCurrency(deal.offerPrice)}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-stone-400 font-bold block uppercase">
                                2.0% Retainer
                              </span>
                              <span className="font-extrabold text-emerald-700 font-mono" suppressHydrationWarning>
                                {formatCurrency(deal.offerPrice * (deal.commissionRate / 100))}
                              </span>
                            </div>
                          </div>

                          {/* Scheduled Visit Tag if available */}
                          {deal.scheduledVisitDate && (
                            <div className="text-[10px] text-stone-600 bg-stone-100 px-2 py-1 rounded-lg flex items-center gap-1.5 font-medium" suppressHydrationWarning>
                              <Calendar className="w-3 h-3 text-stone-500" />
                              <span>
                                Visit: {formatDate(deal.scheduledVisitDate)}
                              </span>
                            </div>
                          )}

                          {/* Actions Bar */}
                          <div className="pt-1.5 space-y-1.5">
                            {stage.nextStage && (
                              <button
                                onClick={() => updateDealStage(deal.id, stage.nextStage!)}
                                className="w-full py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                              >
                                <span>{stage.nextActionLabel}</span>
                              </button>
                            )}

                            {stage.id === 'closed' && (
                              <div className="text-[11px] text-emerald-800 font-bold text-center py-1.5 bg-emerald-100/70 rounded-full border border-emerald-200">
                                ✔ Closed & Commission Disbursed
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-1 pt-0.5">
                              <button
                                onClick={() => handleOpenDealEditor(deal)}
                                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit / Notes</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Remove deal ticket ${deal.id}?`)) {
                                    deleteDealTicket(deal.id);
                                  }
                                }}
                                className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete Deal Ticket"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {stageDeals.length === 0 && (
                        <div className="text-center py-12 text-stone-400 text-xs font-medium border-2 border-dashed border-stone-200 rounded-2xl">
                          No deals in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW B: STRUCTURED SPREADSHEET TABLE */}
          {pipelineViewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50/80 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200/80">
                    <tr>
                      <th className="py-3 px-4">Deal ID</th>
                      <th className="py-3 px-4">Property & Plot</th>
                      <th className="py-3 px-4">Buyer Info</th>
                      <th className="py-3 px-4">Current Stage</th>
                      <th className="py-3 px-4 text-right">Offer Price</th>
                      <th className="py-3 px-4 text-right">2% Retainer</th>
                      <th className="py-3 px-4">Site Visit</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredDeals.map(deal => {
                      const stageObj = STAGES.find(s => s.id === deal.stage);
                      return (
                        <tr key={deal.id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3 px-4 font-mono font-bold text-stone-900">
                            {deal.id}
                          </td>
                          <td className="py-3 px-4 max-w-[200px]">
                            <div className="font-bold text-stone-900 truncate">
                              {deal.propertyTitle}
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                              <span>{deal.channel === 'land_plot' ? 'Cadastral Land' : 'Constructed Villa'}</span>
                              {deal.plotNumber && (
                                <span className="font-semibold text-emerald-700">({deal.plotNumber})</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{deal.buyerName}</div>
                            <div className="text-[11px] text-stone-500 font-mono">{deal.buyerPhone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${stageObj?.colorBadge || 'bg-stone-100 text-stone-700'}`}>
                              {stageObj?.label || deal.stage}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-stone-900" suppressHydrationWarning>
                            {formatCurrency(deal.offerPrice)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700" suppressHydrationWarning>
                            {formatCurrency(deal.offerPrice * (deal.commissionRate / 100))}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-stone-600 font-medium" suppressHydrationWarning>
                            {formatDate(deal.scheduledVisitDate)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {stageObj?.nextStage && (
                                <button
                                  onClick={() => updateDealStage(deal.id, stageObj.nextStage!)}
                                  className="px-3 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] transition shadow-xs"
                                >
                                  Advance →
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenDealEditor(deal)}
                                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600"
                                title="Edit Deal"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredDeals.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-10 text-stone-400 font-medium">
                          No deal tickets found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SITE VISITS DISPATCH DESK                                          */}
      {/* ========================================================================= */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-stone-900 tracking-tight">
                Concierge Surveyor & Escort Dispatch
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Every physical site inspection is accompanied by an in-house licensed broker with mobile cadastral GPS boundary verification.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {scheduledVisitsList.length} Joint Visits In Queue
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledVisitsList.map((visit, idx) => (
              <div
                key={visit.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    VISIT-0{idx + 1}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Scheduled</span>
                  </span>
                </div>

                <div>
                  <h5 className="font-extrabold text-sm text-stone-900 line-clamp-1">
                    {visit.propertyTitle}
                  </h5>
                  {visit.plotNumber && (
                    <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                      {visit.plotNumber}
                    </span>
                  )}
                </div>

                {/* Visit Details */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Target Date:</span>
                    <span className="font-bold text-stone-900 font-mono" suppressHydrationWarning>
                      {visit.scheduledVisitDate ? formatDate(visit.scheduledVisitDate) : 'Pending Confirmation'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Escorted Buyer:</span>
                    <span className="font-bold text-stone-900">{visit.buyerName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Buyer Phone:</span>
                    <span className="font-mono text-stone-800">{visit.buyerPhone}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-stone-500 font-medium">Field Officer:</span>
                    <span className="font-semibold text-stone-900 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Cadastral Surveyor #{idx + 104}</span>
                    </span>
                  </div>
                </div>

                {/* Dispatch Controls */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      updateDealStage(visit.id, 'legal_verification');
                      alert(`✔ Site Visit for ${visit.buyerName} marked COMPLETED. Deal moved to Legal Due Diligence stage!`);
                    }}
                    className="flex-1 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Complete Visit</span>
                  </button>

                  <button
                    onClick={() => handleOpenDealEditor(visit)}
                    className="px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}

            {scheduledVisitsList.length === 0 && (
              <div className="col-span-full py-16 text-center text-stone-400 font-medium bg-white rounded-2xl border border-stone-200/80">
                No site visits currently scheduled.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROPERTY INVENTORY & SANCTIONS REVIEW                              */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-stone-900 tracking-tight">
                Cadastral Survey & Sanction Audit Desk
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Review DTCP / HMDA / RERA approval numbers, survey numbers, and cadastral boundary vectors before featuring properties on the public GIS map.
              </p>
            </div>

            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <span>+ Add Direct Verified Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
              >
                {/* Header with Title and Channel */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold">
                        {property.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 uppercase">
                        {property.subType.replace('_', ' ')}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-sm text-stone-900 line-clamp-1">
                      {property.title}
                    </h5>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{property.location.city}, {property.location.state}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-stone-900 font-mono block" suppressHydrationWarning>
                      {formatCurrency(property.price)}
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium font-mono">
                      ${property.pricePerSqft}/sqft
                    </span>
                  </div>
                </div>

                {/* Legal & Sanction Audit Strip */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Approval Sanction:</span>
                    <span className="font-mono font-bold text-stone-900 px-2 py-0.5 rounded bg-white border border-stone-200">
                      {property.verification.approvalType} • {property.verification.approvalNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Cadastral Survey #:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {property.verification.surveyNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Road Width / Approach:</span>
                    <span className="font-semibold text-stone-800 font-mono">
                      {property.roadWidthFt} ft paved road
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Sub-registrar Title:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Clear Encumbrance (EC)</span>
                    </span>
                  </div>
                </div>

                {/* Admin Toggles & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={property.verification.isVerified}
                        onChange={() => togglePropertyVerification(property.id)}
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                      />
                      <span>Verified Title</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={!!property.featured}
                        onChange={() => togglePropertyFeatured(property.id)}
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                      />
                      <span>Featured Map Pin</span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsDetailModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
                  >
                    Inspect GIS Data →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KYC & BROKER COMPLIANCE VAULT                                      */}
      {/* ========================================================================= */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-stone-900 tracking-tight">
                Seller & Broker KYC Trust Vault
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Government Aadhaar IDs, Passport numbers, and state RERA broker licenses must be vetted by Admin before granting listing privileges.
              </p>
            </div>

            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0">
              🔒 Encrypted Document Storage
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] divide-y divide-stone-100 overflow-hidden">
            {kycRecords.map(record => (
              <div
                key={record.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-stone-900 text-sm">
                      {record.userName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase">
                      {record.entityType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        record.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : record.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 font-medium">
                    Government ID: <span className="font-mono font-bold text-stone-900 uppercase">{record.idType.replace('_', ' ')}</span> • Number: <span className="font-mono font-bold text-stone-900">{record.idNumber}</span>
                  </div>

                  <div className="text-[11px] text-stone-400 font-mono" suppressHydrationWarning>
                    Submitted: {formatDate(record.submittedAt)} • Ref #{record.id}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewKycRecord(record)}
                    className="px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </button>

                  {record.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          approveKyc(record.id);
                          alert(`✔ KYC Approved for ${record.userName}. Seller portal access is now active!`);
                        }}
                        className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        Approve Access
                      </button>

                      <button
                        onClick={() => {
                          rejectKyc(record.id);
                          alert(`KYC application for ${record.userName} was rejected.`);
                        }}
                        className="px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DEAL DETAIL & NOTES INSPECTOR                                    */}
      {/* ========================================================================= */}
      {inspectingDeal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {inspectingDeal.id}
                </span>
                <h4 className="font-extrabold text-base text-stone-900 mt-1">
                  Manage Concierge Deal Ticket
                </h4>
              </div>
              <button
                onClick={() => setInspectingDeal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-500 font-bold uppercase tracking-wider mb-1">
                  Property Title
                </label>
                <div className="font-bold text-stone-900 text-sm">
                  {inspectingDeal.propertyTitle}
                </div>
                {inspectingDeal.plotNumber && (
                  <span className="text-emerald-700 font-semibold">{inspectingDeal.plotNumber}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 font-bold uppercase tracking-wider mb-1">
                    Buyer Name
                  </label>
                  <div className="font-bold text-stone-900">{inspectingDeal.buyerName}</div>
                  <div className="font-mono text-stone-500 text-[11px]">{inspectingDeal.buyerPhone}</div>
                </div>

                <div>
                  <label className="block text-stone-500 font-bold uppercase tracking-wider mb-1">
                    Offer Price ($)
                  </label>
                  <input
                    type="number"
                    value={dealOfferPriceInput}
                    onChange={e => setDealOfferPriceInput(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-mono font-bold text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-500 font-bold uppercase tracking-wider mb-1">
                  Scheduled Site Inspection Date
                </label>
                <input
                  type="date"
                  value={dealVisitDateInput}
                  onChange={e => setDealVisitDateInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Interactive Conversation & Messaging Thread */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Buyer Inbound Message & Negotiation Thread</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 font-bold">
                    {inspectingDeal.messages?.length || (inspectingDeal.buyerMessage ? 1 : 0)} messages
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {/* If initial buyerMessage exists but no messages array */}
                  {inspectingDeal.buyerMessage && (!inspectingDeal.messages || inspectingDeal.messages.length === 0) && (
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-blue-800 font-bold">
                        <span>{inspectingDeal.buyerName} (Buyer)</span>
                        <span className="font-mono text-blue-500">{formatDate(inspectingDeal.createdAt)}</span>
                      </div>
                      <p className="text-blue-950 font-normal">{inspectingDeal.buyerMessage}</p>
                    </div>
                  )}

                  {inspectingDeal.messages?.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl text-xs space-y-1 ${
                        msg.senderRole === 'admin'
                          ? 'bg-purple-50 border border-purple-200 ml-4'
                          : 'bg-blue-50 border border-blue-200 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={msg.senderRole === 'admin' ? 'text-purple-800' : 'text-blue-800'}>
                          {msg.senderName} ({msg.senderRole === 'admin' ? 'You' : 'Buyer'})
                        </span>
                        <span className="font-mono text-stone-400 text-[9px]">{formatDate(msg.timestamp)}</span>
                      </div>
                      <p className={msg.senderRole === 'admin' ? 'text-purple-950 font-medium' : 'text-blue-950 font-normal'}>
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Admin Reply Box */}
                <div className="pt-2 border-t border-stone-200 flex gap-2">
                  <input
                    type="text"
                    value={adminReplyInput}
                    onChange={e => setAdminReplyInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder="Type official reply to buyer (e.g. Survey inspection confirmed)..."
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shrink-0"
                  >
                    Send Reply
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-500 font-bold uppercase tracking-wider mb-1">
                  Concierge Admin Notes & Title Findings
                </label>
                <textarea
                  rows={3}
                  value={dealNotesInput}
                  onChange={e => setDealNotesInput(e.target.value)}
                  placeholder="Record encumbrance details, buyer financing progress, surveyor notes..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setInspectingDeal(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDealUpdates}
                className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition"
              >
                Save Ticket Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: KYC DOCUMENT VIEWER (SIMULATED GOVERNMENT AUDIT)                 */}
      {/* ========================================================================= */}
      {previewKycRecord && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-stone-900">
                    Official Document Audit
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Ref: {previewKycRecord.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewKycRecord(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Government Official Certificate Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-stone-50 to-stone-100 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Government Sanctioned Document
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  CRYPTOGRAPHIC CHECKSUM VERIFIED
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Holder Name</span>
                  <span className="font-extrabold text-stone-900 text-sm">{previewKycRecord.userName}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Entity Type</span>
                  <span className="font-bold text-stone-800 capitalize">{previewKycRecord.entityType}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Document Type & Sanction #</span>
                  <span className="font-mono font-bold text-stone-900 uppercase">
                    {previewKycRecord.idType.replace('_', ' ')}: {previewKycRecord.idNumber}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Vault URL (Signed Token)</span>
                  <span className="font-mono text-[11px] text-stone-600 truncate block">
                    {previewKycRecord.documentUrl}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 font-mono text-center pt-2 border-t border-stone-200">
                🔒 Stored in SOC-2 Compliant Tamper-Proof Cadastral Repository
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewKycRecord(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
              >
                Close Viewer
              </button>

              {previewKycRecord.status === 'pending' && (
                <button
                  onClick={() => {
                    approveKyc(previewKycRecord.id);
                    setPreviewKycRecord(null);
                    alert(`✔ KYC Approved for ${previewKycRecord.userName}!`);
                  }}
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Approve Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
