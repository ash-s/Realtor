'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, User, ChevronDown, ChevronUp, Sparkles, MessageSquare } from 'lucide-react';

export default function RoleSwitcherDock() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, login, setIsContactModalOpen, setContactProperty } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsExpanded(true);
    }
  }, []);

  // Don't show inside login page
  if (pathname === '/login') return null;

  const currentRole = currentUser?.role || 'buyer';

  const handleSwitch = (role: UserRole, targetPath: string) => {
    login(role, role === 'seller' ? 'company' : 'individual');
    router.push(targetPath);
  };

  return (
    <aside aria-label="Role Switcher Dock" className="hidden md:block fixed bottom-4 left-4 z-50 select-none">
      <div className="bg-white/95 backdrop-blur-md border border-slate-300 shadow-2xl rounded-2xl p-2.5 max-w-sm transition-all text-xs">
        
        {/* Header with Collapse Toggle */}
        <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] uppercase tracking-wider text-slate-500">Live Role Testing Dock:</span>
            <span className="px-2 py-0.5 rounded-md font-extrabold text-[11px] capitalize bg-slate-100 text-slate-800">
              {currentRole}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Role Buttons */}
        {isExpanded && (
          <div className="pt-2 space-y-1.5">
            <div className="text-[10px] text-slate-500 font-medium">
              Click any persona to test its dedicated dashboard:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSwitch('buyer', '/buyer')}
                className={`py-1.5 px-2 rounded-xl text-center font-bold transition flex flex-col items-center gap-0.5 ${
                  currentRole === 'buyer' && pathname.includes('buyer')
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="text-[10px]">Buyer Portal</span>
              </button>

              <button
                onClick={() => handleSwitch('seller', '/seller')}
                className={`py-1.5 px-2 rounded-xl text-center font-bold transition flex flex-col items-center gap-0.5 ${
                  currentRole === 'seller' && pathname.includes('seller')
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="text-[10px]">Seller Portal</span>
              </button>

              <button
                onClick={() => handleSwitch('admin', '/admin')}
                className={`py-1.5 px-2 rounded-xl text-center font-bold transition flex flex-col items-center gap-0.5 ${
                  currentRole === 'admin' && pathname.includes('admin')
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[10px]">Admin Desk</span>
              </button>
            </div>

            <button
              onClick={() => {
                setContactProperty(null);
                setIsContactModalOpen(true);
              }}
              className="w-full mt-2 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Admin Concierge</span>
            </button>
          </div>
        )}

      </div>
    </aside>
  );
}
