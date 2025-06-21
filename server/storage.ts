import { projects, type Project, type InsertProject } from "@shared/schema";

export interface IStorage {
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private currentId: number;

  constructor() {
    this.projects = new Map();
    this.currentId = 1;
    
    // Initialize with a sample project
    this.createProject({
      name: "Customer Management",
      description: "Sample customer management data model",
      modelData: {
        entities: [
          {
            id: "user-1",
            name: "User",
            tableName: "users",
            description: "System user entity",
            position: { x: 200, y: 100 },
            attributes: [
              { id: "attr-1", name: "id", type: "int", isPrimaryKey: true, isRequired: true, isUnique: true },
              { id: "attr-2", name: "name", type: "string", isPrimaryKey: false, isRequired: true, isUnique: false },
              { id: "attr-3", name: "email", type: "string", isPrimaryKey: false, isRequired: true, isUnique: true },
              { id: "attr-4", name: "created_at", type: "datetime", isPrimaryKey: false, isRequired: true, isUnique: false },
            ],
          },
          {
            id: "order-1",
            name: "Order",
            tableName: "orders",
            description: "Customer order entity",
            position: { x: 600, y: 100 },
            attributes: [
              { id: "attr-5", name: "id", type: "int", isPrimaryKey: true, isRequired: true, isUnique: true },
              { id: "attr-6", name: "user_id", type: "int", isPrimaryKey: false, isRequired: true, isUnique: false },
              { id: "attr-7", name: "total", type: "decimal", isPrimaryKey: false, isRequired: true, isUnique: false },
              { id: "attr-8", name: "status", type: "string", isPrimaryKey: false, isRequired: true, isUnique: false },
            ],
          },
        ],
        relationships: [
          {
            id: "rel-1",
            type: "association",
            sourceEntityId: "user-1",
            targetEntityId: "order-1",
            label: "has many",
            sourceCardinality: "1",
            targetCardinality: "*",
          },
        ],
        canvasSettings: {
          zoom: 1,
          position: { x: 0, y: 0 },
        },
      },
    });
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      ...insertProject, 
      id,
      description: insertProject.description ?? null 
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = { 
      ...existing, 
      ...updateData,
      description: updateData.description ?? existing.description
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
}

export const storage = new MemStorage();
