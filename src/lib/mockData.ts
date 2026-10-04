import { Property, DealTicket, KycRecord } from '@/types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Palm Valley Gated Venture (Phase 1)',
    description: 'Premier DTCP approved plotted venture with 40 ft tar roads, underground electricity, borewell water points, and compound wall. Ideal for immediate villa construction or high-return land banking.',
    channel: 'land_plot',
    subType: 'residential_plot',
    price: 145000,
    totalSqft: 19800,
    pricePerSqft: 7.32,
    roadWidthFt: 40,
    facing: 'North-East',
    zoning: 'Residential (R1 Plotted)',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Plot #414, Palm Valley Venture, Sector 12',
      city: 'San Francisco Bay Area',
      state: 'California',
      pincode: '94103'
    },
    boundary: [
      { lat: 37.7755, lng: -122.4202 },
      { lat: 37.7758, lng: -122.4185 },
      { lat: 37.7742, lng: -122.4182 },
      { lat: 37.7740, lng: -122.4199 }
    ],
    edgeMeasurements: [
      { from: 'Point A', to: 'Point B', sideName: 'North Side', lengthFt: 140 },
      { from: 'Point B', to: 'Point C', sideName: 'East Side', lengthFt: 180 },
      { from: 'Point C', to: 'Point D', sideName: 'South Side', lengthFt: 150 },
      { from: 'Point D', to: 'Point A', sideName: 'Road Frontage', lengthFt: 160, isRoadFacing: true }
    ],
    isVentureLayout: true,
    ventureName: 'Palm Valley Plotted Township',
    venturePlots: [
      { id: 'vp-101', plotNumber: '101', sqft: 2400, price: 48000, status: 'available', facing: 'North-East', dimensions: '30x80 ft' },
      { id: 'vp-102', plotNumber: '102', sqft: 1800, price: 36000, status: 'available', facing: 'East', dimensions: '30x60 ft' },
      { id: 'vp-103', plotNumber: '103', sqft: 3000, price: 60000, status: 'reserved', facing: 'Corner', dimensions: '50x60 ft' },
      { id: 'vp-104', plotNumber: '104', sqft: 2400, price: 48000, status: 'sold', facing: 'North', dimensions: '30x80 ft' },
      { id: 'vp-105', plotNumber: '105', sqft: 1500, price: 30000, status: 'available', facing: 'West', dimensions: '30x50 ft' },
      { id: 'vp-106', plotNumber: '106', sqft: 1500, price: 30000, status: 'sold', facing: 'West', dimensions: '30x50 ft' },
      { id: 'vp-107', plotNumber: '107', sqft: 2100, price: 42000, status: 'available', facing: 'South', dimensions: '35x60 ft' },
      { id: 'vp-108', plotNumber: '108', sqft: 3600, price: 72000, status: 'available', facing: 'Corner', dimensions: '60x60 ft' },
      { id: 'vp-109', plotNumber: '109', sqft: 2400, price: 48000, status: 'available', facing: 'East', dimensions: '30x80 ft' },
      { id: 'vp-110', plotNumber: '110', sqft: 1800, price: 36000, status: 'available', facing: 'North', dimensions: '30x60 ft' },
      { id: 'vp-111', plotNumber: '111', sqft: 2400, price: 48000, status: 'reserved', facing: 'East', dimensions: '30x80 ft' },
      { id: 'vp-112', plotNumber: '112', sqft: 3000, price: 60000, status: 'available', facing: 'Corner', dimensions: '50x60 ft' },
      { id: 'vp-113', plotNumber: '113', sqft: 2000, price: 40000, status: 'available', facing: 'North', dimensions: '40x50 ft' },
      { id: 'vp-114', plotNumber: '114', sqft: 1500, price: 30000, status: 'sold', facing: 'South', dimensions: '30x50 ft' },
      { id: 'vp-115', plotNumber: '115', sqft: 2400, price: 48000, status: 'available', facing: 'East', dimensions: '30x80 ft' },
      { id: 'vp-116', plotNumber: '116', sqft: 3200, price: 64000, status: 'available', facing: 'Corner', dimensions: '40x80 ft' }
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'DTCP',
      approvalNumber: 'DTCP/2026/LP-492',
      surveyNumber: '302/2A',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-dev-1',
      name: 'Terraform Developers Corp',
      entityType: 'company',
      isKycVerified: true
    },
    status: 'active',
    featured: true,
    createdAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'prop-2',
    title: 'Emerald Ridge Farmhouse Land Parcel',
    description: 'Picturesque fertile agricultural & farmhouse parcel with perennial groundwater, 2.5-inch borewell, and 30-ft metalled approach road. Surrounded by teak trees and organic estates.',
    channel: 'land_plot',
    subType: 'farmhouse_land',
    price: 92000,
    totalSqft: 43560, // 1 Acre
    pricePerSqft: 2.11,
    roadWidthFt: 30,
    facing: 'East',
    zoning: 'Agricultural / Farmhouse Eligible',
    location: {
      lat: 37.7812,
      lng: -122.4285,
      address: 'Survey 118, Valley View Road',
      city: 'Sonoma Countryside',
      state: 'California',
      pincode: '94576'
    },
    boundary: [
      { lat: 37.7820, lng: -122.4295 },
      { lat: 37.7825, lng: -122.4270 },
      { lat: 37.7805, lng: -122.4265 },
      { lat: 37.7800, lng: -122.4290 }
    ],
    edgeMeasurements: [
      { from: 'P1', to: 'P2', sideName: 'North Boundary', lengthFt: 210 },
      { from: 'P2', to: 'P3', sideName: 'East Canal Border', lengthFt: 220 },
      { from: 'P3', to: 'P4', sideName: 'South Boundary', lengthFt: 200 },
      { from: 'P4', to: 'P1', sideName: 'Road Access', lengthFt: 215, isRoadFacing: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'Clear Title',
      approvalNumber: 'REV/SON/7-12-884',
      surveyNumber: '118/4B',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-seller-2',
      name: 'Robert Hastings (Individual Owner)',
      entityType: 'individual',
      isKycVerified: true
    },
    status: 'active',
    featured: true,
    createdAt: '2026-09-24T14:30:00Z'
  },
  {
    id: 'prop-3',
    title: 'The Obsidian Ultra-Luxury Modern Villa',
    description: 'Architectural masterpiece constructed over 6,200 sq ft. Features floor-to-ceiling glass, infinity swimming pool, Italian marble flooring, 5 ensuite bedrooms, and private elevator.',
    channel: 'constructed',
    subType: 'luxury_villa',
    price: 1850000,
    totalSqft: 6200,
    pricePerSqft: 298.38,
    roadWidthFt: 50,
    facing: 'North',
    zoning: 'Residential Ultra-Luxury',
    location: {
      lat: 37.7695,
      lng: -122.4468,
      address: '42 Obsidian Hillview Drive',
      city: 'San Francisco',
      state: 'California',
      pincode: '94114'
    },
    boundary: [
      { lat: 37.7700, lng: -122.4475 },
      { lat: 37.7702, lng: -122.4460 },
      { lat: 37.7690, lng: -122.4458 },
      { lat: 37.7688, lng: -122.4472 }
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'RERA',
      approvalNumber: 'RERA-CA-2025-0091',
      surveyNumber: '88/1',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-broker-1',
      name: 'Apex Luxury Estates (Authorized Broker)',
      entityType: 'broker',
      isKycVerified: true
    },
    status: 'active',
    featured: true,
    createdAt: '2026-09-28T09:15:00Z'
  },
  {
    id: 'prop-4',
    title: 'Silicon Vista Commercial Expressway Plot',
    description: 'High-visibility 2.2 Acre commercial land plot directly abutting the 100 ft 6-lane express corridor. Approved for IT tech park, commercial complex, or showroom development.',
    channel: 'land_plot',
    subType: 'commercial_plot',
    price: 520000,
    totalSqft: 95832,
    pricePerSqft: 5.42,
    roadWidthFt: 100,
    facing: 'North-East (Highway Facing)',
    zoning: 'Commercial High Density',
    location: {
      lat: 37.7850,
      lng: -122.4080,
      address: 'Expressway Gateway Sector 8',
      city: 'Silicon Valley Corridor',
      state: 'California',
      pincode: '94025'
    },
    boundary: [
      { lat: 37.7860, lng: -122.4095 },
      { lat: 37.7865, lng: -122.4065 },
      { lat: 37.7840, lng: -122.4060 },
      { lat: 37.7835, lng: -122.4090 }
    ],
    edgeMeasurements: [
      { from: 'C1', to: 'C2', sideName: 'North Boundary', lengthFt: 350 },
      { from: 'C2', to: 'C3', sideName: 'East Commercial Border', lengthFt: 280 },
      { from: 'C3', to: 'C4', sideName: 'South Boundary', lengthFt: 340 },
      { from: 'C4', to: 'C1', sideName: '100ft Highway Frontage', lengthFt: 290, isRoadFacing: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    verification: {
      isVerified: true,
      approvalType: 'HMDA',
      approvalNumber: 'HMDA-COM-2026-771',
      surveyNumber: '442/A',
      titleDeedVerified: true
    },
    seller: {
      id: 'usr-dev-2',
      name: 'Skyline Infrastructure Ltd',
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
    propertyTitle: 'Palm Valley Gated Venture (Phase 1)',
    plotNumber: 'Plot #103',
    channel: 'land_plot',
    buyerName: 'David Vance (Individual Investor)',
    buyerPhone: '+1 (555) 392-1084',
    buyerEmail: 'david.vance@investcapital.com',
    offerPrice: 58000,
    commissionRate: 2.0,
    stage: 'site_visit_scheduled',
    scheduledVisitDate: '2026-10-08T10:30:00Z',
    adminNotes: 'Buyer wants an on-site physical survey inspection with in-house broker. Verified pre-approved financing.',
    createdAt: '2026-10-02T16:20:00Z'
  },
  {
    id: 'deal-002',
    propertyId: 'prop-3',
    propertyTitle: 'The Obsidian Ultra-Luxury Modern Villa',
    channel: 'constructed',
    buyerName: 'Elena Rostova',
    buyerPhone: '+1 (555) 774-9921',
    buyerEmail: 'elena.rostova@vipestates.org',
    offerPrice: 1800000,
    commissionRate: 1.5,
    stage: 'legal_verification',
    scheduledVisitDate: '2026-10-06T15:00:00Z',
    adminNotes: 'Title search report requested. Legal team is reviewing encumbrance certificate (EC) from sub-registrar office.',
    createdAt: '2026-10-03T11:45:00Z'
  }
];

export const INITIAL_KYC_RECORDS: KycRecord[] = [
  {
    id: 'kyc-101',
    userId: 'usr-broker-99',
    userName: 'Marcus Sterling',
    entityType: 'broker',
    idType: 'rera_license',
    idNumber: 'RERA-CA-BRK-88192',
    documentUrl: 'https://vault.internal/kyc/rera_marcus_2026.pdf',
    status: 'pending',
    submittedAt: '2026-10-03T18:00:00Z'
  },
  {
    id: 'kyc-102',
    userId: 'usr-seller-42',
    userName: 'Priya Sharma',
    entityType: 'individual',
    idType: 'aadhaar',
    idNumber: 'XXXX-XXXX-8921',
    documentUrl: 'https://vault.internal/kyc/govt_id_priya.pdf',
    status: 'verified',
    submittedAt: '2026-09-30T12:00:00Z'
  }
];
