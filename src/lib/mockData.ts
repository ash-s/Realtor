import { Property, DealTicket, KycRecord } from '@/types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Ananya Palm Meadows DTCP Plotted Township',
    description: 'Premier DTCP & TNRERA approved gated plotted township situated along the rapid Guduvanchery–Chengalpattu growth corridor. Features 40-ft wide blacktop roads, underground EB infrastructure, continuous potable water points, 24/7 security arch, landscaped avenue plantation, and clear marketable title. Just 10 minutes from Kilambakkam KCBT bus terminus and GST Road.',
    channel: 'land_plot',
    subType: 'residential_plot',
    price: 4800000,
    totalSqft: 38400,
    pricePerSqft: 2000,
    roadWidthFt: 40,
    facing: 'North-East',
    zoning: 'Residential Plotted (DTCP Sanctioned)',
    location: {
      lat: 12.8420,
      lng: 80.0650,
      address: 'Survey No. 302/2A, GST Road Extension, Guduvanchery',
      city: 'Chengalpattu (Chennai Suburbs)',
      state: 'Tamil Nadu',
      pincode: '603202'
    },
    boundary: [
      { lat: 12.8428, lng: 80.0642 },
      { lat: 12.8431, lng: 80.0658 },
      { lat: 12.8415, lng: 80.0661 },
      { lat: 12.8412, lng: 80.0645 }
    ],
    edgeMeasurements: [
      { from: 'Point A', to: 'Point B', sideName: 'North Boundary', lengthFt: 180 },
      { from: 'Point B', to: 'Point C', sideName: 'East Boundary', lengthFt: 220 },
      { from: 'Point C', to: 'Point D', sideName: 'South Boundary', lengthFt: 190 },
      { from: 'Point D', to: 'Point A', sideName: '40ft Approach Road Frontage', lengthFt: 200, isRoadFacing: true }
    ],
    isVentureLayout: true,
    ventureName: 'Ananya Palm Meadows Township',
    venturePlots: [
      { id: 'vp-101', plotNumber: '101', sqft: 2400, price: 4800000, status: 'available', facing: 'North-East', dimensions: '30x80 ft' },
      { id: 'vp-102', plotNumber: '102', sqft: 1800, price: 3600000, status: 'available', facing: 'East', dimensions: '30x60 ft' },
      { id: 'vp-103', plotNumber: '103', sqft: 3000, price: 6000000, status: 'reserved', facing: 'Corner', dimensions: '50x60 ft' },
      { id: 'vp-104', plotNumber: '104', sqft: 2400, price: 4800000, status: 'sold', facing: 'North', dimensions: '30x80 ft' },
      { id: 'vp-105', plotNumber: '105', sqft: 1500, price: 3000000, status: 'available', facing: 'West', dimensions: '30x50 ft' },
      { id: 'vp-106', plotNumber: '106', sqft: 1500, price: 3000000, status: 'sold', facing: 'West', dimensions: '30x50 ft' },
      { id: 'vp-107', plotNumber: '107', sqft: 2100, price: 4200000, status: 'available', facing: 'South', dimensions: '35x60 ft' },
      { id: 'vp-108', plotNumber: '108', sqft: 3600, price: 7200000, status: 'available', facing: 'Corner', dimensions: '60x60 ft' },
      { id: 'vp-109', plotNumber: '109', sqft: 2400, price: 4800000, status: 'available', facing: 'East', dimensions: '30x80 ft' },
      { id: 'vp-110', plotNumber: '110', sqft: 1800, price: 3600000, status: 'available', facing: 'North', dimensions: '30x60 ft' },
      { id: 'vp-111', plotNumber: '111', sqft: 2400, price: 4800000, status: 'reserved', facing: 'East', dimensions: '30x80 ft' },
      { id: 'vp-112', plotNumber: '112', sqft: 3000, price: 6000000, status: 'available', facing: 'Corner', dimensions: '50x60 ft' },
      { id: 'vp-113', plotNumber: '113', sqft: 2000, price: 4000000, status: 'available', facing: 'North', dimensions: '40x50 ft' },
      { id: 'vp-114', plotNumber: '114', sqft: 1500, price: 3000000, status: 'sold', facing: 'South', dimensions: '30x50 ft' },
      { id: 'vp-115', plotNumber: '115', sqft: 2400, price: 4800000, status: 'available', facing: 'East', dimensions: '30x80 ft' },
      { id: 'vp-116', plotNumber: '116', sqft: 3200, price: 6400000, status: 'available', facing: 'Corner', dimensions: '40x80 ft' }
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'DTCP',
      approvalNumber: 'DTCP/TN/2026/LP-492',
      surveyNumber: '302/2A (Patta #1842)',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-dev-1',
      name: 'Srinivasan Developers (TN DTCP Promoter)',
      entityType: 'company',
      isKycVerified: true
    },
    status: 'active',
    featured: true,
    createdAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'prop-2',
    title: 'Western Ghats Foothills Organic Farmhouse Land',
    description: 'Spectacular fertile 1-Acre agricultural & agro-tourism parcel with panoramic vistas of the Anaimalai Western Ghats hills. Fully secured perimeter, perennial sweet groundwater with 2.5-inch operational borewell, free agricultural EB service connection, 30-ft tar road access, and coconut/teak plantation on rich organic red soil.',
    channel: 'land_plot',
    subType: 'farmhouse_land',
    price: 9200000,
    totalSqft: 43560, // 1 Acre
    pricePerSqft: 211.2,
    roadWidthFt: 30,
    facing: 'East',
    zoning: 'Agricultural / Agro-Tourism Eligible',
    location: {
      lat: 10.6625,
      lng: 77.0125,
      address: 'Survey No. 118/4B, Pollachi-Valparai Highway Corridor',
      city: 'Pollachi (Coimbatore District)',
      state: 'Tamil Nadu',
      pincode: '642001'
    },
    boundary: [
      { lat: 10.6632, lng: 77.0118 },
      { lat: 10.6636, lng: 77.0135 },
      { lat: 10.6618, lng: 77.0132 },
      { lat: 10.6614, lng: 77.0115 }
    ],
    edgeMeasurements: [
      { from: 'P1', to: 'P2', sideName: 'North Boundary', lengthFt: 210 },
      { from: 'P2', to: 'P3', sideName: 'East Canal Border', lengthFt: 220 },
      { from: 'P3', to: 'P4', sideName: 'South Boundary', lengthFt: 200 },
      { from: 'P4', to: 'P1', sideName: '30ft Road Access', lengthFt: 215, isRoadFacing: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'Clear Title',
      approvalNumber: 'REV/TN/CBE-7-12-884',
      surveyNumber: '118/4B (Patta #429)',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-seller-2',
      name: 'Dr. R. Natarajan (Individual Patta Owner)',
      entityType: 'individual',
      isKycVerified: true
    },
    status: 'active',
    featured: true,
    createdAt: '2026-09-24T14:30:00Z'
  },
  {
    id: 'prop-3',
    title: 'The Azure Sands Oceanfront Luxury Villa',
    description: 'Palatial 6,200 sq ft sea-facing architectural masterpiece located along premier Akkarai on Chennai’s coveted East Coast Road (ECR). Features floor-to-ceiling panoramic glass, private heated infinity pool, Italian statuario marble floors, 5 lavish ensuite master bedrooms, private internal Otis elevator, rooftop sunset deck, and direct private beach access.',
    channel: 'constructed',
    subType: 'luxury_villa',
    price: 48500000,
    totalSqft: 6200,
    pricePerSqft: 7822.58,
    roadWidthFt: 50,
    facing: 'East (Ocean Facing)',
    zoning: 'Residential Beachfront Luxury (CMDA Approved)',
    location: {
      lat: 12.9050,
      lng: 80.2520,
      address: '18 Sea Cliff Avenue, Akkarai, ECR',
      city: 'Chennai (ECR Coastal Belt)',
      state: 'Tamil Nadu',
      pincode: '600119'
    },
    boundary: [
      { lat: 12.9055, lng: 80.2514 },
      { lat: 12.9058, lng: 80.2528 },
      { lat: 12.9044, lng: 80.2526 },
      { lat: 12.9042, lng: 80.2512 }
    ],
    edgeMeasurements: [
      { from: 'V1', to: 'V2', sideName: 'North Boundary', lengthFt: 140 },
      { from: 'V2', to: 'V3', sideName: 'Beachfront Facing', lengthFt: 160 },
      { from: 'V3', to: 'V4', sideName: 'South Boundary', lengthFt: 140 },
      { from: 'V4', to: 'V1', sideName: '50ft Access Road', lengthFt: 155, isRoadFacing: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'CMDA',
      approvalNumber: 'CMDA/PP/MSB/2025/088',
      surveyNumber: '88/1 (Patta #1204)',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-broker-1',
      name: 'Apex Southern Luxury Realty (TNRERA Agent)',
      entityType: 'broker',
      isKycVerified: true
    },
    status: 'active',
    featured: true,
    createdAt: '2026-09-28T09:15:00Z'
  },
  {
    id: 'prop-4',
    title: 'Siruseri IT Expressway Commercial Tech Park Plot',
    description: 'High-visibility 2.2 Acre prime commercial land parcel directly fronting the 6-lane Rajiv Gandhi Salai (OMR IT Expressway), adjacent to Siruseri SIPCOT IT SEZ and upcoming Metro Phase 2 station. Sanctioned with CMDA commercial zoning for Grade-A IT/ITES tech parks, corporate headquarters, or multi-specialty healthcare.',
    channel: 'land_plot',
    subType: 'commercial_plot',
    price: 145000000,
    totalSqft: 95832,
    pricePerSqft: 1513.06,
    roadWidthFt: 120,
    facing: 'North-East (120-ft OMR Frontage)',
    zoning: 'Commercial / IT High Density (CMDA Approved)',
    location: {
      lat: 12.8350,
      lng: 80.2220,
      address: 'Plot #14, OMR IT Expressway Corridor, Siruseri SIPCOT',
      city: 'Chennai (OMR IT Corridor)',
      state: 'Tamil Nadu',
      pincode: '603103'
    },
    boundary: [
      { lat: 12.8360, lng: 80.2210 },
      { lat: 12.8365, lng: 80.2235 },
      { lat: 12.8340, lng: 80.2230 },
      { lat: 12.8335, lng: 80.2205 }
    ],
    edgeMeasurements: [
      { from: 'C1', to: 'C2', sideName: 'North Boundary', lengthFt: 350 },
      { from: 'C2', to: 'C3', sideName: 'East Commercial Border', lengthFt: 280 },
      { from: 'C3', to: 'C4', sideName: 'South Boundary', lengthFt: 340 },
      { from: 'C4', to: 'C1', sideName: '120ft Highway Frontage', lengthFt: 290, isRoadFacing: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'CMDA',
      approvalNumber: 'CMDA-COM-TN-2026-771',
      surveyNumber: '442/A (Patta #3108)',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-dev-2',
      name: 'Tamil Nadu Infrastructure & Realty Ltd',
      entityType: 'company',
      isKycVerified: true
    },
    status: 'active',
    featured: true,
    createdAt: '2026-10-01T11:00:00Z'
  }
];

export const INITIAL_DEAL_TICKETS: DealTicket[] = [
  {
    id: 'deal-001',
    propertyId: 'prop-1',
    propertyTitle: 'Ananya Palm Meadows DTCP Plotted Township',
    plotNumber: 'Plot #103',
    channel: 'land_plot',
    buyerName: 'Karthik Subramanian (NRI Investor)',
    buyerPhone: '+91 98401 22934',
    buyerEmail: 'karthik.subramanian@chennaicapital.com',
    buyerMessage: 'Hello Admin, I would like to arrange an escorted site inspection for Plot #103 this Saturday. Please confirm the licensed cadastral surveyor availability and DTCP sanction drawings.',
    messages: [
      {
        id: 'msg-001',
        senderRole: 'buyer',
        senderName: 'Karthik Subramanian',
        text: 'Hello Admin, I would like to arrange an escorted site inspection for Plot #103 this Saturday. Please confirm the licensed cadastral surveyor availability and DTCP sanction drawings.',
        timestamp: '2026-10-02T16:20:00Z'
      },
      {
        id: 'msg-002',
        senderRole: 'admin',
        senderName: 'Sarah Jenkins (Admin Concierge)',
        text: 'Vanakkam Karthik! Site survey confirmed for Saturday 10:30 AM at Guduvanchery. Cadastral surveyor #104 will meet you at the site with GPS boundary instruments and Patta records.',
        timestamp: '2026-10-03T09:00:00Z'
      }
    ],
    offerPrice: 5800000,
    commissionRate: 2.0,
    stage: 'site_visit_scheduled',
    scheduledVisitDate: '2026-10-08T10:30:00Z',
    adminNotes: 'Buyer wants an on-site physical survey inspection with in-house broker. Verified pre-approved HDFC Bank home/plot loan.',
    createdAt: '2026-10-02T16:20:00Z'
  },
  {
    id: 'deal-002',
    propertyId: 'prop-3',
    propertyTitle: 'The Azure Sands Oceanfront Luxury Villa',
    channel: 'constructed',
    buyerName: 'Ananya Ramachandran',
    buyerPhone: '+91 94440 88712',
    buyerEmail: 'ananya.ramachandran@ecrvip.org',
    buyerMessage: 'Can you please provide the 30-year Encumbrance Certificate (EC) from Neelankarai Sub-Registrar Office and verify the CMDA title deed before I place the token escrow?',
    messages: [
      {
        id: 'msg-003',
        senderRole: 'buyer',
        senderName: 'Ananya Ramachandran',
        text: 'Can you please provide the 30-year Encumbrance Certificate (EC) from Neelankarai Sub-Registrar Office and verify the CMDA title deed before I place the token escrow?',
        timestamp: '2026-10-03T11:45:00Z'
      }
    ],
    offerPrice: 48000000,
    commissionRate: 1.5,
    stage: 'legal_verification',
    scheduledVisitDate: '2026-10-06T15:00:00Z',
    adminNotes: 'Title search report requested. Legal team is reviewing 30-year EC from Neelankarai SRO and verifying Coastal Regulation Zone (CRZ) clearances.',
    createdAt: '2026-10-03T11:45:00Z'
  }
];

export const INITIAL_KYC_RECORDS: KycRecord[] = [
  {
    id: 'kyc-101',
    userId: 'usr-broker-99',
    userName: 'M. Senthil Kumar',
    entityType: 'broker',
    idType: 'rera_license',
    idNumber: 'TNRERA/AGENT/2026/0412',
    documentUrl: 'https://vault.internal/kyc/tnrera_senthil_2026.pdf',
    status: 'pending',
    submittedAt: '2026-10-03T18:00:00Z'
  },
  {
    id: 'kyc-102',
    userId: 'usr-seller-42',
    userName: 'Priya Sundaram',
    entityType: 'individual',
    idType: 'aadhaar',
    idNumber: 'XXXX-XXXX-8921',
    documentUrl: 'https://vault.internal/kyc/govt_id_priya.pdf',
    status: 'verified',
    submittedAt: '2026-09-30T12:00:00Z'
  }
];
