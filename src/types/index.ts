export type UserRole = 'admin' | 'seller' | 'buyer';
export type EntityType = 'individual' | 'broker' | 'company';
export type ChannelType = 'land_plot' | 'constructed';

export type PropertySubType =
  | 'residential_plot'
  | 'agricultural_land'
  | 'commercial_plot'
  | 'farmhouse_land'
  | 'industrial_plot'
  | 'luxury_villa'
  | 'penthouse'
  | 'apartment'
  | 'commercial_building';

export type PlotStatus = 'available' | 'reserved' | 'sold';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface EdgeMeasurement {
  from: string;
  to: string;
  sideName: string;
  lengthFt: number;
  isRoadFacing?: boolean;
}

export interface VenturePlot {
  id: string;
  plotNumber: string;
  sqft: number;
  price: number;
  status: PlotStatus;
  facing: 'East' | 'West' | 'North' | 'South' | 'North-East' | 'Corner';
  dimensions: string; // e.g. "30x60 ft"
}

export interface Property {
  id: string;
  title: string;
  description: string;
  channel: ChannelType;
  subType: PropertySubType;
  price: number;
  totalSqft: number;
  pricePerSqft: number;
  roadWidthFt: number;
  facing: string;
  zoning: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  boundary: LatLng[];
  edgeMeasurements?: EdgeMeasurement[];
  isVentureLayout?: boolean;
  ventureName?: string;
  venturePlots?: VenturePlot[];
  images: string[];
  droneVideoUrl?: string;
  verification: {
    isVerified: boolean;
    approvalType: 'DTCP' | 'HMDA' | 'RERA' | 'Panchayat' | 'Clear Title';
    approvalNumber: string;
    surveyNumber: string;
    titleDeedVerified: boolean;
  };
  seller: {
    id: string;
    name: string;
    entityType: EntityType;
    isKycVerified: boolean;
  };
  status: 'active' | 'pending_review' | 'under_negotiation' | 'sold';
  featured?: boolean;
  createdAt: string;
}

export type DealStage =
  | 'new_lead'
  | 'contacted'
  | 'site_visit_scheduled'
  | 'legal_verification'
  | 'token_escrow'
  | 'closed'
  | 'cancelled';

export interface MessageItem {
  id: string;
  senderRole: 'buyer' | 'admin' | 'seller';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface DealTicket {
  id: string;
  propertyId: string;
  propertyTitle: string;
  plotNumber?: string;
  channel: ChannelType;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerMessage?: string;
  messages?: MessageItem[];
  offerPrice: number;
  commissionRate: number; // e.g., 2.0%
  stage: DealStage;
  scheduledVisitDate?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface KycRecord {
  id: string;
  userId: string;
  userName: string;
  entityType: EntityType;
  idType: 'aadhaar' | 'passport' | 'rera_license' | 'company_registration';
  idNumber: string;
  documentUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}
