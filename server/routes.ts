import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Update project
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Generate Python code for a project
  app.post("/api/projects/:id/generate-code", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Generate Python classes from model data
      const { entities } = project.modelData;
      let code = "from dataclasses import dataclass\nfrom typing import Optional\nfrom datetime import datetime\nfrom decimal import Decimal\n\n";

      entities.forEach(entity => {
        code += `@dataclass\nclass ${entity.name}:\n`;
        
        entity.attributes.forEach(attr => {
          const pythonType = getPythonType(attr.type);
          const optional = attr.isRequired ? "" : "Optional[";
          const closing = attr.isRequired ? "" : "]";
          const defaultValue = attr.isRequired ? "" : " = None";
          
          code += `    ${attr.name}: ${optional}${pythonType}${closing}${defaultValue}\n`;
        });
        
        code += "\n";
      });

      res.json({ code });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate code" });
    }
  });

  // AI Chat endpoint (placeholder for now)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      // Simple AI responses for now
      const responses = [
        "I can help you design better data models. What specific relationship are you trying to model?",
        "For user authentication, consider adding a User entity with username, email, password_hash, and role attributes.",
        "That's a great question! For one-to-many relationships, use foreign keys in the 'many' side entity.",
        "Consider adding indexes on frequently queried fields like email or username for better performance.",
        "For timestamps, I recommend adding created_at and updated_at fields to track record lifecycle."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      res.json({ 
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getPythonType(type: string): string {
  switch (type) {
    case "int": return "int";
    case "string": return "str";
    case "decimal": return "Decimal";
    case "datetime": return "datetime";
    case "boolean": return "bool";
    default: return "str";
  }
}
