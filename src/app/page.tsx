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
  Columns,
  Maximize2,
  Minimize2,
  Compass,
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
  ChevronRight,
  Layers
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const GoogleMapGIS = dynamic(() => import('@/components/map/GoogleMapGIS'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] rounded-[28px] bg-stone-100 border border-stone-200/80 flex flex-col items-center justify-center text-xs text-stone-500 font-medium space-y-2">
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
    setSearchQuery,
    selectedSubType,
    setSelectedSubType,
    setIsDetailModalOpen
  } = useApp();

  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [desktopViewMode, setDesktopViewMode] = useState<'split' | 'map_hero'>('split');
  const [activeCanvasTab, setActiveCanvasTab] = useState<'satellite' | 'masterplan'>('satellite');

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

  // Automatically select the first property whenever active channel or subtype changes
  useEffect(() => {
    if (filteredProperties.length > 0) {
      const isCurrentInFiltered = filteredProperties.some(p => p.id === selectedProperty?.id);
      if (!isCurrentInFiltered) {
        setSelectedProperty(filteredProperties[0]);
      }
    }
  }, [activeChannel, selectedSubType, filteredProperties, selectedProperty?.id, setSelectedProperty]);

  // When selectedProperty changes and doesn't have a venture layout, reset activeCanvasTab to satellite
  useEffect(() => {
    if (!selectedProperty?.isVentureLayout && activeCanvasTab === 'masterplan') {
      setActiveCanvasTab('satellite');
    }
  }, [selectedProperty?.id, selectedProperty?.isVentureLayout, activeCanvasTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-4">
        
        {/* Top Channel Sub-Header & SubType Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-[24px] border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Channel Label & Count */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-black text-stone-900 uppercase tracking-wider truncate">
              {activeChannel === 'land_plot' ? '🌱 Land, Plots & Farmhouse Parcels' : '🏢 Luxury Villas & Constructed Assets'}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
              {filteredProperties.length} Verified
            </span>
          </div>

          {/* Subtype Filter Pills + Desktop View Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200/70 text-xs">
              <button
                onClick={() => setSelectedSubType('all')}
                className={`px-3 py-1 rounded-full font-semibold transition ${
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
                    className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
                      selectedSubType === 'residential_plot'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Residential Plots
                  </button>
                  <button
                    onClick={() => setSelectedSubType('farmhouse_land')}
                    className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
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
                  className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
                    selectedSubType === 'luxury_villa'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Luxury Villas
                </button>
              )}
            </div>

            {/* Desktop View Switcher Pills (Split vs Full Map Hero) */}
            <div className="hidden lg:flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200/70 text-xs">
              <button
                onClick={() => setDesktopViewMode('split')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition ${
                  desktopViewMode === 'split'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Split View: Property Feed + Map"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>

              <button
                onClick={() => setDesktopViewMode('map_hero')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition ${
                  desktopViewMode === 'map_hero'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Full-Bleed Map Hero View"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Full Map</span>
              </button>
            </div>

          </div>
        </div>

        {/* 
          EXPANSIVE UNIFIED MAIN VIEWPORT
          Desktop: Fixed symmetrical height (h-[720px]) preventing any awkward dual-scrolling or layout mismatch
          Mobile: Fluid responsive layout with switcher
        */}
        <div className="relative w-full">
          
          <div className="flex flex-col lg:flex-row gap-5 items-stretch h-auto lg:h-[720px]">
            
            {/* 
              LEFT PANEL: Curated Property Feed
              Hidden in desktop map_hero mode or mobile map mode
            */}
            <aside
              aria-label="Properties Directory"
              className={`transition-all duration-300 flex flex-col shrink-0 ${
                desktopViewMode === 'split'
                  ? 'lg:w-[420px] xl:w-[460px] block'
                  : 'hidden'
              } ${mobileView === 'map' ? 'hidden lg:flex' : 'flex'}`}
            >
              <div className="bg-white border border-stone-200/80 rounded-[28px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full space-y-3">
                
                {/* Search & Feed Counter Bar */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Filter survey no, area, title..."
                      className="w-full bg-stone-50 border border-stone-200/80 rounded-full pl-8 pr-7 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1 text-stone-400 hover:text-stone-700 absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap px-1">
                    {filteredProperties.length} Properties
                  </span>
                </div>

                {/* Scrollable Property Cards Stack */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                  {filteredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={() => {
                        handleSwitchMobileView('map');
                        setActiveCanvasTab('satellite');
                      }}
                      onSelectMasterplan={() => {
                        handleSwitchMobileView('map');
                        setActiveCanvasTab('masterplan');
                      }}
                    />
                  ))}

                  {filteredProperties.length === 0 && (
                    <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 space-y-2 my-auto">
                      <p className="text-xs font-bold text-stone-800">No properties found</p>
                      <p className="text-[11px]">Try clearing search filters or switching channels above.</p>
                    </div>
                  )}
                </div>

              </div>
            </aside>

            {/* 
              RIGHT CANVAS: Expansive Satellite GIS & Integrated Masterplan
              In split mode: fills the remaining width.
              In map_hero mode: spans 100% full width hero canvas.
            */}
            <section
              aria-label="Interactive GIS Satellite and Masterplan Canvas"
              className={`flex-1 relative flex flex-col min-w-0 transition-all duration-300 h-[500px] sm:h-[600px] lg:h-full ${
                mobileView === 'list' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              
              {/* Plotted Venture Layout Masterplan Tab Pill (Only shown when active property is a plotted township) */}
              {selectedProperty?.isVentureLayout && (
                <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto bg-white/95 backdrop-blur-xl p-1 rounded-full border border-stone-200/90 shadow-[0_6px_24px_rgba(0,0,0,0.12)] flex items-center gap-1 text-xs font-bold">
                  <button
                    onClick={() => setActiveCanvasTab('satellite')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                      activeCanvasTab === 'satellite'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    <span>Satellite GIS</span>
                  </button>

                  <button
                    onClick={() => setActiveCanvasTab('masterplan')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                      activeCanvasTab === 'masterplan'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Masterplan (16 Plots)</span>
                  </button>
                </div>
              )}

              {/* Floating Reveal Button when in Map Hero View on Desktop */}
              {desktopViewMode === 'map_hero' && (
                <div className="absolute top-3 left-3 z-20 hidden lg:block pointer-events-auto">
                  <button
                    onClick={() => setDesktopViewMode('split')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.12)] text-xs font-bold text-stone-900 hover:bg-stone-50 transition"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>Show Property Feed ({filteredProperties.length})</span>
                  </button>
                </div>
              )}

              {/* Dynamic Canvas Container: GoogleMapGIS or VentureLayoutExplorer */}
              <div className="w-full h-full rounded-[28px] overflow-hidden">
                {activeCanvasTab === 'satellite' ? (
                  <ErrorBoundary fallbackTitle="Satellite GIS Map">
                    <GoogleMapGIS
                      showBottomDrawer={desktopViewMode === 'map_hero' || mobileView === 'map'}
                      onToggleSidebar={() => setDesktopViewMode(desktopViewMode === 'split' ? 'map_hero' : 'split')}
                      isSidebarOpen={desktopViewMode === 'split'}
                    />
                  </ErrorBoundary>
                ) : (
                  <ErrorBoundary fallbackTitle="Plotted Venture Masterplan">
                    <VentureLayoutExplorer onBackToMap={() => setActiveCanvasTab('satellite')} />
                  </ErrorBoundary>
                )}
              </div>

            </section>

          </div>

        </div>

      </main>

      {/* Mobile Floating Bottom View Switcher Capsule (List <-> Map) */}
      <aside aria-label="Mobile View Switcher" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 lg:hidden">
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
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 mt-10">
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
