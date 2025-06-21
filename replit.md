# Data Modeling Application

## Overview

This is a full-stack data modeling application built with React (frontend) and Express.js (backend). The application allows users to create, visualize, and manage entity-relationship diagrams with an interactive canvas-based interface. Users can design database schemas visually, manage entity attributes, relationships, and generate code from their models.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development and optimized builds
- **State Management**: Zustand for global application state
- **UI Components**: Shadcn/UI component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Canvas/Diagramming**: React Flow for interactive entity-relationship diagrams
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: Connect-pg-simple for PostgreSQL-backed sessions
- **Database Provider**: Neon Database (serverless PostgreSQL)

### Data Storage Architecture
- **Primary Database**: PostgreSQL for persistent data storage
- **Schema Definition**: Shared TypeScript schemas using Drizzle ORM and Zod
- **In-Memory Storage**: Development fallback with sample data
- **Session Management**: PostgreSQL-backed session storage

## Key Components

### Data Models
- **Projects**: Top-level container for data models with metadata
- **Entities**: Database tables with attributes and positioning information
- **Attributes**: Entity fields with type, constraints, and validation rules
- **Relationships**: Connections between entities with cardinality and types
- **Model Data**: JSON structure containing the complete diagram state

### Frontend Components
- **Canvas**: Interactive diagram editor using React Flow
- **Entity Nodes**: Draggable entity representations with attribute lists
- **Sidebar**: Project management and tool palette
- **Right Panel**: Property editor for selected entities and attributes
- **Top Toolbar**: Canvas controls and AI assistant toggle
- **Chatbot**: AI assistant for data modeling guidance

### Backend Services
- **Project Management**: CRUD operations for projects and model data
- **Storage Interface**: Abstracted storage layer supporting multiple backends
- **API Routes**: RESTful endpoints for project operations

## Data Flow

1. **Project Loading**: Client fetches project list and specific project data via React Query
2. **Canvas Interaction**: User interactions with entities update local state via Zustand
3. **Real-time Updates**: Canvas changes are reflected immediately in the property panel
4. **Persistence**: Changes are saved to the backend through API calls
5. **State Synchronization**: React Query manages cache invalidation and refetching

### Entity Management Flow
- Create entities through sidebar tools or canvas interactions
- Edit entity properties in the right panel
- Drag entities on canvas to update positions
- Add/edit attributes with type validation
- Generate code from entity definitions

### Relationship Management Flow
- Connect entities by dragging between connection handles
- Define relationship types and cardinalities
- Visualize relationships as animated edges on canvas

## External Dependencies

### Frontend Dependencies
- **React Flow**: Interactive node-based editor for diagrams
- **TanStack Query**: Server state management and caching
- **Zustand**: Lightweight state management
- **Shadcn/UI**: Pre-built accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition

### Backend Dependencies
- **Drizzle ORM**: Type-safe SQL database toolkit
- **Neon Database**: Serverless PostgreSQL provider
- **Express.js**: Web application framework
- **Connect-pg-simple**: PostgreSQL session store

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **Drizzle Kit**: Database schema management tools

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database with environment-based connection strings
- **Build Process**: Concurrent frontend and backend builds

### Production Deployment
- **Platform**: Replit with autoscale deployment target
- **Build Command**: `npm run build` (Vite + ESBuild)
- **Start Command**: `npm run start` (production Node.js server)
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Static Assets**: Vite builds frontend to `dist/public`, served by Express

### Environment Configuration
- **Database URL**: Environment variable for PostgreSQL connection
- **Session Configuration**: PostgreSQL-backed sessions for scalability
- **Asset Serving**: Express serves built React application in production

### Database Management
- **Schema Migrations**: Drizzle Kit for version-controlled schema changes
- **Connection Pooling**: Neon Database handles connection management
- **Type Safety**: Shared schema definitions between frontend and backend

## Recent Changes
```
- June 21, 2025: Transformed into visual data modeling platform
- Fixed entity property synchronization between right panel and canvas
- Added real-time updates for entity edits
- Implemented AI chatbot for data modeling assistance
- Enhanced drag-and-drop functionality for entity creation
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```