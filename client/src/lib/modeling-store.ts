import { create } from "zustand";
import { Project, Entity, ModelData } from "@shared/schema";
import { apiRequest } from "./queryClient";

interface ModelingState {
  currentProject: Project | null;
  selectedEntity: Entity | null;
  setCurrentProject: (project: Project) => void;
  setSelectedEntity: (entity: Entity | null) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (entity: Entity) => void;
  deleteEntity: (entityId: string) => void;
  updateProject: (project: Project) => void;
  saveProject: () => Promise<void>;
}

export const useModelingStore = create<ModelingState>((set, get) => ({
  currentProject: null,
  selectedEntity: null,
  
  setCurrentProject: (project) => {
    set({ currentProject: project, selectedEntity: null });
  },
  
  setSelectedEntity: (entity) => {
    set({ selectedEntity: entity });
  },
  
  addEntity: (entity) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      modelData: {
        ...currentProject.modelData,
        entities: [...currentProject.modelData.entities, entity],
      },
    };
    
    set({ currentProject: updatedProject, selectedEntity: entity });
  },
  
  updateEntity: (entity) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const updatedEntities = currentProject.modelData.entities.map(e =>
      e.id === entity.id ? entity : e
    );
    
    const updatedProject = {
      ...currentProject,
      modelData: {
        ...currentProject.modelData,
        entities: updatedEntities,
      },
    };
    
    set({ currentProject: updatedProject, selectedEntity: entity });
  },
  
  deleteEntity: (entityId) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const updatedEntities = currentProject.modelData.entities.filter(e => e.id !== entityId);
    const updatedRelationships = currentProject.modelData.relationships.filter(
      r => r.sourceEntityId !== entityId && r.targetEntityId !== entityId
    );
    
    const updatedProject = {
      ...currentProject,
      modelData: {
        ...currentProject.modelData,
        entities: updatedEntities,
        relationships: updatedRelationships,
      },
    };
    
    set({ currentProject: updatedProject, selectedEntity: null });
  },
  
  updateProject: (project) => {
    set({ currentProject: project });
  },
  
  saveProject: async () => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    await apiRequest("PUT", `/api/projects/${currentProject.id}`, {
      name: currentProject.name,
      description: currentProject.description,
      modelData: currentProject.modelData,
    });
  },
}));
