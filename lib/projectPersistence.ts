import { Deal } from '@/lib/types';

export interface SavedProjectState {
  deal: Deal;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  state: SavedProjectState;
}

export interface ProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  propertyName: string;
  reportType: string;
}

export interface ProjectPersistenceAdapter {
  listProjects(): Promise<ProjectSummary[]>;
  getProject(id: string): Promise<Project | null>;
  createProject(name: string, state: SavedProjectState): Promise<Project>;
  updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'state'>>): Promise<Project | null>;
  deleteProject(id: string): Promise<void>;
  duplicateProject(id: string): Promise<Project | null>;
}

const STORAGE_KEY = 'cre_om_projects_v1';

function readAll(): Project[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function writeAll(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export class LocalStorageProjectAdapter implements ProjectPersistenceAdapter {
  async listProjects(): Promise<ProjectSummary[]> {
    return readAll().map((project) => ({
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      propertyName: project.state.deal.property.propertyName,
      reportType: project.state.deal.reportType
    }));
  }

  async getProject(id: string): Promise<Project | null> {
    return readAll().find((project) => project.id === id) ?? null;
  }

  async createProject(name: string, state: SavedProjectState): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
      state
    };

    const projects = readAll();
    projects.unshift(project);
    writeAll(projects);

    return project;
  }

  async updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'state'>>): Promise<Project | null> {
    const projects = readAll();
    const index = projects.findIndex((project) => project.id === id);
    if (index < 0) return null;

    const next: Project = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    projects[index] = next;
    writeAll(projects);
    return next;
  }

  async deleteProject(id: string): Promise<void> {
    writeAll(readAll().filter((project) => project.id !== id));
  }

  async duplicateProject(id: string): Promise<Project | null> {
    const project = await this.getProject(id);
    if (!project) return null;

    return this.createProject(`${project.name} Copy`, {
      deal: structuredClone(project.state.deal)
    });
  }
}
