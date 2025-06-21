# ModelCraft - Visual Data Modeling Platform

ModelCraft is a visual data modeling platform that enables users to design, visualize, and generate code for data models using a graphical interface. It allows defining entities (classes) and their attributes, building UML-like relationships between them, and automatically generates class files.

## Features

- **Visual Canvas**: Interactive drag-and-drop interface for creating data models
- **Entity Management**: Create and edit database entities with attributes and properties
- **Real-time Property Editor**: Live editing of entity properties with instant canvas updates
- **Relationship Modeling**: Support for associations, aggregations, compositions, and inheritance
- **Code Generation**: Automatic Python class generation from visual models
- **AI Assistant**: Built-in chatbot for data modeling guidance and best practices
- **Project Management**: Save, load, and manage multiple data modeling projects

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **ReactFlow** for interactive node-based diagramming
- **Zustand** for state management
- **TanStack Query** for server state management
- **Shadcn/UI** with Radix UI components
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL support
- **Zod** for runtime validation
- **In-memory storage** for development (PostgreSQL ready)

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Datamuheem/ModelCraft.git
cd ModelCraft
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

### Creating Entities
1. Drag the "Entity" component from the sidebar onto the canvas
2. Click on an entity to select it and edit properties in the right panel
3. Add, edit, or remove attributes using the property editor
4. Set attribute types (int, string, decimal, datetime, boolean)
5. Configure primary keys, required fields, and unique constraints

### Managing Projects
- Create new projects using the "+" button in the sidebar
- Save your work using the "Save Model" button
- Export generated Python code with the "Export Code" button

### AI Assistant
- Click the "AI Assistant" button in the top toolbar
- Ask questions about data modeling best practices
- Get suggestions for entity relationships and structure

## Project Structure

```
ModelCraft/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and stores
│   │   └── pages/         # Application pages
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   └── vite.ts           # Vite development server
├── shared/               # Shared types and schemas
│   └── schema.ts        # Drizzle schemas and Zod validators
└── package.json         # Dependencies and scripts
```

## API Endpoints

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/generate-code` - Generate Python code
- `POST /api/chat` - AI chatbot interaction

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database Setup
The application uses in-memory storage by default. To use PostgreSQL:

1. Set up a PostgreSQL database (Neon Database recommended)
2. Add database connection string to environment variables
3. Update storage configuration in `server/storage.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue on GitHub or contact the development team.