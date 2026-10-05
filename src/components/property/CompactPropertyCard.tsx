'use client';

import React from 'react';
import { Property } from '@/types';
import {
  MapPin,
  CheckCircle2,
  TreePine,
  Building2,
  Compass,
  Layers,
  ArrowRight,
  Eye,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatNumber, formatIndianNumber, formatCompactINR } from '@/lib/formatters';

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
      className={`group relative rounded-2xl bg-white/95 backdrop-blur-xl border transition-all duration-300 cursor-pointer select-none text-left ${
        isSideView ? 'w-full mb-3' : 'w-[290px] sm:w-[330px] shrink-0'
      } ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/40 shadow-[0_12px_30px_rgba(37,99,235,0.22)] bg-gradient-to-b from-blue-50/40 to-white scale-[1.02] z-20'
          : 'border-stone-200/90 hover:border-stone-300 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.01]'
      }`}
    >
      <div className="p-3 sm:p-3.5 space-y-2">
        {/* Top Header: Image Thumbnail + Core Metadata */}
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 shadow-xs">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {isSelected && (
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>Active</span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 p-1 rounded-md bg-stone-900/80 backdrop-blur-md text-white">
              {isLand ? <TreePine className="w-2.5 h-2.5 text-emerald-400" /> : <Building2 className="w-2.5 h-2.5 text-sky-400" />}
            </div>
          </div>

          {/* Title & Info */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                {property.verification.approvalType}
              </span>
              <span className="text-[10px] text-stone-500 font-mono font-medium truncate">
                #{property.verification.surveyNumber.split(' ')[0]}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-blue-600 transition leading-snug line-clamp-1">
              {property.title}
            </h4>

            <p className="text-[11px] text-stone-500 flex items-center gap-1 font-medium truncate">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{property.location.city}</span>
            </p>

            <div className="flex items-baseline gap-1.5 pt-0.5">
              <span className="text-sm sm:text-base font-black text-stone-900 whitespace-nowrap" suppressHydrationWarning>
                {formatCurrency(property.price)}
              </span>
              <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap" suppressHydrationWarning>
                (₹{formatIndianNumber(Math.round(property.pricePerSqft))}/sq ft)
              </span>
            </div>
          </div>
        </div>

        {/* Spatial Key Metrics */}
        <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-xl bg-stone-50 border border-stone-100 text-[10px] text-stone-600 font-medium text-center">
          <div className="truncate">
            <span className="text-stone-400 block text-[9px] uppercase font-bold">Area</span>
            <span className="font-bold text-stone-800 truncate" suppressHydrationWarning>{formatNumber(property.totalSqft)} sq ft</span>
          </div>
          <div className="truncate border-x border-stone-200/60 px-1">
            <span className="text-stone-400 block text-[9px] uppercase font-bold">Road</span>
            <span className="font-bold text-stone-800 truncate">{property.roadWidthFt} ft</span>
          </div>
          <div className="truncate">
            <span className="text-stone-400 block text-[9px] uppercase font-bold">Facing</span>
            <span className="font-bold text-stone-800 truncate">{property.facing}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onSelect();
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-1 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
            title="Focus and fly map to this property"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Show on Map</span>
          </button>

          {property.isVentureLayout && onOpenMasterplan && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onSelect();
                onOpenMasterplan();
              }}
              className="py-1.5 px-2.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition flex items-center justify-center gap-1 shrink-0"
              title="Inspect Plotted Masterplan (16 Plots)"
            >
              <Layers className="w-3.5 h-3.5" />
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
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition shrink-0"
            title="View Full Specifications"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onSelect();
              onOpenVisit();
            }}
            className="py-1.5 px-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1 shrink-0"
            title="Book Physical Site Visit with Surveyor"
          >
            <span>Visit</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
