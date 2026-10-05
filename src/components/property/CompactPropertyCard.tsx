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
  Layers
} from 'lucide-react';
import { formatCurrency, formatNumber, formatCompactINR } from '@/lib/formatters';

interface CompactPropertyCardProps {
  property: Property;
  isSelected: boolean;
  onSelect: () => void;
  onOpenMasterplan?: () => void;
  onOpenDetails: () => void;
  onOpenVisit: () => void;
  isSideView?: boolean;
}

export default function CompactPropertyCard({
  property,
  isSelected,
  onSelect,
  onOpenMasterplan,
  onOpenDetails,
  onOpenVisit,
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
      className={`group relative rounded-xl bg-white/95 backdrop-blur-xl border transition-all duration-200 cursor-pointer select-none text-left p-2 sm:p-2.5 ${
        isSideView ? 'w-full mb-1.5' : 'w-[200px] xs:w-[215px] sm:w-[245px] shrink-0'
      } ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/60 shadow-[0_6px_20px_rgba(37,99,235,0.22)] bg-gradient-to-r from-blue-50/80 via-white to-white scale-[1.02] z-20'
          : 'border-stone-200/90 hover:border-stone-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Left: Ultra-compact Thumbnail */}
        <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80">
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
            {isLand ? <TreePine className="w-2 h-2 text-emerald-400" /> : <Building2 className="w-2 h-2 text-sky-400" />}
          </div>
        </div>

        {/* Right: Info & Price (Tight vertical stack) */}
        <div className="min-w-0 flex-1 space-y-0.5">
          {/* Top Pill Row */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
              {property.verification.approvalType}
            </span>
            <span className="text-[9px] text-stone-500 font-mono truncate">
              #{property.verification.surveyNumber.split(' ')[0]}
            </span>
          </div>

          {/* Title (Single line) */}
          <h4 className="text-[11px] sm:text-xs font-black text-stone-900 group-hover:text-blue-600 transition truncate leading-tight">
            {property.title}
          </h4>

          {/* Location & Specs */}
          <p className="text-[10px] text-stone-500 truncate font-medium flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
            <span className="truncate">{property.location.city.split('(')[0].trim()}</span>
            <span>·</span>
            <span suppressHydrationWarning>{formatNumber(property.totalSqft)} sqft</span>
          </p>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between gap-1 pt-0.5">
            <span className="text-xs sm:text-sm font-black text-stone-900 whitespace-nowrap" suppressHydrationWarning>
              {formatCompactINR(property.price)}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              {property.isVentureLayout && onOpenMasterplan && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onSelect();
                    onOpenMasterplan();
                  }}
                  className="px-1.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-bold transition flex items-center gap-0.5"
                  title="16 Layout Plots"
                >
                  <Layers className="w-2.5 h-2.5" />
                  <span>Plots</span>
                </button>
              )}

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onSelect();
                  onOpenDetails();
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
                title="View Full Specifications"
              >
                <Eye className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onSelect();
                  onOpenVisit();
                }}
                className="px-2 py-0.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-bold shadow-2xs transition flex items-center gap-0.5"
                title="Site Visit"
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
