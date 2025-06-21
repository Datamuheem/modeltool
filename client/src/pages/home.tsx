import { useParams } from "wouter";
import Canvas from "@/components/modeling/canvas";
import Sidebar from "@/components/modeling/sidebar";
import RightPanel from "@/components/modeling/right-panel";
import TopToolbar from "@/components/modeling/top-toolbar";
import Chatbot from "@/components/modeling/chatbot";
import { useModelingStore } from "@/lib/modeling-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Home() {
  const { id } = useParams<{ id?: string }>();
  const { setCurrentProject, currentProject } = useModelingStore();

  // Load project if ID is provided
  const { data: project, isLoading } = useQuery({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  // Load all projects for sidebar
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    } else if (!id && projects?.length > 0) {
      // Load first project if no specific project ID
      setCurrentProject(projects[0]);
    }
  }, [project, projects, id, setCurrentProject]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar projects={projects || []} />
      
      <div className="flex-1 flex flex-col">
        <TopToolbar />
        
        <div className="flex flex-1 overflow-hidden">
          <Canvas />
          <RightPanel />
        </div>
      </div>
      
      <Chatbot />
    </div>
  );
}
