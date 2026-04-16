'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Deal, ReportPage } from '@/lib/types';

function num(v: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
}

function currency(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

export default function ReportDocument({
  deal,
  pages,
  className = ''
}: {
  deal: Deal;
  pages: ReportPage[];
  className?: string;
}) {
  const visiblePages = pages.filter((page) => page.visible);

  return (
    <section className={className}>
      {visiblePages.map((page, idx) => (
        <article key={page.id} className="report-page p-10">
          <header className="mb-4 flex items-center justify-between border-b pb-2" style={{ borderColor: deal.branding.primaryColor }}>
            <p className="font-semibold" style={{ color: deal.branding.primaryColor }}>{page.sectionLabel}</p>
            <p className="text-xs">Page {idx + 1} of {visiblePages.length}</p>
          </header>
          <PageContent page={page} deal={deal} pageNo={idx + 1} pageTotal={visiblePages.length} pages={visiblePages} />
          <footer className="mt-8 border-t pt-2 text-xs text-slate-500">{deal.brokerage.officeFooterText}</footer>
        </article>
      ))}
    </section>
  );
}

function PageContent({ page, deal, pageNo, pageTotal, pages }: { page: ReportPage; deal: Deal; pageNo: number; pageTotal: number; pages: ReportPage[] }) {
  const enabledMaps = deal.mapAssets.filter((asset) => asset.enabled);

  if (page.templateType === 'cover') {
    return (
      <div>
        <img src={deal.mediaAssets[0]?.url} alt="cover" className="h-[8in] w-full rounded object-cover" />
        <div className="-mt-24 bg-black/60 p-4 text-white">
          <h3 className="text-3xl font-bold">{deal.property.propertyName}</h3>
          <p>{deal.property.address}, {deal.property.city}, {deal.property.state} {deal.property.zip}</p>
        </div>
      </div>
    );
  }

  if (page.templateType === 'disclaimer') {
    return (
      <div>
        <h3 className="mb-4 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Confidentiality & Disclaimer</h3>
        <p className="mb-3 text-sm leading-7">{deal.confidentiality}</p>
        <p className="text-sm leading-7">{deal.brokerage.disclaimer}</p>
      </div>
    );
  }

  if (page.templateType === 'toc') {
    return (
      <div>
        <h3 className="mb-3 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Table of Contents</h3>
        {pages.map((p, idx) => (
          <div key={p.id} className="flex border-b py-2 text-sm">
            <p>{p.title}</p>
            <p className="ml-auto">{idx + 1}</p>
          </div>
        ))}
      </div>
    );
  }

  if (page.templateType === 'section-divider') {
    return (
      <div className="flex h-[8.5in] items-center justify-center rounded" style={{ background: deal.branding.primaryColor }}>
        <h3 className="text-4xl font-bold text-white">{page.title}</h3>
      </div>
    );
  }

  if (page.templateType === 'summary') {
    return (
      <div>
        <h3 className="mb-3 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Offering Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Listing Price" value={currency(deal.financials.listingPrice)} />
          <Metric label="NOI" value={currency(deal.financials.noi)} />
          <Metric label="Units" value={num(deal.property.units)} />
          <Metric label="Cap Rate" value={`${deal.financials.capRate}%`} />
          <Metric label="Occupancy" value={`${deal.property.occupancy}%`} />
          <Metric label="Price / Unit" value={currency(deal.financials.pricePerUnit)} />
        </div>
      </div>
    );
  }

  if (page.templateType === 'text-image') {
    return (
      <div className="grid grid-cols-2 gap-5">
        <div>
          <h3 className="mb-2 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Investment Overview</h3>
          <p className="mb-3 text-sm leading-7">{deal.property.executiveOverview}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {deal.property.investmentHighlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
        </div>
        <img src={deal.mediaAssets[0]?.url} alt="property" className="h-[7in] w-full rounded object-cover" />
      </div>
    );
  }

  if (page.templateType === 'table') {
    return (
      <div>
        <h3 className="mb-2 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Property Details</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr><td className="font-medium">Asset Type</td><td>{deal.property.assetType}</td></tr>
            <tr><td className="font-medium">Year Built / Renovated</td><td>{deal.property.yearBuilt} / {deal.property.yearRenovated}</td></tr>
            <tr><td className="font-medium">Rentable SF</td><td>{num(deal.property.rentableSF)}</td></tr>
            <tr><td className="font-medium">Parking</td><td>{deal.property.parking}</td></tr>
            <tr><td className="font-medium">Utilities</td><td>{deal.property.utilities}</td></tr>
            <tr><td className="font-medium">Zoning</td><td>{deal.property.zoning}</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (page.templateType === 'map') {
    const map = enabledMaps[(pageNo - 1) % Math.max(enabledMaps.length, 1)];
    return (
      <div>
        <h3 className="mb-2 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>{map?.title ?? 'Map Page'}</h3>
        {map ? <img src={map.imageUrl} alt={map.title} className="h-[7.5in] w-full rounded object-cover" /> : <p>No map enabled.</p>}
      </div>
    );
  }

  if (page.templateType === 'full-image') {
    const image = deal.mediaAssets[(pageNo - 1) % Math.max(deal.mediaAssets.length, 1)];
    return image ? <img src={image.url} alt={image.title} className="h-[8.5in] w-full rounded object-cover" /> : <p>No images uploaded.</p>;
  }

  if (page.templateType === 'chart') {
    const chartData = deal.saleComps.map((comp) => ({ name: comp.propertyName, ppu: comp.pricePerUnit, psf: comp.pricePerSF }));
    return (
      <div>
        <h3 className="mb-3 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Comparable Pricing Charts</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => currency(Number(value))} />
              <Legend />
              <Bar dataKey="ppu" fill={deal.branding.accentColor} name="Price / Unit" />
              <Bar dataKey="psf" fill={deal.branding.secondaryColor} name="Price / SF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (page.templateType === 'comparable') {
    return (
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="mb-2 text-xl font-bold" style={{ color: deal.branding.primaryColor }}>Sale Comparable Analysis</h3>
          {deal.saleComps.map((comp) => (
            <div key={comp.id} className="mb-2 rounded border p-2 text-sm">
              <p className="font-semibold">{comp.propertyName} {comp.featured ? '★' : ''}</p>
              <p>{currency(comp.salePrice)} | {currency(comp.pricePerUnit)} per unit | {comp.capRate}% cap</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-bold" style={{ color: deal.branding.primaryColor }}>Lease Comparable Analysis</h3>
          {deal.leaseComps.map((comp) => (
            <div key={comp.id} className="mb-2 rounded border p-2 text-sm">
              <p className="font-semibold">{comp.propertyName} {comp.featured ? '★' : ''}</p>
              <p>{currency(comp.avgRent)} | {comp.rentPerSF} per SF | {comp.unitType}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page.templateType === 'market-overview') {
    return (
      <div>
        <h3 className="mb-2 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Market Overview</h3>
        <p className="mb-3 text-sm leading-7">{deal.property.locationOverview}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Exclusively Listed By</h3>
      <div className="grid grid-cols-2 gap-4">
        {deal.agents.map((agent) => (
          <div key={agent.id} className="rounded border p-3">
            <p className="font-semibold">{agent.name}</p>
            <p>{agent.title}</p>
            <p>{agent.directPhone}</p>
            <p>{agent.email}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-500">Page {pageNo}/{pageTotal}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border bg-slate-50 p-3">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
