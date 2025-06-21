import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useModelingStore } from "@/lib/modeling-store";
import { Project, insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { 
  Save, 
  Download, 
  Plus, 
  Table, 
  ArrowRight, 
  Diamond, 
  Droplet, 
  ArrowUp,
  Folder,
  FileCode
} from "lucide-react";

interface SidebarProps {
  projects: Project[];
}

const newProjectSchema = insertProjectSchema.extend({
  name: z.string().min(1, "Project name is required"),
});

type NewProjectForm = z.infer<typeof newProjectSchema>;

export default function Sidebar({ projects }: SidebarProps) {
  const { currentProject, saveProject } = useModelingStore();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<NewProjectForm>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      modelData: {
        entities: [],
        relationships: [],
        canvasSettings: {
          zoom: 1,
          position: { x: 0, y: 0 },
        },
      },
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: NewProjectForm) => apiRequest("POST", "/api/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsNewProjectOpen(false);
      form.reset();
    },
  });

  const saveProjectMutation = useMutation({
    mutationFn: () => saveProject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  const exportCodeMutation = useMutation({
    mutationFn: () => 
      apiRequest("POST", `/api/projects/${currentProject?.id}/generate-code`).then(res => res.json()),
    onSuccess: (data) => {
      // Download the generated code
      const blob = new Blob([data.code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentProject?.name || "model"}.py`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onSubmit = (data: NewProjectForm) => {
    createProjectMutation.mutate(data);
  };

  return (
    <div className="w-64 bg-surface border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Table className="text-white text-sm" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-gray-900">DataModel Studio</h1>
            <p className="text-xs text-gray-500">Visual Data Modeling</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Components</h3>
        <div className="space-y-2">
          <div
            className="flex items-center p-2 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors"
            onDragStart={(event) => onDragStart(event, "entity")}
            draggable
          >
            <Table className="text-primary mr-3" size={16} />
            <span className="text-sm font-medium">Entity</span>
          </div>
          
          <div
            className="flex items-center p-2 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors"
            onDragStart={(event) => onDragStart(event, "association")}
            draggable
          >
            <ArrowRight className="text-secondary mr-3" size={16} />
            <span className="text-sm font-medium">Association</span>
          </div>
          
          <div
            className="flex items-center p-2 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors"
            onDragStart={(event) => onDragStart(event, "aggregation")}
            draggable
          >
            <Diamond className="text-secondary mr-3" size={16} />
            <span className="text-sm font-medium">Aggregation</span>
          </div>
          
          <div
            className="flex items-center p-2 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors"
            onDragStart={(event) => onDragStart(event, "composition")}
            draggable
          >
            <Droplet className="text-secondary mr-3" size={16} />
            <span className="text-sm font-medium">Composition</span>
          </div>
          
          <div
            className="flex items-center p-2 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors"
            onDragStart={(event) => onDragStart(event, "inheritance")}
            draggable
          >
            <ArrowUp className="text-secondary mr-3" size={16} />
            <span className="text-sm font-medium">Inheritance</span>
          </div>
        </div>
      </div>

      {/* Project Explorer */}
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Project Explorer</h3>
          <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter project name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Project description (optional)" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createProjectMutation.isPending}
                  >
                    {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-1">
          {projects.map((project) => (
            <div key={project.id} className="space-y-1">
              <div className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                <Folder className="text-gray-400 mr-2" size={16} />
                <span className="text-sm">{project.name}</span>
              </div>
              <div className="ml-4">
                <div className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <FileCode className="text-primary mr-2" size={16} />
                  <span className="text-sm text-primary">{project.name.toLowerCase().replace(/\s+/g, '_')}_model.py</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={() => saveProjectMutation.mutate()}
            disabled={!currentProject || saveProjectMutation.isPending}
          >
            <Save className="mr-2" size={16} />
            {saveProjectMutation.isPending ? "Saving..." : "Save Model"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => exportCodeMutation.mutate()}
            disabled={!currentProject || exportCodeMutation.isPending}
          >
            <Download className="mr-2" size={16} />
            {exportCodeMutation.isPending ? "Generating..." : "Export Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
