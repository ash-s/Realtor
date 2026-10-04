'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  TreePine,
  Building2,
  ShieldCheck,
  UserCheck,
  Search,
  PlusCircle,
  Menu,
  X,
  LogOut,
  Calendar,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const {
    currentUser,
    logout,
    activeChannel,
    setActiveChannel,
    searchQuery,
    setSearchQuery,
    dealTickets,
    setIsAddPropertyModalOpen,
    setIsContactModalOpen,
    setContactProperty,
    unreadAdminMessagesCount
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeDealsCount = dealTickets.filter(d => d.stage !== 'closed' && d.stage !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-stone-900 flex items-center justify-center text-white shadow-sm">
              <TreePine className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-stone-900">PlotTerra</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">GIS 3D</span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block font-medium">Land & Property Acquisition</p>
            </div>
          </Link>

          {/* Channel Switcher (Strict Separation) */}
          <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-full border border-stone-200/70">
            <button
              onClick={() => setActiveChannel('land_plot')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeChannel === 'land_plot'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>Land & Plots</span>
            </button>

            <button
              onClick={() => setActiveChannel('constructed')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeChannel === 'constructed'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Luxury Villas</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search survey no, village, plot..."
              className="w-full bg-stone-50/80 border border-stone-200 rounded-full pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition"
            />
          </div>

          {/* Role Navigation */}
          <div className="hidden sm:flex items-center gap-2">
            {currentUser?.role === 'buyer' && (
              <>
                <Link
                  href="/"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
                >
                  Explorer
                </Link>

                <Link
                  href="/buyer"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-900 hover:bg-stone-200 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-stone-700" />
                  <span>Buyer Desk</span>
                  {activeDealsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeDealsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {currentUser?.role === 'seller' && (
              <>
                <Link
                  href="/seller"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-900 hover:bg-stone-200 transition"
                >
                  <UserCheck className="w-3.5 h-3.5 text-stone-700" />
                  <span>Seller Desk</span>
                </Link>

                <button
                  onClick={() => setIsAddPropertyModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>List Land</span>
                </button>
              </>
            )}

            {/* Quick Direct Message to Admin Desk */}
            <button
              onClick={() => {
                setContactProperty(null);
                setIsContactModalOpen(true);
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition shadow-xs"
              title="Message Sarah Jenkins, Admin Concierge Desk"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact Admin</span>
            </button>

            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Concierge</span>
                {unreadAdminMessagesCount > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                    {unreadAdminMessagesCount} new
                  </span>
                ) : (
                  activeDealsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white text-stone-900 text-[10px] flex items-center justify-center font-bold">
                      {activeDealsCount}
                    </span>
                  )
                )}
              </Link>
            )}

            {!currentUser && (
              <>
                <Link
                  href="/"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
                >
                  Explorer
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs transition"
                >
                  Sign In
                </Link>
              </>
            )}

            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <span className="text-xs font-semibold text-stone-800 hidden xl:block">
                  {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex rounded-full bg-stone-100 p-1 border border-stone-200">
            <button
              onClick={() => {
                setActiveChannel('land_plot');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold ${
                activeChannel === 'land_plot' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Land & Plots
            </button>
            <button
              onClick={() => {
                setActiveChannel('constructed');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold ${
                activeChannel === 'constructed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Villas
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 rounded-full text-xs font-semibold border border-stone-200 text-center text-stone-700"
            >
              Explorer
            </Link>
            <Link
              href={currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'seller' ? '/seller' : '/buyer'}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 rounded-full text-xs font-semibold bg-stone-900 text-white text-center"
            >
              Dashboard
            </Link>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setContactProperty(null);
              setIsContactModalOpen(true);
            }}
            className="w-full py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Admin Concierge</span>
          </button>
        </div>
      )}
    </header>
  );
}
