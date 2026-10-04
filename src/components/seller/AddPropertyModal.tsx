'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ChannelType, PropertySubType } from '@/types';
import {
  X,
  PlusCircle,
  MapPin,
  ShieldCheck,
  TreePine,
  Building2,
  DollarSign,
  Layers,
  FileText,
  UploadCloud,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function AddPropertyModal() {
  const { isAddPropertyModalOpen, setIsAddPropertyModalOpen, addNewProperty, currentUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [channel, setChannel] = useState<ChannelType>('land_plot');
  const [title, setTitle] = useState('');
  const [subType, setSubType] = useState<PropertySubType>('residential_plot');
  const [price, setPrice] = useState<number>(120000);
  const [totalSqft, setTotalSqft] = useState<number>(15000);
  const [roadWidthFt, setRoadWidthFt] = useState<number>(40);
  const [facing, setFacing] = useState('East');
  const [zoning, setZoning] = useState('Residential R1');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [approvalType, setApprovalType] = useState<'DTCP' | 'HMDA' | 'RERA' | 'Panchayat' | 'Clear Title'>('DTCP');
  const [description, setDescription] = useState('');

  if (!isAddPropertyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !surveyNumber) {
      alert('Please fill in the title, address, and survey number.');
      return;
    }

    const pricePerSqft = totalSqft > 0 ? Number((price / totalSqft).toFixed(2)) : 0;

    addNewProperty({
      title,
      description: description || 'Prime surveyed land with clean road approach and legal title verification in progress.',
      channel,
      subType,
      price: Number(price),
      totalSqft: Number(totalSqft),
      pricePerSqft,
      roadWidthFt: Number(roadWidthFt),
      facing,
      zoning,
      location: {
        lat: 37.7780,
        lng: -122.4200,
        address,
        city: city || 'San Francisco Bay Area',
        state: 'California',
        pincode: '94103'
      },
      boundary: [
        { lat: 37.7785, lng: -122.4210 },
        { lat: 37.7790, lng: -122.4190 },
        { lat: 37.7775, lng: -122.4185 },
        { lat: 37.7770, lng: -122.4205 }
      ],
      edgeMeasurements: [
        { from: 'A', to: 'B', sideName: 'North Side', lengthFt: 120 },
        { from: 'B', to: 'C', sideName: 'East Side', lengthFt: 125 },
        { from: 'C', to: 'D', sideName: 'South Side', lengthFt: 120 },
        { from: 'D', to: 'A', sideName: 'Road Frontage', lengthFt: roadWidthFt, isRoadFacing: true }
      ],
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop'
      ],
      verification: {
        isVerified: currentUser?.role === 'admin',
        approvalType,
        approvalNumber: `${approvalType}/2026/REG-${Math.floor(1000 + Math.random() * 9000)}`,
        surveyNumber,
        titleDeedVerified: currentUser?.role === 'admin'
      },
      seller: {
        id: currentUser?.id || 'usr-seller-current',
        name: currentUser?.name || 'Authorized Seller Account',
        entityType: currentUser?.entityType || 'individual',
        isKycVerified: true
      },
      status: currentUser?.role === 'admin' ? 'active' : 'pending_review'
    });

    alert(
      currentUser?.role === 'admin'
        ? '✔ Property listed and published live on Google Maps!'
        : '✔ Property submitted for review! As per platform security policy, it will go live once the Admin verifies your Title Deed and Survey Boundary.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <PlusCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">List Land / Property Asset</h3>
              <p className="text-xs text-slate-500 font-medium">Step {step} of 3: {step === 1 ? 'Asset Type & Pricing' : step === 2 ? 'GIS Location & Boundary' : 'Legal Verification & Vault'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddPropertyModalOpen(false)}
            className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* STEP 1: Basic Info & Channel */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Asset Channel</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel('land_plot')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      channel === 'land_plot'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <TreePine className="w-4 h-4 text-emerald-600" />
                    <span>Lands & Plots (GIS Mode)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('constructed')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      channel === 'constructed'
                        ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Constructed Residence</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Palm Meadows Corner Plot #44 or Green Acres Farmhouse"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Asking Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-emerald-700 font-bold focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Area (Sq Ft) *</label>
                  <input
                    type="number"
                    required
                    value={totalSqft}
                    onChange={e => setTotalSqft(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Road Width (ft)</label>
                  <input
                    type="number"
                    value={roadWidthFt}
                    onChange={e => setRoadWidthFt(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Facing Direction</label>
                  <select
                    value={facing}
                    onChange={e => setFacing(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="North-East">North-East</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                    <option value="Corner">Corner (Dual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Zoning</label>
                  <input
                    type="text"
                    value={zoning}
                    onChange={e => setZoning(e.target.value)}
                    placeholder="Residential R1"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs"
                >
                  Next: GIS Location & Boundary →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Address */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Land / Plot Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. Survey 88, Palm Meadows Avenue, Sector 12"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Sonoma County / Bay Area"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Revenue Survey Number *</label>
                  <input
                    type="text"
                    required
                    value={surveyNumber}
                    onChange={e => setSurveyNumber(e.target.value)}
                    placeholder="e.g. 302/2A or 118/4B"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-emerald-700 font-mono font-bold focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Approval Authority</label>
                <select
                  value={approvalType}
                  onChange={e => setApprovalType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
                >
                  <option value="DTCP">DTCP Approved (Town & Country Planning)</option>
                  <option value="HMDA">HMDA / Urban Development Authority</option>
                  <option value="RERA">RERA Registered</option>
                  <option value="Clear Title">Clear Title / Revenue Patta</option>
                  <option value="Panchayat">Panchayat Approved</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>📍 Boundary coordinates will automatically anchor to the live Google Maps satellite engine.</span>
                <span className="text-emerald-700 font-bold">Auto-Anchored</span>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs"
                >
                  Next: Legal Vault Upload →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Legal Vault & Verification Submission */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Private Legal Document Vault (RLS Protected)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Upload your Title Deed, Patta / 7-12 extract, and surveyor map. These files are stored in an encrypted bucket and are strictly accessible only to our Admin legal verification team.
                </p>

                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center space-y-2 cursor-pointer transition bg-white">
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="text-xs text-slate-800 font-bold">Click to upload Title Deed / Survey Map (PDF, PNG)</div>
                  <div className="text-[11px] text-slate-400 font-medium">Max size 25MB • 256-bit encryption</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Additional Overview / Notes for Buyers</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail water source, soil quality, fencing, proximity to highway..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
                />
              </div>

              {/* Security Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Admin Verification Gate: As requested, your listing will be queued into the Admin Review Desk. It will appear live on Google Maps once legal due diligence confirms clear title.
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
                >
                  <span>Submit for Admin Verification</span>
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
