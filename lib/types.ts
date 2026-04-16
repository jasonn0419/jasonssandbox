export type ReportType = 'Offering Memorandum' | 'Broker Opinion of Value';

export interface BrandingTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl: string;
  headerStyle: 'minimal' | 'bar' | 'boxed';
  footerStyle: 'minimal' | 'numbered' | 'branded';
  coverStyle: 'hero' | 'split' | 'clean';
  tableStyle: 'clean' | 'striped';
  pageNumberStyle: 'x-of-y' | 'simple';
}

export interface Property {
  propertyName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  assetType: string;
  units: number;
  buildings: number;
  floors: number;
  grossSF: number;
  rentableSF: number;
  lotSize: string;
  yearBuilt: number;
  yearRenovated?: number;
  constructionType: string;
  roofType: string;
  hvacType: string;
  utilities: string;
  parking: string;
  occupancy: number;
  zoning: string;
  amenities: string[];
  investmentHighlights: string[];
  executiveOverview: string;
  locationOverview: string;
}

export interface UnitMixLine {
  type: string;
  units: number;
  avgSF: number;
  avgRent: number;
}

export interface RentRollLine {
  unit: string;
  bedBath: string;
  sf: number;
  currentRent: number;
  marketRent: number;
}

export interface FinancialSummary {
  listingPrice: number;
  capRate: number;
  noi: number;
  pricePerUnit: number;
  pricePerSF: number;
  rentPerSFMonthly: number;
  rentPerSFAnnual: number;
  downPaymentPct: number;
  returnAssumptionPct: number;
  otherIncome: number;
  expenses: number;
  income: number;
  proFormaGrowthPct: number;
  rentRoll: RentRollLine[];
  unitMix: UnitMixLine[];
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  officeLocation: string;
  directPhone: string;
  email: string;
  licenseNumber: string;
  headshotUrl: string;
  teamOrder: number;
}

export interface Brokerage {
  name: string;
  logoUrl: string;
  disclaimer: string;
  officeFooterText: string;
}

export interface SaleComparable {
  id: string;
  propertyName: string;
  address: string;
  saleDate: string;
  salePrice: number;
  pricePerUnit: number;
  pricePerSF: number;
  capRate: number;
  units: number;
  yearBuilt: number;
  buildingSize: number;
  lotSize: string;
  distance: number;
  notes: string;
  imageUrl: string;
  featured: boolean;
}

export interface LeaseComparable {
  id: string;
  propertyName: string;
  address: string;
  unitType: string;
  avgUnitSize: number;
  avgRent: number;
  rentPerSF: number;
  renovationLevel: string;
  amenities: string;
  distance: number;
  notes: string;
  imageUrl: string;
  featured: boolean;
}

export interface MapAsset {
  id: string;
  type: 'regional' | 'local' | 'aerial' | 'retailer';
  title: string;
  imageUrl: string;
  labels: string[];
  enabled: boolean;
}

export interface MediaAsset {
  id: string;
  category: 'cover' | 'exterior' | 'interior' | 'amenity' | 'aerial' | 'agent' | 'logo' | 'comp' | 'map';
  title: string;
  url: string;
  caption?: string;
}

export interface NarrativeSection {
  id: string;
  title: string;
  content: string;
  include: boolean;
  layout: 'full' | 'two-column';
}

export interface ChartConfig {
  id: string;
  title: string;
  chartType: 'bar' | 'line';
  showLegend: boolean;
  labels: string[];
  series: Array<{ name: string; values: number[] }>;
}

export interface PageTemplate {
  id: string;
  name: string;
  type:
    | 'cover'
    | 'disclaimer'
    | 'contact'
    | 'toc'
    | 'section-divider'
    | 'summary'
    | 'text-image'
    | 'table'
    | 'map'
    | 'full-image'
    | 'image-grid'
    | 'chart'
    | 'comparable'
    | 'market-overview'
    | 'closing';
}

export interface ReportPage {
  id: string;
  title: string;
  templateType: PageTemplate['type'];
  sectionLabel: string;
  visible: boolean;
}

export interface ExportConfig {
  pageSize: 'letter' | 'a4';
  orientation: 'portrait' | 'landscape';
  includeBleed: boolean;
  printQuality: 'standard' | 'high';
}

export interface Deal {
  id: string;
  activityId: string;
  reportType: ReportType;
  propertyType: string;
  template: string;
  includePricingGuidance: boolean;
  confidentiality: string;
  property: Property;
  branding: BrandingTheme;
  financials: FinancialSummary;
  agents: Agent[];
  brokerage: Brokerage;
  saleComps: SaleComparable[];
  leaseComps: LeaseComparable[];
  mapAssets: MapAsset[];
  mediaAssets: MediaAsset[];
  narrativeSections: NarrativeSection[];
  charts: ChartConfig[];
  pages: ReportPage[];
  exportConfig: ExportConfig;
}
