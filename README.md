# CRE OM Studio MVP

A production-minded MVP for creating commercial real estate Offering Memorandums (OM) and Broker Opinions of Value (BOV) with institutional visual styling.

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Recharts
- Local persistence adapter (localStorage) designed to be swappable with Supabase/Firebase later
- Print CSS for PDF export via browser print pipeline

## Run locally
```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Current MVP coverage
- **Projects dashboard (landing page)** with create/open/rename/duplicate/delete, search, sort, and last-edited timestamps
- **Project persistence** with manual save, autosave, and "Save As New Project"
- Typed project persistence contracts (`Project`, `ProjectSummary`, `SavedProjectState`, `ProjectPersistenceAdapter`) for backend-ready architecture
- Typed CRE-centric report model (`Deal`, `Property`, `FinancialSummary`, `Agent`, comps, maps, pages, export config)
- Multi-step workflow shell (13 workflow steps)
- Deal setup, branding, property, financial, agent, sale comp, lease comp, map, media, and narrative editors
- Institutional OM page sequencing in preview (cover, legal, contact, TOC, section divider, summary, details, maps, imagery, financial charting, comps, market overview, closing)
- Page template orchestration with reordering, visibility toggles, duplication, and template swapping
- Live chart rendering tied to comparable inputs
- Print-safe export with full document rendering and page-framed print CSS
- Full-document export route (`/export/[projectId]`) renders the assembled OM/BOV package in page order before printing
- Test export mode (`/export/[projectId]?test=1`) renders an 8-page sample for quick verification
- Seeded realistic multifamily demo deal
