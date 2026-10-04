'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { VenturePlot, PlotStatus } from '@/types';
import {
  TreePine,
  CheckCircle2,
  Clock,
  Ban,
  ArrowRight,
  ShieldCheck,
  Grid,
  Map as MapIcon,
  Check
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/formatters';

export default function VentureLayoutExplorer() {
  const { selectedProperty, selectedVenturePlotId, setSelectedVenturePlotId, setIsDealModalOpen } = useApp();
  const [filterFacing, setFilterFacing] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'blueprint' | 'grid'>('blueprint');

  if (!selectedProperty?.isVentureLayout || !selectedProperty.venturePlots) {
    return null;
  }

  const plots = selectedProperty.venturePlots;
  const selectedPlot = plots.find(p => p.id === selectedVenturePlotId) || plots[0];

  const filteredPlots = plots.filter(p => {
    if (filterFacing !== 'all' && !p.facing.toLowerCase().includes(filterFacing.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all' && p.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const availableCount = plots.filter(p => p.status === 'available').length;
  const reservedCount = plots.filter(p => p.status === 'reserved').length;
  const soldCount = plots.filter(p => p.status === 'sold').length;

  const northRowPlots = plots.slice(0, 8);
  const southRowPlots = plots.slice(8, 16);

  return (
    <div className="bg-white border border-stone-200/80 rounded-[28px] p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
      
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider shrink-0">
              Sanctioned Masterplan
            </span>
            <span className="text-xs text-stone-500 font-medium truncate">
              {selectedProperty.ventureName || 'Palm Valley Township'}
            </span>
          </div>
          <h3 className="text-xl font-black text-stone-900 mt-1 tracking-tight truncate">
            Plotted Venture Layout Grid
          </h3>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200/80 text-xs font-semibold shrink-0">
          <button
            onClick={() => setViewMode('blueprint')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition ${
              viewMode === 'blueprint' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Masterplan View</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition ${
              viewMode === 'grid' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid Cards</span>
          </button>
        </div>
      </div>

      {/* Legend & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Status Legend */}
        <div className="flex items-center gap-4 text-stone-600 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Available ({availableCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Reserved ({reservedCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
            <span>Sold ({soldCount})</span>
          </span>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="text-[11px] font-semibold text-stone-400 mr-1 shrink-0">Facing:</span>
          {['all', 'East', 'North', 'Corner', 'West', 'South'].map(facing => (
            <button
              key={facing}
              onClick={() => setFilterFacing(facing)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition shrink-0 ${
                filterFacing === facing
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {facing === 'all' ? 'All' : facing}
            </button>
          ))}
        </div>

      </div>

      {/* Main Interactive Stage: Blueprint / Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Architectural Blueprint or Grid (8 cols) */}
        <div className="lg:col-span-8 min-w-0">
          
          {/* MODE 1: Light Architectural Masterplan Drawing with min-w-[620px] and smooth scroll */}
          {viewMode === 'blueprint' && (
            <div className="bg-[#FAF9F6] border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-xs overflow-x-auto">
              <div className="min-w-[620px] space-y-3">
                
                {/* 40 FT Main Road */}
                <div className="bg-stone-200/70 border border-stone-300/80 rounded-xl p-2.5 text-center text-xs font-semibold text-stone-700 flex items-center justify-between px-4">
                  <span>🛣️ 40 FT MAIN ACCESS ROAD</span>
                  <span className="text-[10px] bg-white/80 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200 shrink-0">
                    GRAND ENTRY ARCH
                  </span>
                </div>

                {/* NORTH ROW (101 to 108) */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pl-1">
                    Sector A · North Row
                  </span>
                  <div className="grid grid-cols-8 gap-2">
                    {northRowPlots.map(plot => {
                      const isSelected = selectedPlot.id === plot.id;
                      const isAvailable = plot.status === 'available';
                      const isReserved = plot.status === 'reserved';
                      const isSold = plot.status === 'sold';

                      return (
                        <button
                          key={plot.id}
                          onClick={() => setSelectedVenturePlotId(plot.id)}
                          disabled={isSold}
                          className={`p-2 rounded-xl text-left transition-all h-24 flex flex-col justify-between relative group min-w-[68px] overflow-hidden ${
                            isSelected
                              ? 'ring-2 ring-stone-900 shadow-md scale-[1.03] z-10 bg-white'
                              : 'hover:shadow-sm'
                          } ${
                            isAvailable
                              ? 'bg-white border border-emerald-200 text-stone-800 hover:border-emerald-400'
                              : isReserved
                              ? 'bg-amber-50/70 border border-amber-200 text-amber-900'
                              : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[11px] font-black text-stone-900 truncate">#{plot.plotNumber}</span>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isAvailable ? 'bg-emerald-500' : isReserved ? 'bg-amber-400' : 'bg-stone-300'}`}></span>
                          </div>
                          <div className="text-[10px] text-stone-500 leading-tight truncate">
                            <div className="truncate">{plot.sqft} sq ft</div>
                            <div className="text-[9px] text-stone-400 truncate">{plot.dimensions.split(' ')[0]}</div>
                          </div>
                          <div className="text-[10px] font-bold text-stone-800 truncate">
                            ${(plot.price / 1000).toFixed(0)}k
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CENTRAL 30 FT ROAD & PARK */}
                <div className="grid grid-cols-12 gap-2 items-center my-1.5">
                  <div className="col-span-9 bg-stone-200/50 border-y border-dashed border-stone-300 py-2 px-3 text-center text-[10px] font-bold text-stone-500 tracking-wider truncate">
                    ⬅ 30 FT INTERNAL AVENUE (UNDERGROUND UTILITIES) ➡
                  </div>
                  <div className="col-span-3 bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-2 text-center text-[10px] font-bold text-emerald-800 flex items-center justify-center gap-1 shrink-0">
                    <span>🌳 DTCP PARK</span>
                  </div>
                </div>

                {/* SOUTH ROW (109 to 116) */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pl-1">
                    Sector B · South Row
                  </span>
                  <div className="grid grid-cols-8 gap-2">
                    {southRowPlots.map(plot => {
                      const isSelected = selectedPlot.id === plot.id;
                      const isAvailable = plot.status === 'available';
                      const isReserved = plot.status === 'reserved';
                      const isSold = plot.status === 'sold';

                      return (
                        <button
                          key={plot.id}
                          onClick={() => setSelectedVenturePlotId(plot.id)}
                          disabled={isSold}
                          className={`p-2 rounded-xl text-left transition-all h-24 flex flex-col justify-between relative group min-w-[68px] overflow-hidden ${
                            isSelected
                              ? 'ring-2 ring-stone-900 shadow-md scale-[1.03] z-10 bg-white'
                              : 'hover:shadow-sm'
                          } ${
                            isAvailable
                              ? 'bg-white border border-emerald-200 text-stone-800 hover:border-emerald-400'
                              : isReserved
                              ? 'bg-amber-50/70 border border-amber-200 text-amber-900'
                              : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[11px] font-black text-stone-900 truncate">#{plot.plotNumber}</span>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isAvailable ? 'bg-emerald-500' : isReserved ? 'bg-amber-400' : 'bg-stone-300'}`}></span>
                          </div>
                          <div className="text-[10px] text-stone-500 leading-tight truncate">
                            <div className="truncate">{plot.sqft} sq ft</div>
                            <div className="text-[9px] text-stone-400 truncate">{plot.dimensions.split(' ')[0]}</div>
                          </div>
                          <div className="text-[10px] font-bold text-stone-800 truncate">
                            ${(plot.price / 1000).toFixed(0)}k
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* MODE 2: Grid List View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredPlots.map(plot => {
                const isSelected = selectedPlot.id === plot.id;
                const isAvailable = plot.status === 'available';
                const isReserved = plot.status === 'reserved';
                const isSold = plot.status === 'sold';

                return (
                  <button
                    key={plot.id}
                    onClick={() => setSelectedVenturePlotId(plot.id)}
                    disabled={isSold}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'ring-2 ring-stone-900 shadow-sm bg-white'
                        : 'hover:bg-stone-50/60 bg-white'
                    } ${
                      isAvailable
                        ? 'border-stone-200'
                        : isReserved
                        ? 'border-amber-200 bg-amber-50/30'
                        : 'border-stone-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm text-stone-900">#{plot.plotNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAvailable ? 'bg-emerald-50 text-emerald-800' : isReserved ? 'bg-amber-50 text-amber-800' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {plot.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-stone-500">
                      <div>{formatNumber(plot.sqft)} sq ft</div>
                      <div className="text-[11px] text-stone-400">{plot.dimensions} · {plot.facing}</div>
                    </div>
                    <div className="mt-2 text-sm font-black text-stone-900" suppressHydrationWarning>
                      {formatCurrency(plot.price)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Plot Detail Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-stone-50/80 rounded-2xl p-5 border border-stone-200/80 space-y-4 min-w-0">
          
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                selectedPlot.status === 'available'
                  ? 'bg-emerald-100 text-emerald-800'
                  : selectedPlot.status === 'reserved'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-200 text-stone-600'
              }`}>
                {selectedPlot.status}
              </span>
              <h4 className="text-xl font-black text-stone-900 mt-1 truncate">Plot #{selectedPlot.plotNumber}</h4>
              <p className="text-xs text-stone-500 font-medium truncate">{selectedPlot.dimensions} · {selectedPlot.facing} Facing</p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xl font-black text-stone-900" suppressHydrationWarning>
                {formatCurrency(selectedPlot.price)}
              </div>
              <div className="text-[11px] text-stone-400 font-medium">
                ${(selectedPlot.price / selectedPlot.sqft).toFixed(2)} / sq ft
              </div>
            </div>
          </div>

          {/* Specs Details */}
          <div className="bg-white rounded-xl p-3.5 border border-stone-200/70 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-100 gap-2">
              <span className="text-stone-500 shrink-0">Total Area:</span>
              <span className="font-bold text-stone-900 truncate" suppressHydrationWarning>{formatNumber(selectedPlot.sqft)} sq ft</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100 gap-2">
              <span className="text-stone-500 shrink-0">Road Frontage:</span>
              <span className="font-semibold text-emerald-700 truncate">30 ft Tar Road</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100 gap-2">
              <span className="text-stone-500 shrink-0">Facing:</span>
              <span className="font-semibold text-stone-800 truncate">{selectedPlot.facing}</span>
            </div>
            <div className="flex justify-between py-1 gap-2">
              <span className="text-stone-500 shrink-0">Sanction:</span>
              <span className="font-semibold text-stone-800 truncate">DTCP Approved</span>
            </div>
          </div>

          <button
            onClick={() => setIsDealModalOpen(true)}
            disabled={selectedPlot.status === 'sold'}
            className="w-full py-3 rounded-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Book Visit for Plot #{selectedPlot.plotNumber}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <p className="text-[10px] text-stone-400 text-center font-medium">
            🔒 Admin Concierge will arrange your escorted site tour.
          </p>

        </div>

      </div>

    </div>
  );
}
