'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { calcBovRange, calcWeightedAvgRent } from '@/lib/calculations';
import {
  Deal,
  LeaseComparable,
  MapAsset,
  MediaAsset,
  NarrativeSection,
  PageTemplate,
  ReportPage,
  SaleComparable
} from '@/lib/types';
import ReportDocument from '@/components/report/ReportDocument';

const steps = [
  'Deal Setup',
  'Branding',
  'Property Info',
  'Financials',
  'Agent Info',
  'Sale Comps',
  'Lease Comps',
  'Maps',
  'Media Library',
  'Narrative Sections',
  'Page Builder / Layout',
  'Preview',
  'Export'
];

const templateTypes: PageTemplate['type'][] = [
  'cover',
  'disclaimer',
  'contact',
  'toc',
  'section-divider',
  'summary',
  'text-image',
  'table',
  'map',
  'full-image',
  'image-grid',
  'chart',
  'comparable',
  'market-overview',
  'closing'
];

function num(v: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
}

function currency(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

interface BuilderShellProps {
  initialDeal: Deal;
  projectId: string;
  projectName: string;
  lastSavedAt?: string;
  onDealChange: (deal: Deal) => void;
  onManualSave: () => void;
  onSaveAsNew: () => void;
  onBackToProjects: () => void;
}

export default function BuilderShell({
  initialDeal,
  projectId,
  projectName,
  lastSavedAt,
  onDealChange,
  onManualSave,
  onSaveAsNew,
  onBackToProjects
}: BuilderShellProps) {
  const [deal, setDeal] = useState<Deal>(initialDeal);
  const [activeStep, setActiveStep] = useState(0);

  const weightedRent = useMemo(() => calcWeightedAvgRent(deal.financials), [deal.financials]);
  const bovRange = useMemo(() => calcBovRange(deal.financials.noi), [deal.financials.noi]);

  useEffect(() => {
    setDeal(initialDeal);
  }, [initialDeal]);

  useEffect(() => {
    onDealChange(deal);
  }, [deal, onDealChange]);


  const updateSaleComp = (id: string, key: keyof SaleComparable, value: string | boolean) => {
    setDeal((current) => ({
      ...current,
      saleComps: current.saleComps.map((comp) =>
        comp.id === id ? { ...comp, [key]: key === 'featured' ? value : Number.isFinite(Number(value)) ? Number(value) : value } : comp
      )
    }));
  };

  const updateLeaseComp = (id: string, key: keyof LeaseComparable, value: string | boolean) => {
    setDeal((current) => ({
      ...current,
      leaseComps: current.leaseComps.map((comp) =>
        comp.id === id ? { ...comp, [key]: key === 'featured' ? value : Number.isFinite(Number(value)) ? Number(value) : value } : comp
      )
    }));
  };

  const movePage = (idx: number, direction: -1 | 1) => {
    setDeal((current) => {
      const pages = [...current.pages];
      const next = idx + direction;
      if (next < 0 || next >= pages.length) return current;
      [pages[idx], pages[next]] = [pages[next], pages[idx]];
      return { ...current, pages };
    });
  };

  const duplicatePage = (page: ReportPage) => {
    setDeal((current) => ({
      ...current,
      pages: [...current.pages, { ...page, id: `${page.id}-copy-${crypto.randomUUID().slice(0, 6)}`, title: `${page.title} Copy` }]
    }));
  };

  const visiblePages = deal.pages.filter((page) => page.visible);

  const renderStep = () => {
    switch (steps[activeStep]) {
      case 'Deal Setup':
        return (
          <section className="grid grid-cols-2 gap-4">
            <Input label="Property Name" value={deal.property.propertyName} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, propertyName: value } })} />
            <Input label="Property Address" value={deal.property.address} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, address: value } })} />
            <Input label="Activity ID" value={deal.activityId} onChange={(value) => setDeal({ ...deal, activityId: value })} />
            <Select
              label="Report Type"
              value={deal.reportType}
              options={['Offering Memorandum', 'Broker Opinion of Value']}
              onChange={(value) => setDeal({ ...deal, reportType: value as Deal['reportType'] })}
            />
            <Input label="Property Type" value={deal.propertyType} onChange={(value) => setDeal({ ...deal, propertyType: value })} />
            <Input label="Template" value={deal.template} onChange={(value) => setDeal({ ...deal, template: value })} />
            <Textarea label="Confidentiality / Disclaimer" value={deal.confidentiality} onChange={(value) => setDeal({ ...deal, confidentiality: value })} />
          </section>
        );
      case 'Branding':
        return (
          <section className="grid grid-cols-2 gap-4">
            <Input label="Primary Color" value={deal.branding.primaryColor} onChange={(value) => setDeal({ ...deal, branding: { ...deal.branding, primaryColor: value } })} />
            <Input label="Secondary Color" value={deal.branding.secondaryColor} onChange={(value) => setDeal({ ...deal, branding: { ...deal.branding, secondaryColor: value } })} />
            <Input label="Accent Color" value={deal.branding.accentColor} onChange={(value) => setDeal({ ...deal, branding: { ...deal.branding, accentColor: value } })} />
            <Input label="Logo URL" value={deal.branding.logoUrl} onChange={(value) => setDeal({ ...deal, branding: { ...deal.branding, logoUrl: value } })} />
          </section>
        );
      case 'Property Info':
        return (
          <section className="grid grid-cols-2 gap-4">
            <Input label="Units" value={String(deal.property.units)} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, units: Number(value) || 0 } })} />
            <Input label="Rentable SF" value={String(deal.property.rentableSF)} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, rentableSF: Number(value) || 0 } })} />
            <Input label="Year Built" value={String(deal.property.yearBuilt)} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, yearBuilt: Number(value) || 0 } })} />
            <Input label="Occupancy %" value={String(deal.property.occupancy)} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, occupancy: Number(value) || 0 } })} />
            <Textarea label="Executive Investment Overview" value={deal.property.executiveOverview} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, executiveOverview: value } })} />
            <Textarea label="Location Overview" value={deal.property.locationOverview} onChange={(value) => setDeal({ ...deal, property: { ...deal.property, locationOverview: value } })} />
          </section>
        );
      case 'Financials':
        return (
          <section className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Listing Price" value={String(deal.financials.listingPrice)} onChange={(value) => setDeal({ ...deal, financials: { ...deal.financials, listingPrice: Number(value) || 0 } })} />
              <Input label="NOI" value={String(deal.financials.noi)} onChange={(value) => setDeal({ ...deal, financials: { ...deal.financials, noi: Number(value) || 0 } })} />
              <Input label="Cap Rate %" value={String(deal.financials.capRate)} onChange={(value) => setDeal({ ...deal, financials: { ...deal.financials, capRate: Number(value) || 0 } })} />
            </div>
            <div className="rounded border bg-white p-4">
              <h3 className="font-semibold">Auto-calculated summary</h3>
              <p>Weighted Average Rent: {currency(weightedRent)}</p>
              <p>BOV Value Range: {currency(bovRange[0])} - {currency(bovRange[1])}</p>
            </div>
          </section>
        );
      case 'Agent Info':
        return (
          <section className="grid grid-cols-2 gap-4">
            {deal.agents.map((agent, index) => (
              <div key={agent.id} className="rounded border bg-white p-3">
                <Input label={`Agent ${index + 1} Name`} value={agent.name} onChange={(value) => setDeal({ ...deal, agents: deal.agents.map((a) => (a.id === agent.id ? { ...a, name: value } : a)) })} />
                <Input label="Title" value={agent.title} onChange={(value) => setDeal({ ...deal, agents: deal.agents.map((a) => (a.id === agent.id ? { ...a, title: value } : a)) })} />
                <Input label="Direct Phone" value={agent.directPhone} onChange={(value) => setDeal({ ...deal, agents: deal.agents.map((a) => (a.id === agent.id ? { ...a, directPhone: value } : a)) })} />
                <Input label="Email" value={agent.email} onChange={(value) => setDeal({ ...deal, agents: deal.agents.map((a) => (a.id === agent.id ? { ...a, email: value } : a)) })} />
              </div>
            ))}
          </section>
        );
      case 'Sale Comps':
        return <CompsTable saleComps={deal.saleComps} updateSaleComp={updateSaleComp} />;
      case 'Lease Comps':
        return <LeaseCompsTable leaseComps={deal.leaseComps} updateLeaseComp={updateLeaseComp} />;
      case 'Maps':
        return <MapsEditor maps={deal.mapAssets} onChange={(maps) => setDeal({ ...deal, mapAssets: maps })} />;
      case 'Media Library':
        return <MediaEditor mediaAssets={deal.mediaAssets} onChange={(mediaAssets) => setDeal({ ...deal, mediaAssets })} />;
      case 'Narrative Sections':
        return <NarrativeEditor sections={deal.narrativeSections} onChange={(narrativeSections) => setDeal({ ...deal, narrativeSections })} />;
      case 'Page Builder / Layout':
        return (
          <section className="space-y-3">
            {deal.pages.map((page, idx) => (
              <div key={page.id} className="flex items-center justify-between rounded border bg-white px-4 py-2">
                <div>
                  <p className="font-semibold">{idx + 1}. {page.title}</p>
                  <p className="text-xs text-slate-500">{page.templateType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={page.templateType}
                    onChange={(event) =>
                      setDeal({
                        ...deal,
                        pages: deal.pages.map((p) => (p.id === page.id ? { ...p, templateType: event.target.value as PageTemplate['type'] } : p))
                      })
                    }
                    className="rounded border px-2 py-1 text-xs"
                  >
                    {templateTypes.map((template) => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                  <button className="rounded border px-2 py-1" onClick={() => movePage(idx, -1)}>↑</button>
                  <button className="rounded border px-2 py-1" onClick={() => movePage(idx, 1)}>↓</button>
                  <button className="rounded border px-2 py-1" onClick={() => duplicatePage(page)}>Duplicate</button>
                  <button className="rounded border px-2 py-1" onClick={() => setDeal({ ...deal, pages: deal.pages.map((p) => (p.id === page.id ? { ...p, visible: !p.visible } : p)) })}>{page.visible ? 'Hide' : 'Show'}</button>
                </div>
              </div>
            ))}
          </section>
        );
      case 'Preview':
        return <ReportDocument deal={deal} pages={visiblePages} />;
      case 'Export':
        return (
          <section className="space-y-4">
            <p className="text-sm">Use print-optimized export for a polished broker-facing PDF. The preview uses fixed Letter portrait page frames and institutional footer/page numbering.</p>
            <div className="flex gap-2">
              <button className="rounded bg-brandNavy px-4 py-2 text-white" onClick={() => window.open(`/export/${projectId}?print=1`, '_blank')}>Export Full PDF</button>
              <button className="rounded border px-4 py-2" onClick={() => window.open(`/export/${projectId}?test=1&print=1`, '_blank')}>Test Export (8 pages)</button>
            </div>
          </section>
        );
      default:
        return <div className="rounded border bg-white p-4 text-sm text-slate-600">Configure {steps[activeStep]} module content in this MVP workspace.</div>;
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6" style={{ fontFamily: deal.branding.fontFamily }}>
      <header className="mb-4 rounded-lg p-5 text-white" style={{ background: `linear-gradient(110deg, ${deal.branding.primaryColor}, ${deal.branding.secondaryColor})` }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{projectName}</h1>
            <p className="text-sm opacity-90">Institutional-quality Offering Memorandums and Broker Opinions of Value</p>
            <p className="text-xs opacity-80">Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Not saved yet'}</p>
          </div>
          <div className="no-print flex gap-2">
            <button className="rounded border border-white/50 px-3 py-2 text-sm" onClick={onBackToProjects}>Projects</button>
            <button className="rounded border border-white/50 px-3 py-2 text-sm" onClick={onSaveAsNew}>Save As New</button>
            <button className="rounded bg-white px-3 py-2 text-sm font-semibold text-slate-900" onClick={onManualSave}>Save</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[260px_1fr] gap-4">
        <nav className="no-print rounded-lg border bg-white p-3">
          {steps.map((step, idx) => (
            <button
              key={step}
              onClick={() => setActiveStep(idx)}
              className={`mb-2 block w-full rounded px-3 py-2 text-left text-sm ${idx === activeStep ? 'bg-brandNavy text-white' : 'hover:bg-slate-100'}`}
            >
              {idx + 1}. {step}
            </button>
          ))}
        </nav>
        <section className="rounded-lg border bg-white p-4">{renderStep()}</section>
      </div>

      <section className="no-print mt-6 rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">Live comp chart</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deal.saleComps.map((comp) => ({ name: comp.propertyName, ppu: comp.pricePerUnit }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => currency(Number(value))} />
              <Legend />
              <Bar dataKey="ppu" fill={deal.branding.accentColor} name="Price / Unit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input className="w-full rounded border px-2 py-2" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <select className="w-full rounded border px-2 py-2" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="col-span-2 block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <textarea rows={4} className="w-full rounded border px-2 py-2" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function CompsTable({ saleComps, updateSaleComp }: { saleComps: SaleComparable[]; updateSaleComp: (id: string, key: keyof SaleComparable, value: string | boolean) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left">Name</th><th className="p-2 text-left">Price</th><th className="p-2 text-left">PPU</th><th className="p-2 text-left">Cap</th><th className="p-2 text-left">Featured</th>
          </tr>
        </thead>
        <tbody>
          {saleComps.map((comp) => (
            <tr key={comp.id} className="border-b">
              <td className="p-2"><input className="w-full rounded border px-1" value={comp.propertyName} onChange={(event) => updateSaleComp(comp.id, 'propertyName', event.target.value)} /></td>
              <td className="p-2"><input className="w-32 rounded border px-1" value={comp.salePrice} onChange={(event) => updateSaleComp(comp.id, 'salePrice', event.target.value)} /></td>
              <td className="p-2"><input className="w-24 rounded border px-1" value={comp.pricePerUnit} onChange={(event) => updateSaleComp(comp.id, 'pricePerUnit', event.target.value)} /></td>
              <td className="p-2"><input className="w-20 rounded border px-1" value={comp.capRate} onChange={(event) => updateSaleComp(comp.id, 'capRate', event.target.value)} /></td>
              <td className="p-2"><input type="checkbox" checked={comp.featured} onChange={(event) => updateSaleComp(comp.id, 'featured', event.target.checked)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaseCompsTable({ leaseComps, updateLeaseComp }: { leaseComps: LeaseComparable[]; updateLeaseComp: (id: string, key: keyof LeaseComparable, value: string | boolean) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left">Name</th><th className="p-2 text-left">Unit</th><th className="p-2 text-left">Avg Rent</th><th className="p-2 text-left">Rent/SF</th><th className="p-2 text-left">Featured</th>
          </tr>
        </thead>
        <tbody>
          {leaseComps.map((comp) => (
            <tr key={comp.id} className="border-b">
              <td className="p-2"><input className="w-full rounded border px-1" value={comp.propertyName} onChange={(event) => updateLeaseComp(comp.id, 'propertyName', event.target.value)} /></td>
              <td className="p-2"><input className="w-24 rounded border px-1" value={comp.unitType} onChange={(event) => updateLeaseComp(comp.id, 'unitType', event.target.value)} /></td>
              <td className="p-2"><input className="w-24 rounded border px-1" value={comp.avgRent} onChange={(event) => updateLeaseComp(comp.id, 'avgRent', event.target.value)} /></td>
              <td className="p-2"><input className="w-24 rounded border px-1" value={comp.rentPerSF} onChange={(event) => updateLeaseComp(comp.id, 'rentPerSF', event.target.value)} /></td>
              <td className="p-2"><input type="checkbox" checked={comp.featured} onChange={(event) => updateLeaseComp(comp.id, 'featured', event.target.checked)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MapsEditor({ maps, onChange }: { maps: MapAsset[]; onChange: (maps: MapAsset[]) => void }) {
  return (
    <div className="space-y-3">
      {maps.map((map) => (
        <div key={map.id} className="rounded border p-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{map.title}</p>
            <label className="text-sm"><input type="checkbox" checked={map.enabled} onChange={(event) => onChange(maps.map((m) => (m.id === map.id ? { ...m, enabled: event.target.checked } : m)))} /> enabled</label>
          </div>
          <Input label="Map URL" value={map.imageUrl} onChange={(value) => onChange(maps.map((m) => (m.id === map.id ? { ...m, imageUrl: value } : m)))} />
        </div>
      ))}
    </div>
  );
}

function MediaEditor({ mediaAssets, onChange }: { mediaAssets: MediaAsset[]; onChange: (assets: MediaAsset[]) => void }) {
  return (
    <div className="space-y-3">
      {mediaAssets.map((asset) => (
        <div key={asset.id} className="rounded border p-3">
          <p className="text-sm font-semibold">{asset.title} ({asset.category})</p>
          <Input label="Image URL" value={asset.url} onChange={(value) => onChange(mediaAssets.map((a) => (a.id === asset.id ? { ...a, url: value } : a)))} />
          <Input label="Caption" value={asset.caption ?? ''} onChange={(value) => onChange(mediaAssets.map((a) => (a.id === asset.id ? { ...a, caption: value } : a)))} />
        </div>
      ))}
    </div>
  );
}

function NarrativeEditor({ sections, onChange }: { sections: NarrativeSection[]; onChange: (sections: NarrativeSection[]) => void }) {
  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.id} className="rounded border p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">{section.title}</p>
            <label className="text-xs"><input type="checkbox" checked={section.include} onChange={(event) => onChange(sections.map((s) => (s.id === section.id ? { ...s, include: event.target.checked } : s)))} /> include</label>
          </div>
          <textarea
            rows={4}
            value={section.content}
            onChange={(event) => onChange(sections.map((s) => (s.id === section.id ? { ...s, content: event.target.value } : s)))}
            className="w-full rounded border p-2"
          />
        </div>
      ))}
    </div>
  );
}

function Preview({ deal, pages }: { deal: Deal; pages: ReportPage[] }) {
  return (
    <div>
      {pages.map((page, idx) => (
        <article key={page.id} className="report-page p-10">
          <header className="mb-4 flex items-center justify-between border-b pb-2" style={{ borderColor: deal.branding.primaryColor }}>
            <p className="font-semibold" style={{ color: deal.branding.primaryColor }}>{page.sectionLabel}</p>
            <p className="text-xs">Page {idx + 1} of {pages.length}</p>
          </header>
          <PageBody page={page} deal={deal} pageNo={idx + 1} pageTotal={pages.length} />
          <footer className="mt-8 border-t pt-2 text-xs text-slate-500">{deal.brokerage.officeFooterText}</footer>
        </article>
      ))}
    </div>
  );
}

function PageBody({ page, deal, pageNo, pageTotal }: { page: ReportPage; deal: Deal; pageNo: number; pageTotal: number }) {
  const enabledMaps = deal.mapAssets.filter((asset) => asset.enabled);
  const includedNarratives = deal.narrativeSections.filter((section) => section.include);

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
        {deal.pages.filter((p) => p.visible).map((p, idx) => (
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

  if (page.templateType === 'image-grid') {
    const images = deal.mediaAssets.slice(0, 4);
    return (
      <div>
        <h3 className="mb-2 text-2xl font-bold" style={{ color: deal.branding.primaryColor }}>Photo Gallery</h3>
        <div className="grid grid-cols-2 gap-3">
          {images.map((image) => <img key={image.id} src={image.url} alt={image.title} className="h-[3.5in] w-full rounded object-cover" />)}
        </div>
      </div>
    );
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
        {includedNarratives.map((section) => (
          <div key={section.id} className="mb-3 rounded border p-2">
            <p className="font-semibold">{section.title}</p>
            <p className="text-sm">{section.content}</p>
          </div>
        ))}
      </div>
    );
  }

  if (page.templateType === 'contact' || page.templateType === 'closing') {
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
              <p className="text-xs">License: {agent.licenseNumber}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-500">Page {pageNo}/{pageTotal}</p>
      </div>
    );
  }

  return <p className="text-sm leading-6">{deal.brokerage.disclaimer}</p>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border bg-slate-50 p-3">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
