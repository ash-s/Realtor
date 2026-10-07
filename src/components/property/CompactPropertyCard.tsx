'use client';

import React from 'react';
import { Property } from '@/types';
import {
  MapPin,
  TreePine,
  Building2,
  Compass,
  ArrowRight,
  Eye,
  Layers,
  View
} from 'lucide-react';
import { formatCurrency, formatNumber, formatCompactINR } from '@/lib/formatters';

interface CompactPropertyCardProps {
  property: Property;
  isSelected: boolean;
  onSelect: () => void;
  onOpenMasterplan?: () => void;
  onOpenDetails: () => void;
  onOpenVisit: () => void;
  onOpenStreetView?: () => void;
  isSideView?: boolean;
}

export default function CompactPropertyCard({
  property,
  isSelected,
  onSelect,
  onOpenMasterplan,
  onOpenDetails,
  onOpenVisit,
  onOpenStreetView,
  isSideView = false
}: CompactPropertyCardProps) {
  const isLand = property.channel === 'land_plot';

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative rounded-2xl bg-white/95 backdrop-blur-xl border transition-all duration-200 cursor-pointer select-none text-left p-2.5 sm:p-3 overflow-hidden ${
        isSideView ? 'w-full mb-2' : 'w-[260px] xs:w-[275px] sm:w-[295px] lg:w-[315px] shrink-0'
      } ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/60 shadow-[0_8px_24px_rgba(37,99,235,0.22)] bg-gradient-to-r from-blue-50/80 via-white to-white scale-[1.01] z-20'
          : 'border-stone-200/90 hover:border-stone-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Left: Ultra-compact Thumbnail */}
        <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 shadow-2xs">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {isSelected && (
            <div className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded bg-blue-600 text-white text-[7px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
              <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
              <span>GPS</span>
            </div>
          )}
          <div className="absolute bottom-0.5 right-0.5 p-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-white">
            {isLand ? <TreePine className="w-2.5 h-2.5 text-emerald-400" /> : <Building2 className="w-2.5 h-2.5 text-sky-400" />}
          </div>
        </div>

        {/* Right: Info & Price */}
        <div className="min-w-0 flex-1 space-y-1">
          {/* Top Pill Row */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                {property.verification.approvalType}
              </span>
              {property.isVentureLayout && onOpenMasterplan && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onSelect();
                    onOpenMasterplan();
                  }}
                  className="px-1.5 py-0.5 rounded-md bg-emerald-100/70 hover:bg-emerald-200 text-emerald-900 text-[9px] font-extrabold transition flex items-center gap-0.5 shrink-0"
                  title="Inspect 16 Layout Plots"
                >
                  <Layers className="w-2.5 h-2.5 text-emerald-700" />
                  <span>16 Plots</span>
                </button>
              )}
            </div>

            <span className="text-[9.5px] text-stone-500 font-mono shrink-0">
              #{property.verification.surveyNumber.split(' ')[0]}
            </span>
          </div>

          {/* Title (Single line) */}
          <h4 className="text-xs font-black text-stone-900 group-hover:text-blue-600 transition truncate leading-snug">
            {property.title}
          </h4>

          {/* Location & Specs */}
          <p className="text-[10px] text-stone-500 truncate font-medium flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
            <span className="truncate">{property.location.city.split('(')[0].trim()}</span>
            <span>·</span>
            <span suppressHydrationWarning>{formatNumber(property.totalSqft)} sqft</span>
          </p>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-xs sm:text-sm font-black text-stone-900 whitespace-nowrap" suppressHydrationWarning>
                {formatCompactINR(property.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onOpenStreetView && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onSelect();
                    onOpenStreetView();
                  }}
                  className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 text-[10px] font-bold transition flex items-center gap-1 active:scale-95"
                  title="Open 360° Street View"
                >
                  <View className="w-3 h-3 text-blue-600" />
                  <span>360°</span>
                </button>
              )}

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onSelect();
                  onOpenVisit();
                }}
                className="px-2.5 py-0.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-extrabold shadow-2xs transition flex items-center gap-1 active:scale-95"
                title="Book Site Visit"
              >
                <span>Visit</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
