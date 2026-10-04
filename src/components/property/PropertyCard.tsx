'use client';

import React from 'react';
import { Property } from '@/types';
import { useApp } from '@/lib/store';
import {
  MapPin,
  CheckCircle2,
  TreePine,
  Building2,
  ArrowRight,
  Compass
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect?: () => void;
}

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const { selectedProperty, setSelectedProperty, setIsDetailModalOpen, setIsDealModalOpen } = useApp();

  const isSelected = selectedProperty?.id === property.id;
  const isLand = property.channel === 'land_plot';

  return (
    <div
      onClick={() => {
        setSelectedProperty(property);
        if (onSelect) onSelect();
      }}
      className={`group relative rounded-[24px] bg-white border transition-all duration-300 overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-stone-900 ring-2 ring-stone-900/10 shadow-[0_12px_32px_rgba(0,0,0,0.08)]'
          : 'border-stone-200/80 hover:border-stone-300 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Property Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges (Strict overflow protection) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-800 shadow-sm border border-emerald-200/60 flex items-center gap-1 truncate shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{property.verification.approvalType} Approved</span>
            </span>

            {property.isVentureLayout && (
              <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-900 text-white shadow-sm truncate shrink-0">
                Masterplan
              </span>
            )}
          </div>

          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-900/70 backdrop-blur-md text-white shrink-0">
            #{property.verification.surveyNumber}
          </span>
        </div>

        {/* Channel Icon Badge */}
        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm text-stone-700">
          {isLand ? <TreePine className="w-3.5 h-3.5 text-emerald-700" /> : <Building2 className="w-3.5 h-3.5 text-stone-900" />}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4 space-y-2.5">
        
        {/* Title & Price Row (with min-w-0 on text container to avoid any flex blowout) */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-stone-700 transition truncate">
              {property.title}
            </h4>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 font-medium truncate">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{property.location.city} · Survey #{property.verification.surveyNumber}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base font-black text-stone-900 whitespace-nowrap">
              ${property.price.toLocaleString('en-US')}
            </div>
            <div className="text-[10px] text-stone-400 font-medium whitespace-nowrap">
              ${property.pricePerSqft.toFixed(2)}/sq ft
            </div>
          </div>
        </div>

        {/* Land Metrics Strip */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-stone-500 font-medium pt-1 border-t border-stone-100">
          <span>{property.totalSqft.toLocaleString('en-US')} sq ft</span>
          <span>·</span>
          <span>{property.roadWidthFt} ft Road</span>
          <span>·</span>
          <span>{property.facing}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setSelectedProperty(property);
              if (onSelect) onSelect();
            }}
            className="py-2 px-3 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition flex items-center justify-center gap-1"
            title="View on Google Map"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setSelectedProperty(property);
              setIsDetailModalOpen(true);
            }}
            className="flex-1 py-2 px-3 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold text-center transition"
          >
            Specs
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setSelectedProperty(property);
              setIsDealModalOpen(true);
            }}
            className="flex-1 py-2 px-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold text-center transition shadow-xs flex items-center justify-center gap-1"
          >
            <span>Book Visit</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
