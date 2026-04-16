import { Deal } from '@/lib/types';

export const seedDeal: Deal = {
  id: 'deal-1001',
  activityId: 'ACT-MF-2026-0042',
  reportType: 'Offering Memorandum',
  propertyType: 'Multifamily',
  template: 'Institutional Blue',
  includePricingGuidance: true,
  confidentiality: 'Confidential Memorandum - For Qualified Investors Only',
  property: {
    propertyName: 'Northgate Residences',
    address: '1180 Northgate Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78758',
    assetType: 'Class B+ Multifamily',
    units: 184,
    buildings: 7,
    floors: 3,
    grossSF: 201000,
    rentableSF: 172500,
    lotSize: '8.91 Acres',
    yearBuilt: 2004,
    yearRenovated: 2021,
    constructionType: 'Wood Frame / Brick Veneer',
    roofType: 'Composite Shingle',
    hvacType: 'Central HVAC',
    utilities: 'Individually Metered Electric; Master Water',
    parking: '1.6 spaces per unit',
    occupancy: 95,
    zoning: 'MF-3',
    amenities: ['Resort Pool', 'Fitness Center', 'Dog Park', 'Resident Lounge'],
    investmentHighlights: [
      'Below-market in-place rents with 14% upside',
      'Excellent North Austin employment access',
      'Recent capital upgrades completed',
      'Strong historical occupancy'
    ],
    executiveOverview:
      'Northgate Residences presents an opportunity to acquire a stabilized multifamily community with value-add potential in one of Austin’s strongest rental submarkets.',
    locationOverview:
      'Located near The Domain, major tech employers, and key commuter corridors with strong demographic growth and household incomes.'
  },
  branding: {
    primaryColor: '#0f2c52',
    secondaryColor: '#1f4b84',
    accentColor: '#f58220',
    fontFamily: 'Inter, Arial, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
    headerStyle: 'bar',
    footerStyle: 'branded',
    coverStyle: 'hero',
    tableStyle: 'striped',
    pageNumberStyle: 'x-of-y'
  },
  financials: {
    listingPrice: 48200000,
    capRate: 5.1,
    noi: 2459000,
    pricePerUnit: 261957,
    pricePerSF: 279,
    rentPerSFMonthly: 1.86,
    rentPerSFAnnual: 22.32,
    downPaymentPct: 35,
    returnAssumptionPct: 14.5,
    otherIncome: 138000,
    expenses: 1802000,
    income: 4261000,
    proFormaGrowthPct: 3.5,
    rentRoll: [
      { unit: 'A1-101', bedBath: '1x1', sf: 710, currentRent: 1415, marketRent: 1560 },
      { unit: 'B2-207', bedBath: '2x2', sf: 980, currentRent: 1765, marketRent: 1940 },
      { unit: 'C3-311', bedBath: '3x2', sf: 1210, currentRent: 2195, marketRent: 2380 }
    ],
    unitMix: [
      { type: '1x1', units: 78, avgSF: 710, avgRent: 1485 },
      { type: '2x2', units: 82, avgSF: 985, avgRent: 1840 },
      { type: '3x2', units: 24, avgSF: 1210, avgRent: 2280 }
    ]
  },
  agents: [
    {
      id: 'agent-1',
      name: 'Jordan Blake',
      title: 'First Vice President Investments',
      officeLocation: 'Austin, TX',
      directPhone: '(512) 555-0181',
      email: 'jordan.blake@crestreet.com',
      licenseNumber: 'TX-818122',
      headshotUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600',
      teamOrder: 1
    },
    {
      id: 'agent-2',
      name: 'Avery Chen',
      title: 'Senior Associate',
      officeLocation: 'Austin, TX',
      directPhone: '(512) 555-0112',
      email: 'avery.chen@crestreet.com',
      licenseNumber: 'TX-795002',
      headshotUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600',
      teamOrder: 2
    }
  ],
  brokerage: {
    name: 'CRE Street Capital',
    logoUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
    disclaimer:
      'The information is from sources deemed reliable but no warranty or representation is made as to its accuracy.',
    officeFooterText: 'CRE Street Capital | Multifamily Advisory | Austin | Dallas | Houston'
  },
  saleComps: [
    {
      id: 'sale-1',
      propertyName: 'The Oaks on Burnet',
      address: 'Austin, TX',
      saleDate: '2025-11-14',
      salePrice: 52400000,
      pricePerUnit: 276000,
      pricePerSF: 291,
      capRate: 4.9,
      units: 190,
      yearBuilt: 2006,
      buildingSize: 180000,
      lotSize: '9.2 AC',
      distance: 2.3,
      notes: 'Renovated interiors and strong occupancy at sale.',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
      featured: true
    }
  ],
  leaseComps: [
    {
      id: 'lease-1',
      propertyName: 'The Camden North',
      address: 'Austin, TX',
      unitType: '2x2',
      avgUnitSize: 960,
      avgRent: 1980,
      rentPerSF: 2.06,
      renovationLevel: 'Light Value-Add',
      amenities: 'Gym, Pool, Co-working',
      distance: 1.8,
      notes: 'Directly competitive renter profile.',
      imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600',
      featured: true
    }
  ],
  mapAssets: [
    {
      id: 'map-1',
      type: 'regional',
      title: 'Regional Access Map',
      imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200',
      labels: ['Downtown Austin', 'The Domain', 'Austin-Bergstrom Airport'],
      enabled: true
    }
  ],
  mediaAssets: [
    {
      id: 'media-cover',
      category: 'cover',
      title: 'Hero Exterior',
      url: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1600',
      caption: 'Front elevation at dusk'
    }
  ],
  narrativeSections: [
    {
      id: 'n1',
      title: 'Offering Summary',
      content: 'This opportunity offers durable cash flow with strategic upside through interior upgrades and utility optimization.',
      include: true,
      layout: 'full'
    },
    {
      id: 'n2',
      title: 'Market Overview',
      content: 'North Austin has outperformed broader metro rent growth due to technology employment concentration and household formation.',
      include: true,
      layout: 'two-column'
    }
  ],
  charts: [
    {
      id: 'chart-1',
      title: 'Sale Comp Price per Unit',
      chartType: 'bar',
      showLegend: true,
      labels: ['Subject', 'Comp 1'],
      series: [{ name: 'Price / Unit', values: [261957, 276000] }]
    }
  ],
  pages: [
    { id: 'p1', title: 'Cover', templateType: 'cover', sectionLabel: 'Cover', visible: true },
    { id: 'p2', title: 'Confidential Disclaimer', templateType: 'disclaimer', sectionLabel: 'Legal', visible: true },
    { id: 'p3', title: 'Broker Contacts', templateType: 'contact', sectionLabel: 'Contacts', visible: true },
    { id: 'p4', title: 'Table of Contents', templateType: 'toc', sectionLabel: 'Navigation', visible: true },
    { id: 'p5', title: 'Offering Overview', templateType: 'section-divider', sectionLabel: 'Section', visible: true },
    { id: 'p6', title: 'Offering Summary', templateType: 'summary', sectionLabel: 'Summary', visible: true },
    { id: 'p7', title: 'Investment Overview', templateType: 'text-image', sectionLabel: 'Narrative', visible: true },
    { id: 'p8', title: 'Property Details Table', templateType: 'table', sectionLabel: 'Property', visible: true },
    { id: 'p9', title: 'Regional Map', templateType: 'map', sectionLabel: 'Maps', visible: true },
    { id: 'p10', title: 'Aerial Photo Spread', templateType: 'full-image', sectionLabel: 'Imagery', visible: true },
    { id: 'p11', title: 'Financial Charts', templateType: 'chart', sectionLabel: 'Financial', visible: true },
    { id: 'p12', title: 'Sale & Lease Comps', templateType: 'comparable', sectionLabel: 'Comps', visible: true },
    { id: 'p13', title: 'Market Overview', templateType: 'market-overview', sectionLabel: 'Market', visible: true },
    { id: 'p14', title: 'Closing Contact', templateType: 'closing', sectionLabel: 'Closing', visible: true }
  ],
  exportConfig: {
    pageSize: 'letter',
    orientation: 'portrait',
    includeBleed: false,
    printQuality: 'high'
  }
};
