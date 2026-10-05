'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '@/lib/store';
import {
  Maximize2,
  Minimize2,
  Pencil,
  RotateCcw,
  Navigation,
  Search,
  ZoomIn,
  ZoomOut,
  X,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Property } from '@/types';
import { formatCurrency, formatNumber, formatCompactINR } from '@/lib/formatters';

type MapLayerType = 'hybrid' | 'satellite' | 'roadmap';

interface GoogleMapGISProps {
  showBottomDrawer?: boolean;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenMasterplan?: () => void;
}

export default function GoogleMapGIS({
  showBottomDrawer = false,
  onToggleSidebar,
  isSidebarOpen = true,
  onOpenMasterplan
}: GoogleMapGISProps) {
  const {
    properties,
    selectedProperty,
    setSelectedProperty,
    setIsDetailModalOpen,
    setIsDealModalOpen
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const activeTileLayerRef = useRef<any>(null);
  const polygonLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const drawingLayerRef = useRef<any>(null);
  const isInitializingRef = useRef<boolean>(false);
  const isInvalidatingRef = useRef<boolean>(false);

  const [mapType, setMapType] = useState<MapLayerType>('hybrid');
  const [zoomLevel, setZoomLevel] = useState<number>(17);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [calculatedAreaSqft, setCalculatedAreaSqft] = useState<number>(0);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const initialCenterRef = useRef<[number, number]>([
    selectedProperty?.location.lat || 12.8420,
    selectedProperty?.location.lng || 80.0650
  ]);

  const getMapTileUrl = (type: MapLayerType) => {
    switch (type) {
      case 'satellite':
      case 'hybrid':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'roadmap':
      default:
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
  };

  // Safe guarded map invalidateSize to prevent infinite loops
  const safeInvalidateSize = useCallback(() => {
    if (isInvalidatingRef.current) return;
    if (!mapInstanceRef.current || !mapContainerRef.current) return;
    if (mapContainerRef.current.offsetWidth === 0 || mapContainerRef.current.offsetHeight === 0) return;

    isInvalidatingRef.current = true;
    try {
      mapInstanceRef.current.invalidateSize({ pan: false });
    } catch (err) {
      console.warn('safeInvalidateSize warning:', err);
    } finally {
      setTimeout(() => {
        isInvalidatingRef.current = false;
      }, 150);
    }
  }, []);

  // 1. Initialize Leaflet Map safely (created once on mount)
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current || isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        const L = await import('leaflet');
        if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) {
          isInitializingRef.current = false;
          return;
        }

        // Clean up any stale leaflet ID to prevent "Map container is already initialized" crash
        if ((mapContainerRef.current as any)._leaflet_id) {
          try {
            delete (mapContainerRef.current as any)._leaflet_id;
          } catch {}
        }

        const map = L.map(mapContainerRef.current, {
          center: initialCenterRef.current,
          zoom: zoomLevel,
          zoomControl: false,
          attributionControl: false,
          dragging: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true
        });

        mapInstanceRef.current = map;

        const tileUrl = getMapTileUrl(mapType);
        const isSatellite = mapType === 'satellite' || mapType === 'hybrid';
        const tileLayer = L.tileLayer(tileUrl, {
          subdomains: isSatellite ? [] : ['a', 'b', 'c', 'd'],
          maxZoom: 19,
          maxNativeZoom: 18,
          attribution: isSatellite ? '© Esri Satellite' : '© CARTO'
        }).addTo(map);

        activeTileLayerRef.current = tileLayer;
        polygonLayerRef.current = L.layerGroup().addTo(map);
        markersGroupRef.current = L.layerGroup().addTo(map);
        drawingLayerRef.current = L.layerGroup().addTo(map);

        map.on('zoomend', () => {
          if (isMounted) setZoomLevel(map.getZoom());
        });

        map.on('click', (e: any) => {
          if (!isMounted || !isDrawingMode) return;
          setDrawnPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
        });

        setTimeout(() => {
          if (isMounted) safeInvalidateSize();
        }, 120);

        if (isMounted) setIsMapReady(true);
      } catch (err) {
        console.error('Failed to initialize Leaflet Map:', err);
      } finally {
        isInitializingRef.current = false;
      }
    };

    initMap();

    const handleResize = () => {
      safeInvalidateSize();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch (err) {
          console.warn('Map cleanup error:', err);
        }
        mapInstanceRef.current = null;
      }

      if (mapContainerRef.current) {
        try {
          delete (mapContainerRef.current as any)._leaflet_id;
        } catch {}
      }
    };
  }, [safeInvalidateSize]);

  // 2. Change Tile Layer
  const changeMapType = async (newType: MapLayerType) => {
    setMapType(newType);
    if (!mapInstanceRef.current) return;
    try {
      const L = await import('leaflet');
      if (activeTileLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(activeTileLayerRef.current);
      }
      const tileUrl = getMapTileUrl(newType);
      const isSatellite = newType === 'satellite' || newType === 'hybrid';
      const newTileLayer = L.tileLayer(tileUrl, {
        subdomains: isSatellite ? [] : ['a', 'b', 'c', 'd'],
        maxZoom: 19,
        maxNativeZoom: 18,
        attribution: isSatellite ? '© Esri Satellite' : '© CARTO'
      }).addTo(mapInstanceRef.current);
      activeTileLayerRef.current = newTileLayer;
    } catch (err) {
      console.warn('Error changing tile layer:', err);
    }
  };

  // 3. Auto-Fly and Frame Property Boundary whenever selectedProperty changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedProperty) return;
    try {
      safeInvalidateSize();
      const boundary = selectedProperty.boundary;
      if (boundary && boundary.length >= 3) {
        import('leaflet').then(L => {
          if (!mapInstanceRef.current) return;
          const latLngs: [number, number][] = boundary.map(p => [p.lat, p.lng]);
          const bounds = L.latLngBounds(latLngs);
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          mapInstanceRef.current.fitBounds(bounds, {
            paddingTopLeft: [isMobile ? 12 : 35, isMobile ? 50 : 55],
            paddingBottomRight: [isMobile ? 12 : 35, isMobile ? 105 : 95],
            maxZoom: 18,
            animate: true,
            duration: 0.8
          });
        });
      } else {
        mapInstanceRef.current.flyTo(
          [selectedProperty.location.lat, selectedProperty.location.lng],
          17,
          { duration: 0.8 }
        );
      }
    } catch (err) {
      console.warn('flyTo/fitBounds error:', err);
    }
  }, [selectedProperty, isMapReady, safeInvalidateSize]);

  // 4. Render High-Contrast Survey Cadastral Boundary with Corner Pegs & Distance Markers
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !polygonLayerRef.current) return;

    let isMounted = true;
    const renderSelectedBoundary = async () => {
      try {
        const L = await import('leaflet');
        if (!isMounted || !polygonLayerRef.current) return;
        polygonLayerRef.current.clearLayers();

        if (!selectedProperty) return;
        const boundary = selectedProperty.boundary;
        if (!boundary || boundary.length < 3) return;

        const latLngs: [number, number][] = boundary.map(p => [p.lat, p.lng]);

        // 1. Outer Neon Cyan Glow (High visibility against dark satellite imagery)
        L.polygon(latLngs, {
          color: '#38bdf8',
          weight: 6,
          opacity: 0.55,
          fillColor: '#3b82f6',
          fillOpacity: 0.22
        }).addTo(polygonLayerRef.current);

        // 2. Core Solid Royal Blue Line
        L.polygon(latLngs, {
          color: '#1d4ed8',
          weight: 3.5,
          opacity: 1,
          fillColor: 'transparent'
        }).addTo(polygonLayerRef.current);

        // 3. Inner White Survey Dashed Line
        L.polygon(latLngs, {
          color: '#ffffff',
          weight: 1.5,
          opacity: 0.9,
          fillColor: 'transparent',
          dashArray: '5, 5'
        }).addTo(polygonLayerRef.current);

        // 4. Corner Vertex Pegs (Points A, B, C, D...)
        boundary.forEach((pt, idx) => {
          const pegLetter = String.fromCharCode(65 + idx);
          const pegIcon = L.divIcon({
            className: 'survey-peg',
            html: `
              <div style="
                transform:translate(-50%, -50%);
                width:20px;
                height:20px;
                border-radius:50%;
                background:#1d4ed8;
                color:#ffffff;
                font-size:10px;
                font-weight:900;
                font-family:ui-sans-serif, system-ui, sans-serif;
                border:2px solid #ffffff;
                box-shadow:0 3px 8px rgba(0,0,0,0.45);
                display:flex;
                align-items:center;
                justify-content:center;
                cursor:default;
              ">
                ${pegLetter}
              </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          });
          const pegMarker = L.marker([pt.lat, pt.lng], { icon: pegIcon });
          pegMarker.bindTooltip(`<b>Cadastral Peg ${pegLetter}</b><br/><span style="font-family:monospace;font-size:10px;">${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}</span>`, {
            direction: 'top',
            offset: [0, -12],
            className: 'survey-peg-tooltip'
          });
          pegMarker.addTo(polygonLayerRef.current);
        });

        // 5. Edge Measurement Badges (Surveyed Feet & Road Indicators)
        if (selectedProperty.edgeMeasurements && selectedProperty.edgeMeasurements.length > 0) {
          selectedProperty.edgeMeasurements.forEach((edge, idx) => {
            const p1 = boundary[idx];
            const p2 = boundary[(idx + 1) % boundary.length];
            if (p1 && p2) {
              const midLat = (p1.lat + p2.lat) / 2;
              const midLng = (p1.lng + p2.lng) / 2;

              const edgeIcon = L.divIcon({
                className: 'survey-edge-badge',
                html: `
                  <div style="transform:translate(-50%, -50%); white-space:nowrap; pointer-events:none;">
                    <span style="
                      background:rgba(15, 23, 42, 0.92);
                      backdrop-filter:blur(6px);
                      color:#ffffff;
                      font-size:9px;
                      font-weight:800;
                      font-family:ui-sans-serif, system-ui, sans-serif;
                      padding:2px 6px;
                      border-radius:9999px;
                      border:1.5px solid ${edge.isRoadFacing ? '#38bdf8' : 'rgba(255,255,255,0.7)'};
                      box-shadow:0 3px 10px rgba(0,0,0,0.3);
                      display:inline-flex;
                      align-items:center;
                      gap:3px;
                    ">
                      ${edge.isRoadFacing ? '🛣️ ' : ''}${edge.lengthFt} ft
                    </span>
                  </div>
                `,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
              });
              L.marker([midLat, midLng], { icon: edgeIcon }).addTo(polygonLayerRef.current);
            }
          });
        }
      } catch (err) {
        console.warn('renderSelectedBoundary error:', err);
      }
    };

    renderSelectedBoundary();
    return () => {
      isMounted = false;
    };
  }, [isMapReady, selectedProperty]);

  // 5. Render Minimalist Luxury Price-Tag Pins (Inspired by Airbnb / Compass Luxury)
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !markersGroupRef.current) return;

    let isMounted = true;
    const renderAllPins = async () => {
      try {
        const L = await import('leaflet');
        if (!isMounted || !markersGroupRef.current) return;
        markersGroupRef.current.clearLayers();

        properties.forEach(prop => {
          const isSelected = selectedProperty?.id === prop.id;
          const formattedPrice = formatCompactINR(prop.price);

          const pinIcon = L.divIcon({
            className: 'luxury-price-pin',
            html: `
              <div style="display:inline-flex; transform:translate(-50%, -50%); cursor:pointer; pointer-events:auto;">
                <div style="
                  background:${isSelected ? '#0f172a' : 'rgba(255, 255, 255, 0.96)'};
                  backdrop-filter:blur(10px);
                  color:${isSelected ? '#ffffff' : '#0f172a'};
                  padding:${isSelected ? '6px 14px' : '5px 12px'};
                  font-size:${isSelected ? '12px' : '11px'};
                  font-weight:800;
                  font-family:ui-sans-serif, system-ui, -apple-system, sans-serif;
                  border-radius:9999px;
                  box-shadow:${isSelected ? '0 10px 28px rgba(0,0,0,0.32)' : '0 4px 18px rgba(0,0,0,0.12)'};
                  border:${isSelected ? '2px solid #3b82f6' : '1.5px solid rgba(226, 232, 240, 0.95)'};
                  display:flex;
                  align-items:center;
                  gap:6px;
                  white-space:nowrap;
                  transform:${isSelected ? 'scale(1.08)' : 'scale(1)'};
                  transition:all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                ">
                  <span style="width:7px; height:7px; border-radius:50%; background:${isSelected ? '#38bdf8' : '#10b981'}; display:inline-block; flex-shrink:0;"></span>
                  <span>${formattedPrice}</span>
                </div>
              </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          });

          const marker = L.marker([prop.location.lat, prop.location.lng], { icon: pinIcon });
          marker.on('click', () => {
            setSelectedProperty(prop);
          });

          marker.addTo(markersGroupRef.current);
        });
      } catch (err) {
        console.warn('renderAllPins error:', err);
      }
    };

    renderAllPins();
    return () => {
      isMounted = false;
    };
  }, [isMapReady, properties, selectedProperty, setSelectedProperty]);

  // 6. Drawing Mode
  useEffect(() => {
    if (!isMapReady || !drawingLayerRef.current) return;

    let isMounted = true;
    const updateDrawing = async () => {
      try {
        const L = await import('leaflet');
        if (!isMounted || !drawingLayerRef.current) return;
        drawingLayerRef.current.clearLayers();

        if (drawnPoints.length === 0) {
          setCalculatedAreaSqft(0);
          return;
        }

        drawnPoints.forEach(pt => {
          const vertexIcon = L.divIcon({
            className: 'drawing-vertex',
            html: `<div style="width:12px; height:12px; background:#0f172a; border:2px solid #ffffff; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });
          L.marker(pt, { icon: vertexIcon }).addTo(drawingLayerRef.current);
        });

        if (drawnPoints.length === 2) {
          L.polyline(drawnPoints, { color: '#0f172a', weight: 2.5, dashArray: '4,4' }).addTo(drawingLayerRef.current);
        } else if (drawnPoints.length >= 3) {
          L.polygon(drawnPoints, {
            color: '#2563eb',
            weight: 2.5,
            fillColor: '#3b82f6',
            fillOpacity: 0.25
          }).addTo(drawingLayerRef.current);

          const avgLatRad = (drawnPoints.reduce((acc, p) => acc + p[0], 0) / drawnPoints.length) * (Math.PI / 180);
          const latScale = 364000;
          const lngScale = 364000 * Math.cos(avgLatRad);

          let area = 0;
          for (let i = 0; i < drawnPoints.length; i++) {
            const j = (i + 1) % drawnPoints.length;
            const xi = drawnPoints[i][1] * lngScale;
            const yi = drawnPoints[i][0] * latScale;
            const xj = drawnPoints[j][1] * lngScale;
            const yj = drawnPoints[j][0] * latScale;
            area += xi * yj - xj * yi;
          }
          setCalculatedAreaSqft(Math.round(Math.abs(area) / 2));
        }
      } catch (err) {
        console.warn('updateDrawing error:', err);
      }
    };

    updateDrawing();
    return () => {
      isMounted = false;
    };
  }, [drawnPoints, isMapReady]);

  // Search
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation.trim() || !mapInstanceRef.current) return;

    setIsSearching(true);
    const query = searchLocation.trim();

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        mapInstanceRef.current.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 16, { duration: 1.4 });
      } else {
        const lower = query.toLowerCase();
        if (lower.includes('chennai') || lower.includes('madras')) mapInstanceRef.current.flyTo([12.9800, 80.2200], 15);
        else if (lower.includes('coimbatore') || lower.includes('kovai')) mapInstanceRef.current.flyTo([11.0168, 76.9558], 15);
        else if (lower.includes('guduvanchery') || lower.includes('chengalpattu')) mapInstanceRef.current.flyTo([12.8420, 80.0650], 16);
        else if (lower.includes('ecr') || lower.includes('akkarai') || lower.includes('beach')) mapInstanceRef.current.flyTo([12.9050, 80.2520], 16);
        else if (lower.includes('omr') || lower.includes('siruseri') || lower.includes('sholinganallur')) mapInstanceRef.current.flyTo([12.8350, 80.2220], 16);
        else if (lower.includes('pollachi') || lower.includes('anaimalai')) mapInstanceRef.current.flyTo([10.6625, 77.0125], 16);
        else if (lower.includes('madurai')) mapInstanceRef.current.flyTo([9.9252, 78.1198], 15);
        else if (lower.includes('trichy') || lower.includes('tiruchirappalli')) mapInstanceRef.current.flyTo([10.7905, 78.7047], 15);
        else mapInstanceRef.current.flyTo([12.8420, 80.0650], 15);
      }
    } catch {
      mapInstanceRef.current.flyTo([12.8420, 80.0650], 15);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          try {
            mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 18, { duration: 1.4 });
          } catch {}
        },
        () => alert('Could not get GPS location.')
      );
    }
  };

  const toggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const calculatedAcres = (calculatedAreaSqft / 43560).toFixed(2);

  return (
    <div
      ref={mapWrapperRef}
      className={`relative w-full h-full rounded-[28px] overflow-hidden bg-stone-900 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none transition-all ${
        isFullscreen ? 'h-screen w-screen rounded-none border-0' : ''
      }`}
    >
      {/* Real Movable Leaflet Canvas */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full absolute inset-0 z-0 ${isDrawingMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* TOP FLOATING ISLAND BAR */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-4 right-2 sm:right-4 z-20 flex items-center justify-between gap-1.5 sm:gap-2.5 pointer-events-none">
        
        {/* Left Side: Sidebar Toggle (if available) + Compact Search Pill */}
        <div className="flex items-center gap-1.5 pointer-events-auto min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex items-center gap-1.5 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-xs font-bold text-stone-800 hover:bg-stone-50 transition shrink-0"
              title={isSidebarOpen ? 'Collapse Property List' : 'Show Property List'}
            >
              {isSidebarOpen ? (
                <>
                  <ChevronLeft className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[11px]">Full Map</span>
                </>
              ) : (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[11px]">Show Feed</span>
                </>
              )}
            </button>
          )}

          {/* Search Input Floating Pill (Mobile-safe width) */}
          <form
            onSubmit={handleLocationSearch}
            className="flex items-center bg-white/95 backdrop-blur-xl rounded-full border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-2 py-0.5 sm:px-2.5 sm:py-1 w-24 xs:w-32 sm:w-56 transition-all focus-within:w-36 sm:focus-within:w-68 shrink-0"
          >
            <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              placeholder="Search TN..."
              className="w-full bg-transparent px-1 sm:px-1.5 text-[10px] sm:text-[11px] text-stone-900 placeholder-stone-400 focus:outline-none font-medium"
            />
            {searchLocation && (
              <button
                type="button"
                onClick={() => setSearchLocation('')}
                className="p-0.5 rounded-full text-stone-400 hover:text-stone-700 mr-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearching}
              className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-stone-900 text-white font-semibold text-[9px] sm:text-[11px] transition hover:bg-stone-800 shrink-0"
            >
              {isSearching ? '...' : 'Go'}
            </button>
          </form>
        </div>

        {/* Right Side: 16 Plots button (if layout) + Satellite / Streets Pill */}
        <div className="pointer-events-auto flex items-center gap-1 shrink-0">
          {selectedProperty?.isVentureLayout && onOpenMasterplan && (
            <button
              onClick={onOpenMasterplan}
              className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] sm:text-[11px] font-bold shadow-xs transition"
              title="Inspect 16 Layout Plots"
            >
              <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-200" />
              <span>16 Plots</span>
            </button>
          )}

          {/* Mobile Single Layer Toggle Button */}
          <button
            onClick={() => changeMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
            className="flex sm:hidden items-center gap-1 bg-white/95 backdrop-blur-xl px-2 py-0.5 rounded-full border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-[9.5px] font-bold text-stone-800"
            title="Toggle Satellite / Streets"
          >
            <span>{mapType === 'roadmap' ? '🗺️ Map' : '🛰️ Sat'}</span>
          </button>

          {/* Desktop Dual Switcher Pill */}
          <div className="hidden sm:flex items-center gap-0.5 bg-white/95 backdrop-blur-xl p-0.5 rounded-full border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-xs font-semibold text-stone-700">
            <button
              onClick={() => changeMapType('hybrid')}
              className={`px-2.5 py-1 rounded-full text-[11px] transition ${
                mapType === 'hybrid' ? 'bg-stone-900 text-white shadow-xs' : 'hover:bg-stone-100 text-stone-600'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => changeMapType('roadmap')}
              className={`px-2.5 py-1 rounded-full text-[11px] transition ${
                mapType === 'roadmap' ? 'bg-stone-900 text-white shadow-xs' : 'hover:bg-stone-100 text-stone-600'
              }`}
            >
              Streets
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT FLOATING TOOLSTRIP */}
      <div className="absolute right-2 sm:right-4 top-13 sm:top-15 z-20 flex flex-col gap-1 pointer-events-auto select-none">
        
        <div className="flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-0.5 sm:p-1 divide-y divide-stone-100 text-stone-700">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-stone-100 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-stone-100 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
          </button>
        </div>

        <div className="flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-0.5 sm:p-1 gap-0.5 text-stone-700">
          <button
            onClick={handleLocateMe}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition"
            title="My Location"
          >
            <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => {
              setIsDrawingMode(!isDrawingMode);
              if (isDrawingMode) setDrawnPoints([]);
            }}
            className={`p-1.5 sm:p-2 rounded-xl transition ${
              isDrawingMode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'hover:bg-stone-100 text-stone-700'
            }`}
            title="Measure / Draw Boundary"
          >
            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>

      </div>

      {/* DRAWING / MEASURING HUD OVERLAY */}
      {isDrawingMode && (
        <div className="absolute top-14 sm:top-16 left-2 sm:left-4 right-2 sm:right-4 z-30 bg-white/95 backdrop-blur-xl border border-amber-300 rounded-2xl p-2.5 sm:p-3 text-stone-900 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="font-semibold text-stone-800">Click map points to outline boundary</span>
          </div>

          <div className="flex items-center gap-3 font-mono font-semibold text-xs">
            <span>Corners: <b>{drawnPoints.length}</b></span>
            <span>
              Area: <b className="text-emerald-700">{formatNumber(calculatedAreaSqft)} sq ft</b> ({calculatedAcres} ac)
            </span>
            {drawnPoints.length > 0 && (
              <button
                onClick={() => setDrawnPoints([])}
                className="p-1 rounded-md text-stone-400 hover:text-rose-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {drawnPoints.length >= 3 && (
              <button
                onClick={() => {
                  alert(`Boundary recorded: ${formatNumber(calculatedAreaSqft)} sq ft (${calculatedAcres} Acres).`);
                  setIsDrawingMode(false);
                }}
                className="px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}

      {/* 
        BOTTOM PROPERTY PEEK CARD (Only shown in Full Map Hero Mode or Mobile to avoid double-card clutter in Split View) 
      */}
      {showBottomDrawer && selectedProperty && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto z-20 max-w-md bg-white/95 backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl border border-stone-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.16)] flex items-center justify-between gap-3 text-xs pointer-events-auto animate-in slide-in-from-bottom duration-300">
          <img
            src={selectedProperty.images[0]}
            alt={selectedProperty.title}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-stone-200 shadow-xs"
          />
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                {selectedProperty.verification.approvalType}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">#{selectedProperty.verification.surveyNumber}</span>
            </div>
            <h4 className="text-xs font-extrabold text-stone-900 truncate">{selectedProperty.title}</h4>
            <div className="flex items-center gap-2 text-stone-600 font-medium text-[11px]">
              <span className="font-black text-stone-900" suppressHydrationWarning>{formatCurrency(selectedProperty.price)}</span>
              <span>·</span>
              <span suppressHydrationWarning>{formatNumber(selectedProperty.totalSqft)} sq ft</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="px-3 py-1.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-800 font-semibold transition text-xs"
            >
              Specs
            </button>
            <button
              onClick={() => setIsDealModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1"
            >
              <span>Visit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
