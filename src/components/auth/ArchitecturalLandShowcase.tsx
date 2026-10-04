'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '@/types';
import {
  Compass,
  Layers,
  ShieldCheck,
  TreePine,
  Building2,
  CheckCircle2,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  BadgeCheck
} from 'lucide-react';

interface Props {
  activeRole: UserRole;
}

interface PlotDemo {
  number: string;
  sqft: number;
  facing: string;
  status: 'available' | 'reserved' | 'escrow';
  price: string;
}

const DEMO_PLOTS: PlotDemo[] = [
  { number: '101', sqft: 2400, facing: 'East Facing • 60ft Road', status: 'available', price: '$120,000' },
  { number: '102', sqft: 2400, facing: 'East Facing • Corner', status: 'escrow', price: '$135,000' },
  { number: '103', sqft: 3200, facing: 'North Facing • Garden', status: 'reserved', price: '$160,000' },
  { number: '104', sqft: 2800, facing: 'North Facing • 40ft Road', status: 'available', price: '$140,000' },
  { number: '105', sqft: 2400, facing: 'West Facing • Avenue', status: 'available', price: '$118,000' },
  { number: '106', sqft: 3600, facing: 'South Facing • Luxury Corner', status: 'escrow', price: '$180,000' }
];

export default function ArchitecturalLandShowcase({ activeRole }: Props) {
  const [selectedPlotIndex, setSelectedPlotIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const activePlot = DEMO_PLOTS[selectedPlotIndex];

  // Mouse movement parallax for lightweight 3D isometric perspective
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = nx * 0.6;
    mouseRef.current.targetY = ny * 0.6;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // Pure mathematical 3D Isometric Cadastral Grid on HTML5 Canvas (Zero video)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
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

    const render = () => {
      time += 0.015;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.55;
      const pitch = 0.52 + mouseRef.current.y * 0.25;
      const yaw = mouseRef.current.x * 0.4;

      const project = (gx: number, gy: number, gz: number) => {
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const rx = gx * cosY - gy * sinY;
        const ry = gx * sinY + gy * cosY;
        const px = centerX + rx;
        const py = centerY + ry * Math.sin(pitch) - gz * Math.cos(pitch);
        return { x: px, y: py };
      };

      // Draw Topographical Contour Lines
      ctx.lineWidth = 1;
      const rows = 12;
      const cols = 12;
      const step = 26;

      for (let r = 0; r < rows; r++) {
        const gy = (r - rows / 2) * step;
        ctx.beginPath();
        let started = false;

        for (let c = 0; c < cols; c++) {
          const gx = (c - cols / 2) * step;
          const dist = Math.sqrt(gx * gx + gy * gy);
          const gz = Math.sin(gx * 0.03 + time) * 10 + Math.cos(gy * 0.03 + time * 0.8) * 8;
          const p = project(gx, gy, gz);

          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
        ctx.stroke();
      }

      for (let c = 0; c < cols; c++) {
        const gx = (c - cols / 2) * step;
        ctx.beginPath();
        let started = false;

        for (let r = 0; r < rows; r++) {
          const gy = (r - rows / 2) * step;
          const gz = Math.sin(gx * 0.03 + time) * 10 + Math.cos(gy * 0.03 + time * 0.8) * 8;
          const p = project(gx, gy, gz);

          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.stroke();
      }

      // Draw 3D Boundary Perimeter Box for Selected Plot
      const plotBox = [
        { gx: -50, gy: -40, gz: 12 },
        { gx: 50, gy: -40, gz: 12 },
        { gx: 50, gy: 40, gz: 10 },
        { gx: -50, gy: 40, gz: 10 }
      ];

      ctx.beginPath();
      plotBox.forEach((pt, i) => {
        const p = project(pt.gx, pt.gy, pt.gz);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corner Peg Markers
      plotBox.forEach((pt, i) => {
        const p = project(pt.gx, pt.gy, pt.gz);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Peg ${String.fromCharCode(65 + i)}`, p.x + 6, p.y - 4);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[580px] rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-925 to-stone-950 border border-stone-800 shadow-2xl p-6 flex flex-col justify-between select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Platform Identity & Cadastral Status */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-xs">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white tracking-tight">Emerald Valley Venture</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                DTCP Approved
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">
              Survey #118/4B • 14.5 Total Venture Acres • Georeferenced
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-stone-300 bg-stone-950/80 px-3 py-1.5 rounded-full border border-stone-800">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>38.2918° N, 122.4580° W</span>
        </div>
      </div>

      {/* Center Display: Interactive 3D Cadastral Canvas & Interactive Plot Selector */}
      <div className="relative z-10 my-4 space-y-4">
        
        {/* 3D Isometric Mathematical Grid Canvas */}
        <div className="relative h-48 w-full rounded-2xl bg-stone-950/60 border border-stone-800/80 overflow-hidden shadow-inner flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          
          <div className="absolute top-2.5 left-3 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md border border-stone-800 text-[10px] font-mono text-stone-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 3D Cadastral Perspective</span>
          </div>

          <div className="absolute bottom-2.5 right-3 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md border border-stone-800 text-[10px] font-mono text-emerald-400 font-bold">
            Plot #{activePlot.number} Selected
          </div>
        </div>

        {/* Interactive Plotted Layout Selector Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Plotted Venture Layout</span>
            </span>
            <span className="text-[11px] text-stone-400 font-medium">Click plot to inspect</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_PLOTS.map((plot, idx) => (
              <button
                key={plot.number}
                type="button"
                onClick={() => setSelectedPlotIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition relative ${
                  selectedPlotIndex === idx
                    ? 'bg-emerald-950/50 border-emerald-500/80 shadow-md shadow-emerald-900/20'
                    : 'bg-stone-950/50 border-stone-800/80 hover:bg-stone-800/50 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">Plot #{plot.number}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      plot.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : plot.status === 'escrow'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-stone-700/40 text-stone-400'
                    }`}
                  >
                    {plot.status}
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 mt-1 font-mono">{plot.sqft} sq ft</div>
                <div className="text-[11px] font-extrabold text-white mt-0.5">{plot.price}</div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Display: Persona-Specific Capability Showcase */}
      <div className="relative z-10 pt-3 border-t border-stone-800 space-y-2.5">
        <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md ${
                activeRole === 'buyer'
                  ? 'bg-blue-600'
                  : activeRole === 'seller'
                  ? 'bg-emerald-600'
                  : 'bg-purple-600'
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
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>
                  {activeRole === 'buyer'
                    ? 'Verified Buyer Portal Experience'
                    : activeRole === 'seller'
                    ? 'Seller Cadastral Listing Suite'
                    : 'Admin Concierge & Escrow Desk'}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full uppercase bg-stone-800 text-stone-300 font-mono">
                  {activeRole}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                {activeRole === 'buyer'
                  ? 'Book physical survey visits, inspect DTCP perimeter pegs, and place secure escrow offers.'
                  : activeRole === 'seller'
                  ? 'Upload land deed certificates, georeference boundary coordinates, and manage leads.'
                  : 'Coordinate verified visits, mediate buyer inquiries with real-time chat, and manage escrow closing.'}
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-[10px] text-stone-400 font-medium text-center">
          <div className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-stone-950/40 border border-stone-800/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>DTCP Approved</span>
          </div>
          <div className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-stone-950/40 border border-stone-800/60">
            <Lock className="w-3 h-3 text-blue-400" />
            <span>Zero Spam Vault</span>
          </div>
          <div className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-stone-950/40 border border-stone-800/60">
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            <span>Bank-Grade Escrow</span>
          </div>
        </div>
      </div>

    </div>
  );
}
