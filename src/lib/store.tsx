'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, DealTicket, KycRecord, ChannelType, UserRole, EntityType, PlotStatus, DealStage } from '@/types';
import { INITIAL_PROPERTIES, INITIAL_DEAL_TICKETS, INITIAL_KYC_RECORDS } from './mockData';
import confetti from 'canvas-confetti';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  entityType: EntityType;
  avatar: string;
  isKycVerified: boolean;
}

interface AppContextType {
  // Authentication & Session
  currentUser: UserSession | null;
  login: (role: UserRole, entityType: EntityType, customName?: string) => void;
  logout: () => void;
  
  // Channels
  activeChannel: ChannelType;
  setActiveChannel: (channel: ChannelType) => void;

  // Property Data & Selection
  properties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  selectedVenturePlotId: string | null;
  setSelectedVenturePlotId: (plotId: string | null) => void;
  
  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubType: string;
  setSelectedSubType: (subType: string) => void;

  // Modals
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  isAddPropertyModalOpen: boolean;
  setIsAddPropertyModalOpen: (open: boolean) => void;
  isDealModalOpen: boolean;
  setIsDealModalOpen: (open: boolean) => void;
  isKycModalOpen: boolean;
  setIsKycModalOpen: (open: boolean) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  contactProperty: Property | null;
  setContactProperty: (prop: Property | null) => void;

  // Actions
  addNewProperty: (newProp: Omit<Property, 'id' | 'createdAt'>) => void;
  createDealTicket: (data: {
    propertyId: string;
    propertyTitle: string;
    plotNumber?: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
    buyerMessage?: string;
    offerPrice: number;
    scheduledDate?: string;
  }) => void;
  contactAdmin: (data: {
    propertyId?: string;
    propertyTitle?: string;
    plotNumber?: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail?: string;
    message: string;
    scheduledDate?: string;
    offerPrice?: number;
  }) => void;
  sendAdminReply: (dealId: string, replyText: string) => void;
  sendBuyerMessage: (dealId: string, text: string) => void;
  updateDealStage: (dealId: string, stage: DealStage) => void;
  updatePlotStatus: (propertyId: string, plotId: string, status: PlotStatus) => void;
  submitKyc: (data: { name: string; entityType: EntityType; idType: any; idNumber: string }) => void;
  approveKyc: (kycId: string) => void;
  rejectKyc: (kycId: string) => void;
  togglePropertyVerification: (propertyId: string) => void;
  togglePropertyFeatured: (propertyId: string) => void;
  updateDealDetails: (dealId: string, updates: Partial<DealTicket>) => void;
  deleteDealTicket: (dealId: string) => void;

  // Deals & KYC
  dealTickets: DealTicket[];
  kycRecords: KycRecord[];
  activeDealsCount: number;
  unreadAdminMessagesCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Default session as Buyer for immediate exploration
  const [currentUser, setCurrentUser] = useState<UserSession | null>({
    id: 'usr-buyer-1',
    name: 'Alexander Wright',
    email: 'alex.wright@investor.com',
    role: 'buyer',
    entityType: 'individual',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isKycVerified: true
  });

  const [activeChannel, setActiveChannel] = useState<ChannelType>('land_plot');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(INITIAL_PROPERTIES[0]);
  const [selectedVenturePlotId, setSelectedVenturePlotId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('all');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactProperty, setContactProperty] = useState<Property | null>(null);

  const [dealTickets, setDealTickets] = useState<DealTicket[]>(INITIAL_DEAL_TICKETS);
  const [kycRecords, setKycRecords] = useState<KycRecord[]>(INITIAL_KYC_RECORDS);

