'use client';

import React, { useRef, useEffect, useState } from 'react';
import { UserRole } from '@/types';
import {
  Compass,
  Layers,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  TreePine,
  Building2,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface Props {
  activeRole: UserRole;
}

interface SceneOption {
  id: string;
  name: string;
  badge: string;
  videoUrl: string;
  poster: string;
  tagline: string;
}

const SCENES: SceneOption[] = [
  {
    id: 'plotted-land',
    name: '3D Plotted Venture Survey',
    badge: 'LiDAR Topography',
    videoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/22/BLM_drone_training_above_Horning_Seed_Orchard_%2835179078385%29.webm/BLM_drone_training_above_Horning_Seed_Orchard_%2835179078385%29.webm.720p.vp9.webm',
    poster:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    tagline: 'High-precision agricultural & plotted land boundary scan'
  },
  {
    id: 'luxury-estate',
    name: 'Luxury Architectural Estate',
    badge: 'Digital Twin 4K',
    videoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/1e/Addison%2C_VT_Home_%28aerial_drone_footage%29.webm/Addison%2C_VT_Home_%28aerial_drone_footage%29.webm.720p.vp9.webm',
    poster:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Architectural residential villa with perimeter dimensions'
  }
];

export default function DigitalTwin3DVisualizer({ activeRole }: Props) {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showWireframe, setShowWireframe] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: '38.2918° N', lng: '122.4580° W', alt: '342m' });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const activeScene = SCENES[selectedSceneIndex];

  // Toggle Video Playback
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Toggle Audio
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Track Mouse Movement for 3D Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = nx * 0.8;
    mouseRef.current.targetY = ny * 0.8;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // Interactive 3D Topographical Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D Grid Parameters
    const rows = 14;
    const cols = 14;
    const gridSize = 24;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp for 3D perspective
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (showWireframe) {
        // Perspective settings
        const centerX = width / 2;
        const centerY = height * 0.62;
        const pitch = 0.55 + mouseRef.current.y * 0.3; // tilt angle
        const yaw = time * 0.15 + mouseRef.current.x * 0.5; // continuous rotation + mouse

        // Coordinate transformation function
        const project = (gx: number, gy: number, gz: number) => {
          // Rotate around Z/Y
          const cosY = Math.cos(yaw);
          const sinY = Math.sin(yaw);

          const rx = gx * cosY - gy * sinY;
          const ry = gx * sinY + gy * cosY;

          // Isometric pitch
          const px = centerX + rx;
          const py = centerY + ry * Math.sin(pitch) - gz * Math.cos(pitch);
          return { x: px, y: py, depth: ry };
        };

        // Scanning laser pulse wave
        const scanY = ((time * 30) % (rows * gridSize)) - (rows * gridSize) / 2;

        ctx.lineWidth = 1.2;

        // Render 3D Grid Lines
        for (let r = 0; r < rows; r++) {
          const gy = (r - rows / 2) * gridSize;
          ctx.beginPath();
          let started = false;

          for (let c = 0; c < cols; c++) {
            const gx = (c - cols / 2) * gridSize;
            // Elevation wave simulation (undulating topography)
            const dist = Math.sqrt(gx * gx + gy * gy);
            const gz =
              Math.sin(gx * 0.04 + time * 1.5) * 14 +
              Math.cos(gy * 0.04 + time * 1.2) * 12 +
              Math.sin(dist * 0.05 - time) * 10;

            const p = project(gx, gy, gz);

            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }

          // Laser scan highlight
          const isNearScan = Math.abs(gy - scanY) < 18;
          ctx.strokeStyle = isNearScan
            ? 'rgba(52, 211, 153, 0.85)'
            : 'rgba(56, 189, 248, 0.28)';
          ctx.stroke();
        }

        for (let c = 0; c < cols; c++) {
          const gx = (c - cols / 2) * gridSize;
          ctx.beginPath();
          let started = false;

          for (let r = 0; r < rows; r++) {
            const gy = (r - rows / 2) * gridSize;
            const dist = Math.sqrt(gx * gx + gy * gy);
            const gz =
              Math.sin(gx * 0.04 + time * 1.5) * 14 +
              Math.cos(gy * 0.04 + time * 1.2) * 12 +
              Math.sin(dist * 0.05 - time) * 10;

            const p = project(gx, gy, gz);

            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
          ctx.stroke();
        }

        // Render 3D Survey Beacon Pins
        const beacons = [
          { gx: -40, gy: -30, label: 'Peg A (Survey #118/4B)' },
          { gx: 50, gy: 40, label: 'Peg B (Road Face 60ft)' },
          { gx: -20, gy: 50, label: 'DTCP Corner Marker' }
        ];

        beacons.forEach((b, idx) => {
          const bz =
            Math.sin(b.gx * 0.04 + time * 1.5) * 14 +
            Math.cos(b.gy * 0.04 + time * 1.2) * 12 + 10;
          const p = project(b.gx, b.gy, bz + 18);
          const pBase = project(b.gx, b.gy, bz);

          // Pin Stem
          ctx.beginPath();
          ctx.moveTo(pBase.x, pBase.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Beacon Head
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = idx === 0 ? '#10b981' : '#38bdf8';
          ctx.fill();

          // Pulsing Glow Ring
          const pulse = (Math.sin(time * 3 + idx) + 1) * 4 + 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Label
          ctx.font = '9px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(b.label, p.x + 8, p.y + 3);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [showWireframe]);

  // Subtle coordinate jitter to simulate live GPS telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const latOffset = (Math.random() * 0.0004 - 0.0002).toFixed(4);
      const lngOffset = (Math.random() * 0.0004 - 0.0002).toFixed(4);
      setCoordinates({
        lat: `38.${(2918 + parseFloat(latOffset)).toFixed(4).replace('0.', '')}° N`,
        lng: `122.${(4580 + parseFloat(lngOffset)).toFixed(4).replace('0.', '')}° W`,
        alt: `${Math.floor(340 + Math.random() * 4)}m ASL`
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[520px] lg:min-h-[640px] rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl flex flex-col justify-between group select-none"
    >
      {/* 3D Cinematic Drone / Aerial Video Stream */}
      <video
        ref={videoRef}
        key={activeScene.id}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        poster={activeScene.poster}
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
      >
        <source src={activeScene.videoUrl} type="video/webm" />
      </video>

      {/* Atmospheric Overlays & Color Grading */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.7)_100%)] pointer-events-none" />

      {/* Interactive 3D LiDAR Wireframe Topography Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* TOP HUD: Live Telemetry Bar */}
      <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-b from-stone-950/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400">
            3D DIGITAL TWIN • ONLINE
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-stone-300 border border-white/15">
            LiDAR v4.2
          </span>
        </div>

        {/* GPS Telemetry */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-stone-300 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700/60 shadow-xs">
          <Compass className="w-3 h-3 text-cyan-400 animate-spin-slow" />
          <span>{coordinates.lat}</span>
          <span className="text-stone-600">•</span>
          <span>{coordinates.lng}</span>
          <span className="text-stone-600 hidden md:inline">•</span>
          <span className="text-emerald-400 hidden md:inline">{coordinates.alt}</span>
        </div>
      </div>

      {/* CENTER HUD: Reticle Scanner Target */}
      <div className="relative z-20 pointer-events-none flex flex-col items-center justify-center my-auto px-4 text-center">
        <div className="relative w-28 h-28 border border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 border border-emerald-500/40 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
          </div>
          <div className="absolute top-0 w-3 h-0.5 bg-cyan-400" />
          <div className="absolute bottom-0 w-3 h-0.5 bg-cyan-400" />
          <div className="absolute left-0 h-3 w-0.5 bg-cyan-400" />
          <div className="absolute right-0 h-3 w-0.5 bg-cyan-400" />
        </div>

        <div className="mt-3 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-stone-700/80 shadow-lg text-stone-200">
          <span className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {activeScene.name}
          </span>
          <span className="text-[11px] text-stone-400 block mt-0.5">{activeScene.tagline}</span>
        </div>
      </div>

      {/* BOTTOM HUD: Scene Switcher, Video Controls & Dynamic Persona Insight */}
      <div className="relative z-20 p-4 sm:p-5 space-y-3 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent">
        
        {/* Dynamic Persona Teaser Card */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-md shrink-0 ${
                activeRole === 'buyer'
                  ? 'bg-blue-600 text-white'
                  : activeRole === 'seller'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {activeRole === 'buyer' ? (
                <TreePine className="w-4.5 h-4.5" />
              ) : activeRole === 'seller' ? (
                <Building2 className="w-4.5 h-4.5" />
              ) : (
                <ShieldCheck className="w-4.5 h-4.5" />
              )}
            </div>
            <div>
              <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                <span>
                  {activeRole === 'buyer'
                    ? 'Buyer Virtual Land Walkthrough'
                    : activeRole === 'seller'
                    ? 'Seller Cadastral Boundary Staging'
                    : 'Admin Deal Escrow & Title Vault'}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full uppercase bg-white/20 font-mono">
                  {activeRole}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-medium line-clamp-1">
                {activeRole === 'buyer'
                  ? 'Inspect 3D surveyed corners, DTCP approved layout, and schedule vehicle site visits.'
                  : activeRole === 'seller'
                  ? 'Draw precise perimeter GPS boundary lines and manage private title certificates.'
                  : 'Facilitate bank-grade token escrow, anti-circumvention protection, and buyer chat.'}
              </p>
            </div>
          </div>
        </div>

        {/* Video & 3D Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs">
          
          {/* Scene Selector */}
          <div className="flex items-center gap-1.5 bg-stone-900/80 p-1 rounded-xl border border-stone-800">
            {SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setSelectedSceneIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  selectedSceneIndex === idx
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {scene.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Interactive Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowWireframe(!showWireframe)}
              className={`p-1.5 rounded-lg border text-[11px] font-medium transition flex items-center gap-1 ${
                showWireframe
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-white'
              }`}
              title="Toggle 3D Wireframe Mesh"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Mesh</span>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition"
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
