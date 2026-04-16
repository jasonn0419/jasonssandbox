'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ReportDocument from '@/components/report/ReportDocument';
import { LocalStorageProjectAdapter, Project } from '@/lib/projectPersistence';
import { seedDeal } from '@/lib/seed';

const adapter = new LocalStorageProjectAdapter();

export default function ExportProjectPage() {
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);

  const testMode = searchParams.get('test') === '1';

  useEffect(() => {
    adapter.getProject(params.projectId).then(setProject);
  }, [params.projectId]);

  const deal = useMemo(() => {
    if (testMode) {
      return {
        ...seedDeal,
        pages: seedDeal.pages.slice(0, 8).map((page, idx) => ({ ...page, id: `test-${idx}` }))
      };
    }

    return project?.state.deal;
  }, [project, testMode]);

  useEffect(() => {
    if (!deal) return;
    if (searchParams.get('print') === '1') {
      const t = setTimeout(() => window.print(), 350);
      return () => clearTimeout(t);
    }
  }, [deal, searchParams]);

  if (!deal) return <main className="p-8">Loading export document…</main>;

  return (
    <main className="bg-slate-200 p-6 print:bg-white print:p-0">
      <ReportDocument deal={deal} pages={deal.pages} />
    </main>
  );
}
