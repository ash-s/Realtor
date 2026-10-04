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
  CheckCircle2
} from 'lucide-react';
import { Property } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/formatters';

type MapLayerType = 'hybrid' | 'satellite' | 'roadmap';

export default function GoogleMapGIS() {
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

  const centerLat = selectedProperty?.location.lat || 37.7749;
  const centerLng = selectedProperty?.location.lng || -122.4194;

  const getGoogleTileUrl = (type: MapLayerType) => {
    switch (type) {
      case 'satellite':
        return 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      case 'roadmap':
        return 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      case 'hybrid':
      default:
        return 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }
  };

  // Safe guarded map invalidateSize to prevent infinite ResizeObserver loops
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

  // 1. Initialize Leaflet Map safely
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
          center: [centerLat, centerLng],
          zoom: zoomLevel,
          zoomControl: false,
          attributionControl: false,
          dragging: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true
        });

        mapInstanceRef.current = map;

        const tileUrl = getGoogleTileUrl(mapType);
        const tileLayer = L.tileLayer(tileUrl, {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 21,
          maxNativeZoom: 20
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

        // Trigger safe size refresh after mounting
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
  }, [centerLat, centerLng, safeInvalidateSize]);

  // 2. Change Tile Layer
  const changeMapType = async (newType: MapLayerType) => {
    setMapType(newType);
    if (!mapInstanceRef.current) return;
    try {
      const L = await import('leaflet');
      if (activeTileLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(activeTileLayerRef.current);
      }
      const tileUrl = getGoogleTileUrl(newType);
      const newTileLayer = L.tileLayer(tileUrl, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 21,
        maxNativeZoom: 20
      }).addTo(mapInstanceRef.current);
      activeTileLayerRef.current = newTileLayer;
    } catch (err) {
      console.warn('Error changing tile layer:', err);
    }
  };

  // 3. Auto-Fly to Property whenever selectedProperty changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedProperty) return;
    try {
      safeInvalidateSize();
      mapInstanceRef.current.flyTo(
        [selectedProperty.location.lat, selectedProperty.location.lng],
        17,
        { duration: 1.2 }
      );
    } catch (err) {
      console.warn('flyTo error:', err);
    }
  }, [selectedProperty?.id, isMapReady, safeInvalidateSize]);

  // 4. Render Clean Land Boundary Outline (Pure geometry, royal blue, zero text clutter)
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

        L.polygon(latLngs, {
          color: '#2563eb', // Royal Blue outline
          weight: 3.5,
          opacity: 0.95,
          fillColor: '#3b82f6',
          fillOpacity: 0.2
        }).addTo(polygonLayerRef.current);

        L.polygon(latLngs, {
          color: '#ffffff',
          weight: 1.5,
          opacity: 0.8,
          fillColor: 'transparent',
          dashArray: '6, 6'
        }).addTo(polygonLayerRef.current);
      } catch (err) {
        console.warn('renderSelectedBoundary error:', err);
      }
    };

    renderSelectedBoundary();
    return () => {
      isMounted = false;
    };
  }, [isMapReady, selectedProperty]);

  // 5. Render Property Pins Showing ONLY Property Name
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
          const shortName = prop.title.split('(')[0].trim();

          const pinIcon = L.divIcon({
            className: 'property-name-pin-container',
            html: `<div style="display:inline-flex; width:max-content; transform:translate(-50%, -50%); cursor:pointer;">
                    <div style="background:${isSelected ? '#0f172a' : '#ffffff'}; color:${isSelected ? '#ffffff' : '#0f172a'}; font-size:11px; font-weight:700; padding:6px 14px; border-radius:9999px; box-shadow:0 6px 20px rgba(0,0,0,0.18); border:1.5px solid ${isSelected ? '#0f172a' : '#e2e8f0'}; white-space:nowrap; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s ease;">
                      <span style="font-size:12px;">📍</span>
                      <span>${shortName}</span>
                    </div>
                   </div>`,
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
        if (lower.includes('austin')) mapInstanceRef.current.flyTo([30.2672, -97.7431], 16);
        else if (lower.includes('beverly')) mapInstanceRef.current.flyTo([34.0736, -118.4004], 16);
        else if (lower.includes('miami')) mapInstanceRef.current.flyTo([25.7617, -80.1918], 16);
        else mapInstanceRef.current.flyTo([37.7749, -122.4194], 16);
      }
    } catch {
      // fallback safe flyTo
      mapInstanceRef.current.flyTo([37.7749, -122.4194], 16);
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
      className={`relative w-full rounded-[28px] overflow-hidden bg-stone-100 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col justify-between select-none transition-all ${
        isFullscreen ? 'h-screen w-screen rounded-none border-0' : 'h-[500px] sm:h-[600px] lg:h-[680px]'
      }`}
    >
      {/* Real Movable Leaflet Canvas */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full absolute inset-0 z-0 ${isDrawingMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* TOP FLOATING ISLAND BAR */}
      <div className="relative z-10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        
        {/* Search Input Floating Pill */}
        <form
          onSubmit={handleLocationSearch}
          className="pointer-events-auto flex items-center bg-white/90 backdrop-blur-xl rounded-full border border-stone-200/70 shadow-[0_6px_24px_rgba(0,0,0,0.08)] px-3.5 py-2 w-full max-w-xs sm:max-w-sm transition-all focus-within:shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
        >
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchLocation}
            onChange={e => setSearchLocation(e.target.value)}
            placeholder="Search address or area..."
            className="w-full bg-transparent px-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none font-medium"
          />
          {searchLocation && (
            <button
              type="button"
              onClick={() => setSearchLocation('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1 rounded-full bg-stone-900 text-white font-semibold text-xs transition hover:bg-stone-800 shrink-0"
          >
            {isSearching ? '...' : 'Go'}
          </button>
        </form>

        {/* Map Layer Mode Switcher Pill */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white/90 backdrop-blur-xl p-1 rounded-full border border-stone-200/70 shadow-[0_6px_24px_rgba(0,0,0,0.08)] text-xs font-semibold text-stone-700">
          <button
            onClick={() => changeMapType('hybrid')}
            className={`px-3 py-1.5 rounded-full transition ${
              mapType === 'hybrid' ? 'bg-stone-900 text-white shadow-xs' : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => changeMapType('roadmap')}
            className={`px-3 py-1.5 rounded-full transition ${
              mapType === 'roadmap' ? 'bg-stone-900 text-white shadow-xs' : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            Streets
          </button>
        </div>

      </div>

      {/* RIGHT FLOATING TOOLSTRIP */}
      <div className="absolute right-3 sm:right-4 top-20 z-20 flex flex-col gap-1.5 pointer-events-auto select-none">
        
        <div className="flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl border border-stone-200/70 shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-1 divide-y divide-stone-100 text-stone-700">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2.5 rounded-xl hover:bg-stone-100 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-stone-700" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2.5 rounded-xl hover:bg-stone-100 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-stone-700" />
          </button>
        </div>

        <div className="flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl border border-stone-200/70 shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-1 gap-1 text-stone-700">
          <button
            onClick={handleLocateMe}
            className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-700 transition"
            title="My Location"
          >
            <Navigation className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsDrawingMode(!isDrawingMode);
              if (isDrawingMode) setDrawnPoints([]);
            }}
            className={`p-2.5 rounded-xl transition ${
              isDrawingMode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'hover:bg-stone-100 text-stone-700'
            }`}
            title="Measure / Draw Boundary"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-700 transition"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* DRAWING / MEASURING HUD OVERLAY */}
      {isDrawingMode && (
        <div className="relative z-10 mx-3 sm:mx-4 bg-white/95 backdrop-blur-xl border border-amber-300 rounded-2xl p-3 text-stone-900 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
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

      {/* BOTTOM PROPERTY DETAILS DRAWER */}
      {selectedProperty && (
        <div className="relative z-10 m-3 sm:m-4 bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] border border-stone-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs pointer-events-auto animate-in slide-in-from-bottom duration-300">
          
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 border border-stone-200 shadow-xs"
            />
            
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-stone-900 truncate">
                  {selectedProperty.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{selectedProperty.verification.approvalType} Approved</span>
                </span>
              </div>
              
              <p className="text-[11px] text-stone-500 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span>Survey #{selectedProperty.verification.surveyNumber}</span>
                <span>·</span>
                <span>{selectedProperty.location.city}</span>
                <span>·</span>
                <span>{formatNumber(selectedProperty.totalSqft)} sq ft</span>
                <span>·</span>
                <span className="font-black text-stone-900">{formatCurrency(selectedProperty.price)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-800 font-semibold transition"
            >
              Full Details
            </button>
            <button
              onClick={() => setIsDealModalOpen(true)}
              className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Book Visit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