  // Authentication Login Handler
  const login = (role: UserRole, entityType: EntityType, customName?: string) => {
    let name = customName || 'User';
    let email = 'user@plotterra.com';
    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop';

    if (role === 'admin') {
      name = 'Sarah Jenkins (Admin Concierge)';
      email = 'admin@plotterra.com';
      avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop';
    } else if (role === 'seller') {
      if (entityType === 'company') {
        name = 'Terraform Developers Corp';
        email = 'developer@terraform.com';
      } else if (entityType === 'broker') {
        name = 'Apex Realty Partners (Licensed Broker)';
        email = 'broker@apexrealty.com';
      } else {
        name = 'Robert Hastings (Direct Land Owner)';
        email = 'robert@landowner.com';
      }
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop';
    } else {
      name = customName || 'David Vance (Buyer)';
      email = 'david.vance@buyer.com';
    }

    setCurrentUser({
      id: `usr-${role}-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role,
      entityType,
      avatar,
      isKycVerified: true
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Add new property
  const addNewProperty = (newProp: Omit<Property, 'id' | 'createdAt'>) => {
    const created: Property = {
      ...newProp,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProperties(prev => [created, ...prev]);
    setSelectedProperty(created);
    setIsAddPropertyModalOpen(false);
  };

  // Create deal ticket (Admin Concierge mediation)
  // Create deal ticket (Admin Concierge mediation)
  const createDealTicket = (data: {
    propertyId: string;
    propertyTitle: string;
    plotNumber?: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
    buyerMessage?: string;
    offerPrice: number;
    scheduledDate?: string;
  }) => {
    const newDealId = `deal-${Date.now().toString().slice(-4)}`;
    const newDeal: DealTicket = {
      id: newDealId,
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle,
      plotNumber: data.plotNumber,
      channel: activeChannel,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      buyerEmail: data.buyerEmail,
      buyerMessage: data.buyerMessage,
      messages: data.buyerMessage
        ? [
            {
              id: `msg-${Date.now()}`,
              senderRole: 'buyer',
              senderName: data.buyerName,
              text: data.buyerMessage,
              timestamp: new Date().toISOString()
            }
          ]
        : [],
      offerPrice: data.offerPrice,
      commissionRate: 2.0,
      stage: 'new_lead',
      scheduledVisitDate: data.scheduledDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      adminNotes: data.buyerMessage
        ? `[Inquiry Message Received]: "${data.buyerMessage}"`
        : 'Inquiry received via portal. Seller phone protected. Admin assigned to coordinate meeting.',
      createdAt: new Date().toISOString()
    };

    setDealTickets(prev => [newDeal, ...prev]);
    setIsDealModalOpen(false);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }
  };

  // Direct Contact Admin Handler
  const contactAdmin = (data: {
    propertyId?: string;
    propertyTitle?: string;
    plotNumber?: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail?: string;
    message: string;
    scheduledDate?: string;
    offerPrice?: number;
  }) => {
    const newDealId = `deal-${Date.now().toString().slice(-4)}`;
    const newDeal: DealTicket = {
      id: newDealId,
      propertyId: data.propertyId || 'inquiry-general',
      propertyTitle: data.propertyTitle || 'Direct Admin Concierge Inquiry',
      plotNumber: data.plotNumber,
      channel: activeChannel,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      buyerEmail: data.buyerEmail || 'buyer@verified.com',
      buyerMessage: data.message,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'buyer',
          senderName: data.buyerName,
          text: data.message,
          timestamp: new Date().toISOString()
        }
      ],
      offerPrice: data.offerPrice || 0,
      commissionRate: 2.0,
      stage: 'new_lead',
      scheduledVisitDate: data.scheduledDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      adminNotes: `[Direct Message from Buyer]: "${data.message}"`,
      createdAt: new Date().toISOString()
    };

    setDealTickets(prev => [newDeal, ...prev]);
    setIsContactModalOpen(false);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  // Send Admin Reply to Buyer
  const sendAdminReply = (dealId: string, replyText: string) => {
    const replyItem = {
      id: `msg-${Date.now()}`,
      senderRole: 'admin' as const,
      senderName: currentUser?.name || 'Sarah Jenkins (Admin Concierge)',
      text: replyText,
      timestamp: new Date().toISOString()
    };

    setDealTickets(prev =>
      prev.map(d => {
        if (d.id !== dealId) return d;
        return {
          ...d,
          stage: d.stage === 'new_lead' ? 'contacted' : d.stage,
          messages: [...(d.messages || []), replyItem],
          adminNotes: `${d.adminNotes ? d.adminNotes + '\n' : ''}[Admin Replied]: ${replyText}`
        };
      })
    );
  };

  // Send Buyer Message in thread
  const sendBuyerMessage = (dealId: string, text: string) => {
    const msgItem = {
      id: `msg-${Date.now()}`,
      senderRole: 'buyer' as const,
      senderName: currentUser?.name || 'Buyer',
      text,
      timestamp: new Date().toISOString()
    };

    setDealTickets(prev =>
      prev.map(d => {
        if (d.id !== dealId) return d;
        return {
          ...d,
          messages: [...(d.messages || []), msgItem]
        };
      })
    );
  };

  // Update deal stage
  const updateDealStage = (dealId: string, stage: DealStage) => {
    setDealTickets(prev =>
      prev.map(d => (d.id === dealId ? { ...d, stage } : d))
    );

    if (stage === 'closed') {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  // Update status of specific venture plot
  const updatePlotStatus = (propertyId: string, plotId: string, status: PlotStatus) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id !== propertyId || !p.venturePlots) return p;
        return {
          ...p,
          venturePlots: p.venturePlots.map(vp => (vp.id === plotId ? { ...vp, status } : vp))
        };
      })
    );
  };

  // Submit KYC
  const submitKyc = (data: { name: string; entityType: EntityType; idType: any; idNumber: string }) => {
    const record: KycRecord = {
      id: `kyc-${Date.now().toString().slice(-3)}`,
      userId: currentUser?.id || `usr-${Date.now()}`,
      userName: data.name,
      entityType: data.entityType,
      idType: data.idType,
      idNumber: data.idNumber,
      documentUrl: 'https://vault.internal/private/kyc_doc.pdf',
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setKycRecords(prev => [record, ...prev]);
    setIsKycModalOpen(false);
  };

  // Approve KYC
  const approveKyc = (kycId: string) => {
    setKycRecords(prev =>
      prev.map(k => (k.id === kycId ? { ...k, status: 'verified' } : k))
    );
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, isKycVerified: true } : null);
    }
  };

  const rejectKyc = (kycId: string) => {
    setKycRecords(prev =>
      prev.map(k => (k.id === kycId ? { ...k, status: 'rejected' } : k))
    );
  };

  const togglePropertyVerification = (propertyId: string) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id !== propertyId) return p;
        return {
          ...p,
          verification: {
            ...p.verification,
            isVerified: !p.verification.isVerified
          }
        };
      })
    );
  };

  const togglePropertyFeatured = (propertyId: string) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id !== propertyId) return p;
        return {
          ...p,
          featured: !p.featured
        };
      })
    );
  };

  const updateDealDetails = (dealId: string, updates: Partial<DealTicket>) => {
    setDealTickets(prev =>
      prev.map(d => (d.id === dealId ? { ...d, ...updates } : d))
    );
  };

  const deleteDealTicket = (dealId: string) => {
    setDealTickets(prev => prev.filter(d => d.id !== dealId));
  };

  const activeDealsCount = dealTickets.filter(d => d.stage !== 'closed' && d.stage !== 'cancelled').length;

  const unreadAdminMessagesCount = dealTickets.filter(
    d => d.stage === 'new_lead' || (d.messages && d.messages.length > 0 && d.messages[d.messages.length - 1].senderRole === 'buyer')
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        activeChannel,
        setActiveChannel,
        properties,
        selectedProperty,
        setSelectedProperty,
        selectedVenturePlotId,
        setSelectedVenturePlotId,
        searchQuery,
        setSearchQuery,
        selectedSubType,
        setSelectedSubType,
        isDetailModalOpen,
        setIsDetailModalOpen,
        isAddPropertyModalOpen,
        setIsAddPropertyModalOpen,
        isDealModalOpen,
        setIsDealModalOpen,
        isKycModalOpen,
        setIsKycModalOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        contactProperty,
        setContactProperty,
        addNewProperty,
        createDealTicket,
        contactAdmin,
        sendAdminReply,
        sendBuyerMessage,
        updateDealStage,
        updatePlotStatus,
        submitKyc,
        approveKyc,
        rejectKyc,
        togglePropertyVerification,
        togglePropertyFeatured,
        updateDealDetails,
        deleteDealTicket,
        dealTickets,
        kycRecords,
        activeDealsCount,
        unreadAdminMessagesCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
