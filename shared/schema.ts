import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  modelData: jsonb("model_data").notNull().$type<ModelData>(),
});

// Entity attribute type
export const attributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["int", "string", "decimal", "datetime", "boolean"]),
  isPrimaryKey: z.boolean().default(false),
  isRequired: z.boolean().default(false),
  isUnique: z.boolean().default(false),
});

// Entity type
export const entitySchema = z.object({
  id: z.string(),
  name: z.string(),
  tableName: z.string().optional(),
  description: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  attributes: z.array(attributeSchema),
});

// Relationship type
export const relationshipSchema = z.object({
  id: z.string(),
  type: z.enum(["association", "aggregation", "composition", "inheritance"]),
  sourceEntityId: z.string(),
  targetEntityId: z.string(),
  label: z.string().optional(),
  sourceCardinality: z.string().optional(),
  targetCardinality: z.string().optional(),
});

// Complete model data
export const modelDataSchema = z.object({
  entities: z.array(entitySchema),
  relationships: z.array(relationshipSchema),
  canvasSettings: z.object({
    zoom: z.number().default(1),
    position: z.object({
      x: z.number().default(0),
      y: z.number().default(0),
    }),
  }),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type ModelData = z.infer<typeof modelDataSchema>;
export type Entity = z.infer<typeof entitySchema>;
export type Attribute = z.infer<typeof attributeSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
