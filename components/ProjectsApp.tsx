'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import BuilderShell from '@/components/BuilderShell';
import { seedDeal } from '@/lib/seed';
import {
  LocalStorageProjectAdapter,
  Project,
  ProjectSummary,
  SavedProjectState
} from '@/lib/projectPersistence';
import { Deal } from '@/lib/types';

const adapter = new LocalStorageProjectAdapter();

type SortMode = 'updated-desc' | 'updated-asc' | 'name-asc';

export default function ProjectsApp() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('updated-desc');
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDealRef = useRef<Deal | null>(null);

  const refreshProjects = async () => {
    setProjects(await adapter.listProjects());
  };

  useEffect(() => {
    refreshProjects();
  }, []);


  useEffect(() => {
    latestDealRef.current = activeProject?.state.deal ?? null;
  }, [activeProject]);

  const filtered = useMemo(() => {
    const base = projects.filter((project) =>
      [project.name, project.propertyName, project.reportType].join(' ').toLowerCase().includes(search.toLowerCase())
    );

    return base.sort((a, b) => {
      if (sortMode === 'name-asc') return a.name.localeCompare(b.name);
      if (sortMode === 'updated-asc') return a.updatedAt.localeCompare(b.updatedAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [projects, search, sortMode]);

  const createProject = async () => {
    const name = window.prompt('Project name', `New ${seedDeal.reportType} Project`);
    if (!name) return;
    const created = await adapter.createProject(name, { deal: structuredClone(seedDeal) });
    await refreshProjects();
    setActiveProject(created);
  };

  const openProject = async (id: string) => {
    const found = await adapter.getProject(id);
    if (found) setActiveProject(found);
  };

  const renameProject = async (project: ProjectSummary) => {
    const next = window.prompt('Rename project', project.name);
    if (!next) return;
    await adapter.updateProject(project.id, { name: next });
    await refreshProjects();
    if (activeProject?.id === project.id) {
      const reloaded = await adapter.getProject(project.id);
      setActiveProject(reloaded);
    }
  };

  const duplicateProject = async (project: ProjectSummary) => {
    await adapter.duplicateProject(project.id);
    await refreshProjects();
  };

  const deleteProject = async (project: ProjectSummary) => {
    if (!window.confirm(`Delete ${project.name}?`)) return;
    await adapter.deleteProject(project.id);
    await refreshProjects();
    if (activeProject?.id === project.id) setActiveProject(null);
  };

  const persistActiveProject = async (deal: Deal, immediate = false) => {
    if (!activeProject) return;
    latestDealRef.current = deal;

    const run = async () => {
      const updated = await adapter.updateProject(activeProject.id, {
        state: { deal } as SavedProjectState
      });
      if (updated) setActiveProject(updated);
      await refreshProjects();
    };

    if (immediate) {
      await run();
      return;
    }

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      void run();
    }, 900);
  };

  const saveAsNew = async () => {
    if (!activeProject) return;
    const name = window.prompt('Save as new project name', `${activeProject.name} Copy`);
    if (!name) return;
    const created = await adapter.createProject(name, {
      deal: structuredClone(activeProject.state.deal)
    });
    await refreshProjects();
    setActiveProject(created);
  };

  if (activeProject) {
    return (
      <BuilderShell
        initialDeal={activeProject.state.deal}
        projectId={activeProject.id}
        projectName={activeProject.name}
        lastSavedAt={activeProject.updatedAt}
        onDealChange={(deal) => void persistActiveProject(deal)}
        onManualSave={() => latestDealRef.current && void persistActiveProject(latestDealRef.current, true)}
        onSaveAsNew={() => void saveAsNew()}
        onBackToProjects={() => setActiveProject(null)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projects Dashboard</h1>
            <p className="text-sm text-slate-600">Create, manage, and reopen your OM/BOV projects with local autosave.</p>
          </div>
          <button className="rounded bg-brandNavy px-4 py-2 text-white" onClick={() => void createProject()}>+ New Project</button>
        </header>

        <section className="mb-4 grid grid-cols-[1fr_220px] gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by project, property, or report type"
            className="rounded border bg-white px-3 py-2"
          />
          <select className="rounded border bg-white px-3 py-2" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="updated-desc">Last edited (newest)</option>
            <option value="updated-asc">Last edited (oldest)</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <article key={project.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm text-slate-600">{project.propertyName}</p>
              <p className="text-xs text-slate-500">{project.reportType}</p>
              <p className="mt-2 text-xs text-slate-500">Last edited: {new Date(project.updatedAt).toLocaleString()}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="rounded border px-2 py-1 text-sm" onClick={() => void openProject(project.id)}>Open</button>
                <button className="rounded border px-2 py-1 text-sm" onClick={() => void renameProject(project)}>Rename</button>
                <button className="rounded border px-2 py-1 text-sm" onClick={() => void duplicateProject(project)}>Duplicate</button>
                <button className="rounded border px-2 py-1 text-sm text-red-700" onClick={() => void deleteProject(project)}>Delete</button>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="mt-12 rounded border border-dashed p-12 text-center text-slate-500">
            No projects found. Create a new project to start building your OM/BOV package.
          </div>
        )}
      </div>
    </main>
  );
}
