'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  X,
  ShieldCheck,
  Send,
  MessageSquare,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function ContactAdminModal() {
  const {
    isContactModalOpen,
    setIsContactModalOpen,
    contactProperty,
    selectedProperty,
    currentUser,
    contactAdmin
  } = useApp();

  const activeProp = contactProperty || selectedProperty;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [offerPrice, setOfferPrice] = useState<number | ''>('');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone('+1 (555) 392-1084');
    }
  }, [currentUser, isContactModalOpen]);

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert('Please provide your name, phone number, and a message for the Admin Concierge.');
      return;
    }

    contactAdmin({
      propertyId: activeProp?.id || 'inquiry-general',
      propertyTitle: activeProp?.title || 'General Inbound Land Consultation',
      buyerName: name,
      buyerPhone: phone,
      buyerEmail: email || 'buyer@verified.com',
      message: message.trim(),
      scheduledDate: visitDate || undefined,
      offerPrice: offerPrice ? Number(offerPrice) : (activeProp ? activeProp.price : 0)
    });

    setSubmittedTicketId(`deal-${Date.now().toString().slice(-4)}`);
  };

  const handleClose = () => {
    setSubmittedTicketId(null);
    setMessage('');
    setIsContactModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-stone-200/90 rounded-3xl shadow-2xl overflow-hidden my-auto text-stone-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 tracking-tight">
                Contact Admin Concierge Desk
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Direct Line to Officer Sarah Jenkins • Anti-Circumvention Active
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success confirmation state */}
        {submittedTicketId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                Ticket #{submittedTicketId}
              </span>
              <h4 className="text-lg font-extrabold text-stone-900 mt-2">
                Message Received by Admin!
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Your message has been delivered directly to the <strong>PlotTerra Admin Command Center</strong>. Our in-house broker will review your inquiry and contact you via phone or WhatsApp shortly.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            
            {/* Target Property Card (if selected) */}
            {activeProp && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Property of Interest
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.2 rounded-full">
                    DTCP / RERA Verified
                  </span>
                </div>
                <div className="font-extrabold text-stone-900 text-sm truncate">
                  {activeProp.title}
                </div>
                <div className="flex items-center justify-between text-stone-600 text-xs pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{activeProp.location.city} • Survey #{activeProp.verification.surveyNumber}</span>
                  </span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatCurrency(activeProp.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Buyer Contact Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 392-1084"
                      className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition font-mono font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alexander@investor.com"
                      className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Message to Admin Concierge (CRITICAL FIELD) */}
              <div>
                <label className="block text-stone-700 font-bold mb-1 flex items-center justify-between">
                  <span>Your Message / Inquiry for Admin *</span>
                  <span className="text-[10px] font-normal text-stone-400">Delivered directly to Admin CRM</span>
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="e.g. Hi Sarah, I am interested in scheduling a physical site inspection for Palm Valley Phase 1 this weekend. Please confirm surveyor availability and send the DTCP approval deed."
                    className="w-full bg-stone-50/80 border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition font-normal"
                  />
                </div>
              </div>

              {/* Optional Offer / Visit Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Preferred Visit Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="date"
                      value={visitDate}
                      onChange={e => setVisitDate(e.target.value)}
                      className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-stone-900 transition font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Proposed Offer ($) (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={e => setOfferPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder={activeProp ? String(activeProp.price) : '0'}
                      className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-emerald-700 font-mono font-bold focus:outline-none focus:border-stone-900 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Anti-circumvention trust footer */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>Broker Confidentiality Protected:</strong> Direct landowner details are masked to ensure security. Your inquiry is directly received and handled by our in-house Concierge Desk.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message to Admin Concierge</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
