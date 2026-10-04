'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { X, ShieldCheck, Calendar, DollarSign, User, Phone, Mail, CheckCircle2, Lock } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function CreateDealModal() {
  const { isDealModalOpen, setIsDealModalOpen, selectedProperty, selectedVenturePlotId, createDealTicket } = useApp();

  const currentPlot = selectedProperty?.venturePlots?.find(p => p.id === selectedVenturePlotId);
  const initialPrice = currentPlot ? currentPlot.price : selectedProperty?.price || 100000;

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState<number>(initialPrice);
  const [visitDate, setVisitDate] = useState('');
  const [requestLegalAssistance, setRequestLegalAssistance] = useState(true);

  if (!isDealModalOpen || !selectedProperty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) {
      alert('Please enter your name and phone number so the Admin Concierge can verify your visit.');
      return;
    }

    createDealTicket({
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      plotNumber: currentPlot ? `Plot #${currentPlot.plotNumber}` : undefined,
      buyerName,
      buyerPhone,
      buyerEmail: buyerEmail || 'buyer@verified.com',
      buyerMessage: buyerMessage.trim() || undefined,
      offerPrice: Number(offerPrice) || initialPrice,
      scheduledDate: visitDate || new Date(Date.now() + 86400000 * 2).toISOString()
    });

    alert('✅ Inquiry & Message Received by Admin Concierge! Sarah Jenkins will reach out via WhatsApp/Phone.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Admin Deal Concierge</h3>
              <p className="text-[11px] text-slate-500 font-medium">Zero Direct Spam • Protected Brokerage</p>
            </div>
          </div>

          <button
            onClick={() => setIsDealModalOpen(false)}
            className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Property Target Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selected Asset</span>
            <div className="font-bold text-slate-900 text-sm">{selectedProperty.title}</div>
            <div className="text-slate-600 text-xs flex justify-between font-medium">
              <span>{currentPlot ? `Venture Plot #${currentPlot.plotNumber} (${currentPlot.sqft} sq ft)` : `${selectedProperty.totalSqft} sq ft Land Parcel`}</span>
              <span className="text-emerald-700 font-bold" suppressHydrationWarning>{formatCurrency(initialPrice)}</span>
            </div>
          </div>

          {/* Buyer Contact Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  placeholder="e.g. John Doe / Robert Smith"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number (WhatsApp) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={e => setBuyerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={e => setBuyerEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Offer & Visit Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Offer Price ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={e => setOfferPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-emerald-700 font-bold focus:outline-none focus:border-blue-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Preferred Visit Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 transition font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Message for Admin Concierge (Optional)
              </label>
              <textarea
                rows={2}
                value={buyerMessage}
                onChange={e => setBuyerMessage(e.target.value)}
                placeholder="e.g. Please verify DTCP survey number and arrange an AC vehicle escort..."
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            {/* Legal Addon Checkbox */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="legal"
                  checked={requestLegalAssistance}
                  onChange={e => setRequestLegalAssistance(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="legal" className="text-slate-800 font-semibold cursor-pointer">
                  Request Free Legal Title & Encumbrance Verification
                </label>
              </div>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full">Included</span>
            </div>
          </div>

          {/* Anti-Circumvention Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Direct contact details of the seller are withheld to prevent unsolicited calls. Our authorized in-house agent will conduct your physical on-site survey and coordinate token escrow.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <span>Submit to Admin Concierge & Confirm Visit</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
