'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  X,
  ShieldCheck,
  MapPin,
  Compass,
  CheckCircle2,
  TreePine,
  Building2,
  Lock,
  PhoneCall,
  Calendar,
  Layers,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function PropertyDetailModal() {
  const {
    selectedProperty,
    isDetailModalOpen,
    setIsDetailModalOpen,
    setIsDealModalOpen,
    setIsContactModalOpen,
    setContactProperty
  } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isDetailModalOpen || !selectedProperty) return null;

  const isLand = selectedProperty.channel === 'land_plot';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
              {isLand ? 'Land / Plot Specification' : 'Constructed Residence'}
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">ID: {selectedProperty.id}</span>
          </div>

          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Image Gallery */}
          <div className="space-y-2">
            <div className="relative h-64 sm:h-84 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <img
                src={selectedProperty.images[activeImageIndex]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-900 border border-slate-200/80 shadow-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{selectedProperty.verification.approvalType} Approved • Survey #{selectedProperty.verification.surveyNumber}</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {selectedProperty.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    activeImageIndex === idx ? 'border-blue-600 scale-105 shadow-sm' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Info & Price Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedProperty.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{selectedProperty.location.address}, {selectedProperty.location.city}, {selectedProperty.location.state}</span>
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-3 sm:p-0 rounded-xl sm:bg-transparent border sm:border-0 border-slate-200">
              <div className="text-2xl font-extrabold text-slate-900">
                ${selectedProperty.price.toLocaleString('en-US')}
              </div>
              <div className="text-xs text-emerald-700 font-bold font-mono">
                ${selectedProperty.pricePerSqft.toFixed(2)} / sq ft • Total: {selectedProperty.totalSqft.toLocaleString('en-US')} sq ft
              </div>
            </div>
          </div>

          {/* Spatial Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Area</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{selectedProperty.totalSqft.toLocaleString('en-US')} sq ft</span>
              <span className="text-[10px] text-slate-500 font-medium">{(selectedProperty.totalSqft / 43560).toFixed(2)} Acres</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Approach Road</span>
              <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{selectedProperty.roadWidthFt} ft Road</span>
              <span className="text-[10px] text-slate-500 font-medium">Metalled Tar Access</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Facing</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{selectedProperty.facing}</span>
              <span className="text-[10px] text-slate-500 font-medium">Vastu Compliant</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Zoning</span>
              <span className="text-sm font-bold text-blue-700 mt-0.5 block">{selectedProperty.zoning}</span>
              <span className="text-[10px] text-slate-500 font-medium">Clear Title Deed</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Property Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-normal">
              {selectedProperty.description}
            </p>
          </div>

          {/* Exact Survey Perimeter Dimensions */}
          {selectedProperty.edgeMeasurements && selectedProperty.edgeMeasurements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Exact Survey Perimeter Dimensions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {selectedProperty.edgeMeasurements.map((edge, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block">{edge.sideName}</span>
                    <span className="font-extrabold text-slate-900 text-sm">{edge.lengthFt} ft</span>
                    {edge.isRoadFacing && (
                      <span className="text-[9px] text-emerald-700 block font-bold mt-0.5">✔ Road Facing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anti-Circumvention Protection Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Direct Contacts Protected by Admin Concierge</h4>
                <p className="text-xs text-slate-600">
                  Seller contact information and title deed numbers are held in our secure vault. Our Admin coordinates verified on-site visits and facilitates escrow closing.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => {
                  setContactProperty(selectedProperty);
                  setIsDetailModalOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Message Admin</span>
              </button>

              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsDealModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>Express Interest & Book Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
