# Selection Sort Visualizer

## Overview

This is a full-stack web application that visualizes the Selection Sort algorithm. The application provides an interactive educational tool where users can watch the sorting process step-by-step, control playback speed, and see detailed statistics about the algorithm's performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack React Query for server state
- **Animation**: CSS transitions and animations for sorting visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **Session Management**: Basic memory storage for user data

### Data Storage
- **Database**: PostgreSQL (configured but using in-memory storage currently)
- **ORM**: Drizzle ORM with Zod for schema validation
- **Connection**: Neon serverless PostgreSQL driver
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Sorting Visualization Engine
- **Purpose**: Generates step-by-step visualization of Selection Sort algorithm
- **Features**: 
  - Real-time array state tracking
  - Element comparison highlighting
  - Swap animation support
  - Performance metrics (comparisons, swaps)

### Interactive Controls
- **Playback Controls**: Play, pause, step forward/backward, reset
- **Speed Control**: Adjustable animation speed with slider
- **Input Management**: Custom array input with validation
- **Visual Feedback**: Color-coded element states (sorted, unsorted, comparing, swapping, minimum)

### UI Component System
- **Design System**: shadcn/ui providing consistent, accessible components
- **Theming**: CSS custom properties with dark/light mode support
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Data Flow

1. **User Input**: Array input is parsed and validated
2. **Algorithm Processing**: Selection sort algorithm generates complete step sequence
3. **State Management**: React manages current step index and playback state
4. **Visualization Rendering**: Array elements are rendered with appropriate styling based on current algorithm state
5. **User Interaction**: Controls update playback state and trigger re-renders

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, esbuild
- **Styling**: Tailwind CSS, PostCSS

### UI Component Libraries
- **Radix UI**: Complete set of accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating component variants

### Backend Dependencies
- **Express.js**: Web framework for API routes
- **Drizzle ORM**: Type-safe database queries and migrations
- **Neon**: Serverless PostgreSQL connection
- **Connect PG Simple**: PostgreSQL session store

### Development Tools
- **tsx**: TypeScript execution for development
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR for frontend, tsx for backend
- **Replit Integration**: Optimized for Replit development environment with cartographer plugin
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets in production
- **Database**: PostgreSQL with Drizzle migrations

### Architecture Decisions

#### Frontend Framework Choice
- **Problem**: Need interactive, real-time visualization with smooth animations
- **Solution**: React with TypeScript for type safety and component reusability
- **Rationale**: React's virtual DOM enables efficient re-renders during animation steps

#### UI Component Strategy
- **Problem**: Need consistent, accessible UI components quickly
- **Solution**: shadcn/ui built on Radix UI primitives
- **Pros**: Pre-built accessibility, consistent design, easy customization
- **Cons**: Additional bundle size, learning curve for component API

#### Database Architecture
- **Problem**: Need persistent storage with type safety
- **Solution**: Drizzle ORM with PostgreSQL
- **Rationale**: Type-safe queries, excellent TypeScript integration, serverless compatibility

#### Styling Approach
- **Problem**: Need responsive, themeable UI with minimal CSS
- **Solution**: Tailwind CSS with CSS custom properties
- **Pros**: Utility-first approach, excellent tree-shaking, consistent spacing
- **Cons**: Large class names, requires Tailwind knowledge

The application prioritizes educational value through clear visualizations, interactive controls, and performance metrics while maintaining a clean, accessible user interface.