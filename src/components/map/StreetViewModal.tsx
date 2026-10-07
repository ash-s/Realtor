'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import {
  X,
  Compass,
  ExternalLink,
  Navigation,
  RotateCw,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function StreetViewModal() {
  const {
    isStreetViewOpen,
    setIsStreetViewOpen,
    selectedProperty,
    setIsDealModalOpen
  } = useApp();

  const [heading, setHeading] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const startHeadingRef = useRef<number>(0);

  // Auto rotation loop
  useEffect(() => {
    if (!isStreetViewOpen || !isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setHeading(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isStreetViewOpen, isAutoRotating, isDragging]);

  if (!isStreetViewOpen || !selectedProperty) return null;

  const lat = selectedProperty.location.lat;
  const lng = selectedProperty.location.lng;

  // Real Google Street View URL
  const googleStreetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // Compass cardinal direction
  const getCardinalDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) / 45)) % 8;
    return directions[index];
  };

  // Touch & Mouse drag handlers for 360 panning
  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    dragStartXRef.current = clientX;
    startHeadingRef.current = heading;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartXRef.current;
    const newHeading = (startHeadingRef.current - deltaX * 0.4 + 360) % 360;
    setHeading(newHeading);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-800 bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  360° Street View & Road Access
                </span>
                <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                  {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
                {selectedProperty.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsStreetViewOpen(false)}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition shrink-0"
            title="Close Street View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive 360 Viewport */}
        <div className="relative w-full h-72 sm:h-96 bg-stone-950 overflow-hidden cursor-grab active:cursor-grabbing">
          {/* Panoramic Background Scene */}
          <div
            className="absolute inset-0 transition-transform ease-out"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center'
            }}
            onMouseDown={e => handlePointerDown(e.clientX)}
            onMouseMove={e => handlePointerMove(e.clientX)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={e => handlePointerDown(e.touches[0].clientX)}
            onTouchMove={e => handlePointerMove(e.touches[0].clientX)}
            onTouchEnd={handlePointerUp}
          >
            {/* Seamless Panoramic Layer using Property Imagery & Spatial Sky */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${selectedProperty.images[0]}')`,
                backgroundPosition: `${(heading / 360) * 100}% center`,
                filter: 'brightness(0.92) contrast(1.05)'
              }}
            />

            {/* Simulated 360 Road Overlay & Perspective Horizon */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/40 pointer-events-none" />

            {/* Compass Heading Overlay Box in Panorama */}
            <div className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700 text-xs font-bold text-white shadow-lg flex items-center gap-2 pointer-events-none">
              <Compass
                className="w-4 h-4 text-emerald-400 transition-transform"
                style={{ transform: `rotate(${heading}deg)` }}
              />
              <span>
                Facing: <b className="text-emerald-400">{getCardinalDirection(heading)}</b> ({Math.round(heading)}°)
              </span>
            </div>

            {/* Roadway Details Badge in Panorama */}
            <div className="absolute top-4 right-4 bg-stone-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700 text-xs font-semibold text-stone-200 shadow-lg flex items-center gap-1.5 pointer-events-none">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>{selectedProperty.roadWidthFt}-ft Approach Road</span>
            </div>

            {/* Center Reticle / Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-8 h-8 border border-white/60 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </div>
            </div>

            {/* Floating Point-of-Interest Pin in 360 View */}
            <div
              className="absolute bottom-16 pointer-events-none flex flex-col items-center transition-all duration-75"
              style={{
                left: `${((((heading + 180) % 360) / 360) * 100)}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="bg-emerald-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-emerald-400/50 flex items-center gap-1 whitespace-nowrap">
                <MapPin className="w-3 h-3" />
                <span>Survey #{selectedProperty.verification.surveyNumber} Main Gate</span>
              </div>
              <div className="w-0.5 h-6 bg-emerald-400 shadow-sm" />
            </div>
          </div>

          {/* Floating Pan & Zoom Controls */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
            {/* Rotation Controls */}
            <div className="flex items-center gap-1 bg-stone-900/90 backdrop-blur-md p-1 rounded-full border border-stone-700 shadow-lg">
              <button
                onClick={() => setHeading(prev => (prev - 30 + 360) % 360)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition"
                title="Rotate Left"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`p-1.5 rounded-full transition ${
                  isAutoRotating ? 'bg-emerald-600 text-white' : 'hover:bg-stone-800 text-stone-300'
                }`}
                title={isAutoRotating ? 'Pause 360 Tour' : 'Auto 360 Tour'}
              >
                {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setHeading(prev => (prev + 30) % 360)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition"
                title="Rotate Right"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Hint message on drag */}
            <span className="hidden sm:inline text-[11px] text-stone-400 font-medium bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800">
              Drag or swipe horizontally to look around 360°
            </span>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-stone-900/90 backdrop-blur-md p-1 rounded-full border border-stone-700 shadow-lg">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.25, 2.5))}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.25, 1))}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Spatial Information & Actions Row */}
        <div className="p-4 sm:p-6 space-y-4 bg-stone-900 overflow-y-auto">
          
          {/* Key Ground Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Approach Road</span>
              <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">
                {selectedProperty.roadWidthFt} Feet Wide
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Blacktop Tar Road</span>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Frontage Facing</span>
              <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">
                {selectedProperty.facing}
              </span>
              <span className="text-[10px] text-blue-400 font-medium">Vaastu Compliant</span>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Survey Frontage</span>
              <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">
                {selectedProperty.edgeMeasurements?.[3]?.lengthFt || 200} ft Road Face
              </span>
              <span className="text-[10px] text-stone-400 font-medium">Peg D to Peg A</span>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Sanction Authority</span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-400 mt-0.5 block">
                {selectedProperty.verification.approvalType} Approved
              </span>
              <span className="text-[10px] text-stone-400 font-medium">TNRERA Registered</span>
            </div>
          </div>

          {/* Location & Directions Bar */}
          <div className="bg-stone-800/60 p-3.5 rounded-2xl border border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-stone-300">
                {selectedProperty.location.address}, {selectedProperty.location.city}, {selectedProperty.location.state} - {selectedProperty.location.pincode}
              </span>
            </div>
            <span className="font-extrabold text-sm text-white shrink-0">
              {formatCurrency(selectedProperty.price)}
            </span>
          </div>

          {/* Action Buttons: Google Maps Street View App Launch & Visit */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <a
              href={googleStreetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live Google Street View (360° Panorama)</span>
            </a>

            <a
              href={googleDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition border border-stone-700"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>GPS Driving Route</span>
            </a>

            <button
              onClick={() => {
                setIsStreetViewOpen(false);
                setIsDealModalOpen(true);
              }}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-900/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Site Visit</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
