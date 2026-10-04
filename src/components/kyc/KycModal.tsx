'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { X, ShieldCheck, UserCheck, UploadCloud, Lock, CheckCircle2 } from 'lucide-react';
import { EntityType } from '@/types';

export default function KycModal() {
  const { isKycModalOpen, setIsKycModalOpen, submitKyc } = useApp();

  const [name, setName] = useState('');
  const [entityType, setEntityType] = useState<EntityType>('individual');
  const [idType, setIdType] = useState<'aadhaar' | 'passport' | 'rera_license' | 'company_registration'>('aadhaar');
  const [idNumber, setIdNumber] = useState('');

  if (!isKycModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !idNumber) {
      alert('Please fill in your name and identification number.');
      return;
    }

    submitKyc({
      name,
      entityType,
      idType,
      idNumber
    });

    alert('✔ KYC Submitted! Seller Portal is temporarily unlocked for demo verification.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Seller KYC Verification</h3>
              <p className="text-xs text-slate-500 font-medium">Government ID & License Verification</p>
            </div>
          </div>

          <button
            onClick={() => setIsKycModalOpen(false)}
            className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Entity Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['individual', 'broker', 'company'] as EntityType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEntityType(type)}
                  className={`py-2 rounded-xl border text-center font-bold capitalize transition ${
                    entityType === type
                      ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Legal Name / Firm Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe / Apex Real Estate LLC"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Identification Document Type</label>
            <select
              value={idType}
              onChange={e => setIdType(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 text-xs font-medium"
            >
              <option value="aadhaar">National ID / Aadhaar</option>
              <option value="passport">Passport</option>
              <option value="rera_license">Real Estate Broker / RERA License</option>
              <option value="company_registration">Certificate of Incorporation / Tax ID</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">ID / License Registration Number *</label>
            <input
              type="text"
              required
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              placeholder="e.g. RERA-2026-88192 or ID #4928"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-emerald-700 font-mono font-bold focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 font-medium">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Your identity proof is encrypted in our Private Vault. Once verified by our Admin team, you will receive authorized seller listing privileges.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition"
          >
            Submit KYC & Unlock Seller Portal
          </button>

        </form>

      </div>
    </div>
  );
}
