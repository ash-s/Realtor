'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import VentureLayoutExplorer from '@/components/map/VentureLayoutExplorer';
import PropertyCard from '@/components/property/PropertyCard';
import CompactPropertyCard from '@/components/property/CompactPropertyCard';
import PropertyDetailModal from '@/components/property/PropertyDetailModal';
import StreetViewModal from '@/components/map/StreetViewModal';
import CreateDealModal from '@/components/deals/CreateDealModal';
import AddPropertyModal from '@/components/seller/AddPropertyModal';
import KycModal from '@/components/kyc/KycModal';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import {
  LayoutGrid,
  Map as MapIcon,
  Columns,
  Compass,
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelBottom,
  View
} from 'lucide-react';
import { formatCurrency, formatNumber, formatIndianNumber, formatCompactINR } from '@/lib/formatters';

const GoogleMapGIS = dynamic(() => import('@/components/map/GoogleMapGIS'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] rounded-[28px] bg-stone-100 border border-stone-200/80 flex flex-col items-center justify-center text-xs text-stone-500 font-medium space-y-2">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin"></div>
      <p>Loading Satellite GIS Engine (Tamil Nadu)...</p>
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
    setIsDetailModalOpen,
    setIsDealModalOpen,
    setIsStreetViewOpen
  } = useApp();

  // View state: 'full_map' (hero map with bottom/side cards), 'split' (side feed + map), 'grid' (traditional grid)
  const [viewMode, setViewMode] = useState<'full_map' | 'split' | 'grid'>('full_map');
  const [cardsPlacement, setCardsPlacement] = useState<'bottom' | 'side'>('bottom');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(true);
  const [activeCanvasTab, setActiveCanvasTab] = useState<'satellite' | 'masterplan'>('satellite');

  const bottomCarouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

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

  // Automatically select the first property if current selection is not in filtered list
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

  // Smoothly scroll active card into center in the bottom carousel without affecting window scroll
  useEffect(() => {
    if (selectedProperty && cardRefs.current[selectedProperty.id] && bottomCarouselRef.current) {
      const card = cardRefs.current[selectedProperty.id];
      const container = bottomCarouselRef.current;
      if (card) {
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const containerWidth = container.offsetWidth;
        const targetScrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedProperty?.id]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!bottomCarouselRef.current) return;
    const scrollAmount = 340;
    bottomCarouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Active mobile property index for clean, zero-truncation mobile card navigation
  const activeMobileProperty = selectedProperty || filteredProperties[0];
  const currentMobileIndex = Math.max(0, filteredProperties.findIndex(p => p.id === activeMobileProperty?.id));

  const goToPrevProperty = () => {
    if (filteredProperties.length === 0) return;
    const prevIdx = (currentMobileIndex - 1 + filteredProperties.length) % filteredProperties.length;
    setSelectedProperty({ ...filteredProperties[prevIdx] });
    setActiveCanvasTab('satellite');
  };

  const goToNextProperty = () => {
    if (filteredProperties.length === 0) return;
    const nextIdx = (currentMobileIndex + 1) % filteredProperties.length;
    setSelectedProperty({ ...filteredProperties[nextIdx] });
    setActiveCanvasTab('satellite');
  };

  const touchStartXRef = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX > 45) {
      goToPrevProperty();
    } else if (deltaX < -45) {
      goToNextProperty();
    }
  };

  return (
    <div className={`flex flex-col font-sans ${viewMode === 'full_map' ? 'h-screen w-screen overflow-hidden bg-stone-900 text-stone-900' : 'min-h-screen bg-[#FAFAF9] text-stone-900'}`}>
      <Navbar />

      {/* 
        VIEW MODE 1: PURE FULL-SCREEN EDGE-TO-EDGE GIS MAP (NO BOXED LAYOUT)
        The map canvas fills 100% width and 100% remaining viewport height.
        Floating glassmorphic controls and bottom micro-cards overlay directly on the map.
      */}
      {viewMode === 'full_map' ? (
        <main className="flex-1 w-full h-[calc(100dvh-4rem)] relative overflow-hidden bg-stone-900">
          
          {/* The GoogleMapGIS / Masterplan Canvas fills 100% Edge-to-Edge */}
          <div className="absolute inset-0 z-0">
            {activeCanvasTab === 'satellite' ? (
              <ErrorBoundary fallbackTitle="Satellite GIS Map">
                <GoogleMapGIS
                  showBottomDrawer={false}
                  onOpenMasterplan={() => setActiveCanvasTab('masterplan')}
                  onToggleSidebar={cardsPlacement === 'side' ? () => setIsSideDrawerOpen(!isSideDrawerOpen) : undefined}
                  isSidebarOpen={isSideDrawerOpen}
                  headerCenterContent={
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-xl p-0.5 sm:p-1 rounded-full border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-xs">
                      {/* Subtype Filter Pills */}
                      <button
                        onClick={() => setSelectedSubType('all')}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold text-[9.5px] sm:text-xs transition ${
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
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold text-[9.5px] sm:text-xs transition whitespace-nowrap ${
                              selectedSubType === 'residential_plot'
                                ? 'bg-stone-900 text-white shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            Plots
                          </button>
                          <button
                            onClick={() => setSelectedSubType('farmhouse_land')}
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold text-[9.5px] sm:text-xs transition whitespace-nowrap ${
                              selectedSubType === 'farmhouse_land'
                                ? 'bg-stone-900 text-white shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            Farmhouse
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedSubType('luxury_villa')}
                          className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold text-[9.5px] sm:text-xs transition whitespace-nowrap ${
                            selectedSubType === 'luxury_villa'
                              ? 'bg-stone-900 text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Villas
                        </button>
                      )}

                      {/* Divider */}
                      <div className="h-3 w-px bg-stone-200 mx-0.5" />

                      {/* View Switcher: Split & Grid */}
                      <button
                        onClick={() => setViewMode('split')}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-stone-600 hover:text-stone-900 font-semibold text-[9.5px] sm:text-xs flex items-center gap-1 transition"
                        title="Switch to Split View"
                      >
                        <Columns className="w-3 h-3 text-blue-500" />
                        <span className="hidden sm:inline">Split</span>
                      </button>

                      <button
                        onClick={() => setViewMode('grid')}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-stone-600 hover:text-stone-900 font-semibold text-[9.5px] sm:text-xs flex items-center gap-1 transition"
                        title="Switch to Grid View"
                      >
                        <LayoutGrid className="w-3 h-3 text-amber-500" />
                        <span className="hidden sm:inline">Grid</span>
                      </button>
                    </div>
                  }
                />
              </ErrorBoundary>
            ) : (
              <ErrorBoundary fallbackTitle="Plotted Venture Masterplan">
                <VentureLayoutExplorer onBackToMap={() => setActiveCanvasTab('satellite')} />
              </ErrorBoundary>
            )}
          </div>

          {/* 
            OPTION A: FLOATING SIDE CARDS STACK
            Visible when cardsPlacement === 'side'
          */}
          {cardsPlacement === 'side' && isSideDrawerOpen && (
            <div className="absolute left-3 top-16 bottom-3 z-20 w-80 sm:w-96 flex flex-col bg-white/90 backdrop-blur-2xl rounded-2xl border border-stone-200/90 shadow-2xl p-3 pointer-events-auto overflow-hidden animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-stone-900">Tamil Nadu Properties</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {filteredProperties.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsSideDrawerOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {filteredProperties.map(prop => (
                  <CompactPropertyCard
                    key={prop.id}
                    property={prop}
                    isSelected={selectedProperty?.id === prop.id}
                    onSelect={() => {
                      setSelectedProperty({ ...prop });
                      setActiveCanvasTab('satellite');
                    }}
                    onOpenMasterplan={() => {
                      setSelectedProperty({ ...prop });
                      setActiveCanvasTab('masterplan');
                    }}
                    onOpenDetails={() => {
                      setSelectedProperty({ ...prop });
                      setIsDetailModalOpen(true);
                    }}
                    onOpenVisit={() => {
                      setSelectedProperty({ ...prop });
                      setIsDealModalOpen(true);
                    }}
                    isSideView={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 
            OPTION B: FLOATING BOTTOM SMALL CARDS TRAY / CAROUSEL (DEFAULT)
            Positioned along the bottom with horizontal scrolling and touch swiping.
            Touching any card immediately updates selectedProperty and flies the map to its surveyed boundary!
          */}
          {cardsPlacement === 'bottom' && (
            <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-4 right-2 sm:right-4 z-20 pointer-events-none">
              
              {/* MOBILE VIEW: Dedicated Full-Width Native App Bottom Card (< 768px) */}
              <div className="block sm:hidden pointer-events-auto">
                {activeMobileProperty && (
                  <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="bg-white/95 backdrop-blur-2xl rounded-2xl border border-stone-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.2)] p-3 text-left transition-all"
                  >
                    {/* Top Row: Prev / Counter / Next + Approval Badge */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={goToPrevProperty}
                          className="p-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95 transition"
                          title="Previous Property"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-black text-stone-800 font-mono">
                          {currentMobileIndex + 1} / {filteredProperties.length}
                        </span>
                        <button
                          onClick={goToNextProperty}
                          className="p-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95 transition"
                          title="Next Property"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9.5px] text-stone-400 pl-1 font-medium">Swipe card ↔</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {activeMobileProperty.verification.approvalType}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          #{activeMobileProperty.verification.surveyNumber.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Large Clear Thumbnail + Title + Specs + Price */}
                    <div 
                      onClick={() => {
                        setSelectedProperty({ ...activeMobileProperty });
                        setIsDetailModalOpen(true);
                      }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-xs">
                        <img
                          src={activeMobileProperty.images[0]}
                          alt={activeMobileProperty.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-blue-600 text-white text-[7px] font-black uppercase tracking-wider flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                          <span>GPS</span>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-stone-900 truncate leading-snug">
                          {activeMobileProperty.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{activeMobileProperty.location.city.split('(')[0].trim()}</span>
                          <span>·</span>
                          <span suppressHydrationWarning>{formatNumber(activeMobileProperty.totalSqft)} sqft</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-stone-900" suppressHydrationWarning>
                            {formatCompactINR(activeMobileProperty.price)}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            (₹{Math.round(activeMobileProperty.pricePerSqft).toLocaleString('en-IN')}/sqft)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons Row */}
                    <div className="flex items-center gap-1.5 pt-2.5 mt-2 border-t border-stone-100">
                      {/* 360° Street View Button */}
                      <button
                        onClick={() => {
                          setSelectedProperty({ ...activeMobileProperty });
                          setIsStreetViewOpen(true);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition shadow-xs active:scale-95"
                      >
                        <View className="w-3.5 h-3.5" />
                        <span>360° Street</span>
                      </button>

                      {/* Frame Boundaries Button */}
                      <button
                        onClick={() => {
                          setSelectedProperty({ ...activeMobileProperty });
                          setActiveCanvasTab('satellite');
                        }}
                        className="py-1.5 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] flex items-center justify-center gap-1 transition"
                        title="Frame Survey Boundary with Pegs A-B-C-D"
                      >
                        <Compass className="w-3.5 h-3.5 text-blue-500" />
                        <span>Boundaries</span>
                      </button>

                      {/* Full Specs Button */}
                      <button
                        onClick={() => {
                          setSelectedProperty({ ...activeMobileProperty });
                          setIsDetailModalOpen(true);
                        }}
                        className="py-1.5 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] transition"
                        title="Full Specifications"
                      >
                        Specs
                      </button>

                      {/* Book Visit Button */}
                      <button
                        onClick={() => {
                          setSelectedProperty({ ...activeMobileProperty });
                          setIsDealModalOpen(true);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition active:scale-95"
                      >
                        <span>Visit</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* DESKTOP VIEW: Multi-Card Horizontal Scrollable Dock (>= 768px) */}
              <div className="hidden sm:block">
                {/* Carousel Top Hint & Controls */}
                <div className="flex items-center justify-between mb-1 px-1 sm:px-2 pointer-events-auto">
                  <div className="bg-stone-900/85 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold shadow-md flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-blue-400 shrink-0" />
                    <span>
                      {selectedProperty ? (
                        <>Active: <b className="text-emerald-400">{selectedProperty.location.city.split('(')[0].trim()}</b> · <span className="font-mono text-stone-300">#{selectedProperty.verification.surveyNumber.split(' ')[0]}</span> ({formatCompactINR(selectedProperty.price)})</>
                      ) : (
                        <>Touch any card to frame surveyed boundary ({filteredProperties.length} in TN)</>
                      )}
                    </span>
                  </div>

                  {/* Left / Right Carousel Scroll Buttons */}
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-0.5 rounded-full border border-stone-200/90 shadow-md">
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="p-1 rounded-full hover:bg-stone-100 text-stone-600 transition"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="p-1 rounded-full hover:bg-stone-100 text-stone-600 transition"
                      title="Scroll Right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrollable Compact Cards Dock */}
                <div
                  ref={bottomCarouselRef}
                  className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5 pt-0.5 px-0.5 pr-6 pointer-events-auto scrollbar-none snap-x snap-mandatory"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {filteredProperties.map(prop => (
                    <div
                      key={prop.id}
                      ref={el => {
                        cardRefs.current[prop.id] = el;
                      }}
                      className="snap-center"
                    >
                      <CompactPropertyCard
                        property={prop}
                        isSelected={selectedProperty?.id === prop.id}
                        onSelect={() => {
                          setSelectedProperty({ ...prop });
                          setActiveCanvasTab('satellite');
                        }}
                        onOpenMasterplan={() => {
                          setSelectedProperty({ ...prop });
                          setActiveCanvasTab('masterplan');
                        }}
                        onOpenDetails={() => {
                          setSelectedProperty({ ...prop });
                          setIsDetailModalOpen(true);
                        }}
                        onOpenVisit={() => {
                          setSelectedProperty({ ...prop });
                          setIsDealModalOpen(true);
                        }}
                        onOpenStreetView={() => {
                          setSelectedProperty({ ...prop });
                          setIsStreetViewOpen(true);
                        }}
                        isSideView={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      ) : (
        <main className="flex-1 max-w-[1520px] w-full mx-auto p-2 sm:p-4 lg:p-6 space-y-3.5 overflow-hidden flex flex-col">
          
          {/* Top Control Bar for Split & Grid Modes */}
          <div className="bg-white p-3 sm:p-3.5 rounded-[24px] border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3 overflow-hidden">
            
            {/* Channel Label & Count */}
            <div className="flex items-center justify-between gap-2 min-w-0 w-full md:w-auto">
              <span className="text-xs font-black text-stone-900 uppercase tracking-wider truncate">
                {activeChannel === 'land_plot' ? '🌱 Tamil Nadu Lands & Plots' : '🏢 Tamil Nadu Luxury Villas'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                <span className="sm:hidden">{filteredProperties.length} in TN</span>
                <span className="hidden sm:inline">{filteredProperties.length} Properties in TN</span>
              </span>
            </div>

            {/* Subtype Filter Pills + View Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full min-w-0 md:w-auto scrollbar-none pr-2">
              
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

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200/70 text-xs">
                <button
                  onClick={() => setViewMode('full_map')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition text-stone-600 hover:text-stone-900"
                  title="Full Map Hero with Floating Property Cards"
                >
                  <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Full Map</span>
                </button>

                <button
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition ${
                    viewMode === 'split'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Side-by-side Feed + Map"
                >
                  <Columns className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Split</span>
                </button>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition ${
                    viewMode === 'grid'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Property Grid Gallery"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>

            </div>
          </div>

        {/* 
          VIEW MODE 2: SPLIT VIEW (Standard Side Feed + Full Map)
        */}
        {viewMode === 'split' && (
          <div className="flex flex-col lg:flex-row gap-5 items-stretch h-auto lg:h-[740px]">
            
            {/* Left Feed */}
            <aside
              aria-label="Properties Directory"
              className="lg:w-[420px] xl:w-[460px] flex flex-col shrink-0"
            >
              <div className="bg-white border border-stone-200/80 rounded-[28px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full space-y-3">
                
                {/* Search Bar */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Filter Tamil Nadu properties..."
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

                {/* Vertical Stack */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                  {filteredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={() => {
                        setSelectedProperty(property);
                        setActiveCanvasTab('satellite');
                      }}
                      onSelectMasterplan={() => {
                        setSelectedProperty(property);
                        setActiveCanvasTab('masterplan');
                      }}
                    />
                  ))}
                </div>

              </div>
            </aside>

            {/* Right Map Canvas */}
            <section
              aria-label="Satellite GIS and Masterplan"
              className="flex-1 relative flex flex-col min-w-0 h-[520px] lg:h-full rounded-[28px] overflow-hidden border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              {activeCanvasTab === 'satellite' ? (
                <ErrorBoundary fallbackTitle="Satellite GIS Map">
                  <GoogleMapGIS
                    showBottomDrawer={true}
                    onOpenMasterplan={() => setActiveCanvasTab('masterplan')}
                  />
                </ErrorBoundary>
              ) : (
                <ErrorBoundary fallbackTitle="Plotted Venture Masterplan">
                  <VentureLayoutExplorer onBackToMap={() => setActiveCanvasTab('satellite')} />
                </ErrorBoundary>
              )}
            </section>

          </div>
        )}

        {/* 
          VIEW MODE 3: GRID VIEW (Traditional Gallery)
        */}
        {viewMode === 'grid' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-extrabold text-stone-900">
                Tamil Nadu Verified Real Estate Portfolio ({filteredProperties.length})
              </h3>
              <button
                onClick={() => setViewMode('full_map')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All on Satellite Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProperties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={() => {
                    setSelectedProperty(prop);
                    setViewMode('full_map');
                    setActiveCanvasTab('satellite');
                  }}
                  onSelectMasterplan={() => {
                    setSelectedProperty(prop);
                    setViewMode('full_map');
                    setActiveCanvasTab('masterplan');
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </main>
      )}

      <PropertyDetailModal />
      <StreetViewModal />
      <CreateDealModal />
      <AddPropertyModal />
      <KycModal />

      {/* Footer with Tamil Nadu Real Estate & Escrow Badges (only in Split & Grid views) */}
      {viewMode !== 'full_map' && (
        <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 mt-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="font-semibold text-stone-900">PlotTerra GIS Real Estate</span>
              <span>· Tamil Nadu Verified Lands & Villas</span>
            </div>
            <div className="flex items-center gap-4 text-stone-500 text-[11px]">
              <span>DTCP & CMDA Sanctioned</span>
              <span>TNRERA Registered</span>
              <span>All Prices in INR (₹)</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
