'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import VentureLayoutExplorer from '@/components/map/VentureLayoutExplorer';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyDetailModal from '@/components/property/PropertyDetailModal';
import CreateDealModal from '@/components/deals/CreateDealModal';
import AddPropertyModal from '@/components/seller/AddPropertyModal';
import KycModal from '@/components/kyc/KycModal';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import {
  LayoutGrid,
  Map as MapIcon,
  Compass,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const GoogleMapGIS = dynamic(() => import('@/components/map/GoogleMapGIS'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] sm:h-[600px] lg:h-[680px] rounded-[28px] bg-stone-100 border border-stone-200/80 flex flex-col items-center justify-center text-xs text-stone-500 font-medium space-y-2">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin"></div>
      <p>Loading Satellite GIS Engine...</p>
    </div>
  )
});

export default function Home() {
  const {
    activeChannel,
    properties,
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    selectedSubType,
    setSelectedSubType,
    setIsDetailModalOpen
  } = useApp();

  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const handleSwitchMobileView = (view: 'list' | 'map') => {
    setMobileView(view);
    if (view === 'map') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 80);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  };

  // Filter properties by channel, search, and subtype
  const filteredProperties = properties.filter(prop => {
    if (prop.channel !== activeChannel) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchCity = prop.location.city.toLowerCase().includes(q);
      const matchAddress = prop.location.address.toLowerCase().includes(q);
      const matchSurvey = prop.verification.surveyNumber.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchAddress && !matchSurvey) return false;
    }

    if (selectedSubType !== 'all' && prop.subType !== selectedSubType) {
      return false;
    }

    return true;
  });

  // Automatically select the first property and fly the map whenever active channel or subtype changes
  useEffect(() => {
    if (filteredProperties.length > 0) {
      const isCurrentInFiltered = filteredProperties.some(p => p.id === selectedProperty?.id);
      if (!isCurrentInFiltered) {
        setSelectedProperty(filteredProperties[0]);
      }
    }
  }, [activeChannel, selectedSubType, filteredProperties, selectedProperty?.id, setSelectedProperty]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-5">
        
        {/* Top Channel Sub-Header & SubType Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-[24px] border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider truncate">
                {activeChannel === 'land_plot' ? '🌱 Land, Plots & Farmhouse Parcels' : '🏢 Luxury Villas & Constructed Assets'}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                {filteredProperties.length} Verified
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {activeChannel === 'land_plot'
                ? 'Click any property below to view its surveyed boundary polygon on Google Maps Satellite.'
                : 'Tour luxury residences with verified construction stages and clear title deeds.'}
            </p>
          </div>

          {/* Subtype Filter Pills */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-stone-100 p-1 rounded-full border border-stone-200/70 text-xs">
              <button
                onClick={() => setSelectedSubType('all')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  selectedSubType === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>

              {activeChannel === 'land_plot' ? (
                <>
                  <button
                    onClick={() => setSelectedSubType('residential_plot')}
                    className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                      selectedSubType === 'residential_plot'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Residential Plots
                  </button>
                  <button
                    onClick={() => setSelectedSubType('farmhouse_land')}
                    className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                      selectedSubType === 'farmhouse_land'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Farmhouse Lands
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedSubType('luxury_villa')}
                  className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                    selectedSubType === 'luxury_villa'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Luxury Villas
                </button>
              )}
            </div>

            {/* Mobile View Switcher */}
            <div className="flex sm:hidden w-full bg-stone-100 p-1 rounded-full border border-stone-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSwitchMobileView('list')}
                className={`flex-1 py-2 rounded-full flex items-center justify-center gap-1.5 transition ${
                  mobileView === 'list'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>List ({filteredProperties.length})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMobileView('map')}
                className={`flex-1 py-2 rounded-full flex items-center justify-center gap-1.5 transition ${
                  mobileView === 'map'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MapIcon className="w-4 h-4 text-emerald-500" />
                <span>Map & 3D</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Properties Feed + Google Maps Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: Properties Feed (5 cols on desktop) */}
          <div
            className={`lg:col-span-5 space-y-3.5 min-w-0 ${
              mobileView === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-medium">
              <span>Showing {filteredProperties.length} Properties</span>
              <span className="text-[11px] text-stone-800 font-semibold">Click to View on Map</span>
            </div>

            <div className="space-y-4 max-h-[820px] overflow-y-auto pr-1">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={() => handleSwitchMobileView('map')}
                />
              ))}

              {filteredProperties.length === 0 && (
                <div className="p-10 text-center bg-white rounded-[24px] border border-stone-200 text-stone-500 space-y-2">
                  <p className="text-sm font-semibold text-stone-900">No properties found</p>
                  <p className="text-xs">Try selecting a different channel or clearing search terms.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Google Maps Satellite Engine & Plotted Venture Explorer (7 cols) */}
          <div
            className={`lg:col-span-7 space-y-5 min-w-0 ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Movable Google Maps Component */}
            <div className="w-full">
              <ErrorBoundary fallbackTitle="Satellite GIS Map">
                <GoogleMapGIS />
              </ErrorBoundary>
            </div>

            {/* Interactive Plotted Venture Masterplan Explorer */}
            {selectedProperty?.isVentureLayout && (
              <div className="w-full">
                <ErrorBoundary fallbackTitle="Plotted Venture Masterplan">
                  <VentureLayoutExplorer />
                </ErrorBoundary>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Mobile Floating Property Card when viewing Map */}
      {mobileView === 'map' && selectedProperty && (
        <aside aria-label="Selected Property Preview" className="fixed bottom-20 left-3 right-3 z-30 sm:hidden bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <img
            src={selectedProperty.images[0]}
            alt={selectedProperty.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedProperty.verification.approvalType}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">#{selectedProperty.verification.surveyNumber}</span>
            </div>
            <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">{selectedProperty.title}</h4>
            <div className="text-xs font-black text-stone-900" suppressHydrationWarning>
              {formatCurrency(selectedProperty.price)}
            </div>
          </div>
          <button
            onClick={() => setIsDetailModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs shrink-0 shadow-xs"
          >
            Specs
          </button>
        </aside>
      )}

      {/* Mobile Floating View Switcher Button (Bottom-Center) */}
      <aside aria-label="Mobile View Switcher" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 sm:hidden">
        <button
          onClick={() => handleSwitchMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="px-5 py-2.5 rounded-full bg-stone-900 text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 border border-stone-700/80 active:scale-95 transition-all"
        >
          {mobileView === 'list' ? (
            <>
              <MapIcon className="w-4 h-4 text-emerald-400" />
              <span>Explore on Map ({filteredProperties.length})</span>
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span>View Property List</span>
            </>
          )}
        </button>
      </aside>

      <PropertyDetailModal />
      <CreateDealModal />
      <AddPropertyModal />
      <KycModal />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="font-semibold text-stone-900">PlotTerra GIS Real Estate Platform</span>
            <span>· Anti-Circumvention Protection</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500 text-[11px]">
            <span>Google Maps Satellite Engine</span>
            <span>DTCP / RERA Verified</span>
            <span>Admin Concierge Escrow Model</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
