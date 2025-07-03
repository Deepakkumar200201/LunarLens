# Lunar Tracking Application

## Overview

This is a full-stack lunar tracking application that provides real-time moon phase data, astronomical calculations, and celestial insights. The application combines modern web technologies with astronomical calculations to deliver an immersive lunar tracking experience with a cosmic-themed UI.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cosmic theme variables
- **3D Visualization**: Three.js with React Three Fiber for 3D moon rendering

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Astronomical Calculations**: Custom service for moon phase, zodiac, and tidal calculations
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database migrations
- **Development Storage**: In-memory storage for development/testing

## Key Components

### Astronomical Calculation Engine
- **Moon Phase Calculations**: Precise lunar cycle calculations based on astronomical algorithms
- **Zodiac Positioning**: Real-time zodiac sign calculations for moon position
- **Tidal Data**: Calculated tidal information based on lunar influence
- **Position Calculations**: Right ascension, declination, altitude, and azimuth
- **Time Calculations**: Moonrise and moonset times for specific locations

### Data Models
- **Users**: User profiles with location preferences and settings
- **Moon Phases**: Historical and current moon phase data
- **Zodiac Positions**: Astrological positioning data
- **User Settings**: Customizable notification and display preferences

### UI Components
- **3D Moon Visualization**: Interactive 3D moon with accurate phase rendering
- **Lunar Calendar**: Monthly calendar view with phase indicators
- **Astronomical Data Cards**: Real-time celestial positioning information
- **Daily Insights**: Astrological and wellness recommendations
- **Navigation**: Responsive navigation with mobile-friendly design

## Data Flow

1. **Location Detection**: Client requests user's geolocation for accurate calculations
2. **API Requests**: Frontend queries `/api/moon/current` with location parameters
3. **Astronomical Processing**: Server calculates real-time lunar data using custom algorithms
4. **Data Caching**: TanStack Query caches responses with appropriate stale times
5. **UI Updates**: Components reactively update with new lunar data
6. **3D Rendering**: Moon visualization updates based on current phase and illumination

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe SQL ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **date-fns**: Date manipulation and formatting utilities

### UI Dependencies
- **@radix-ui/react-***: Headless UI primitives for accessible components
- **@react-three/fiber**: React renderer for Three.js 3D scenes
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library
- **class-variance-authority**: Type-safe variant API for component styles

### Development Dependencies
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles Node.js server to `dist/index.js`
3. **Static Assets**: Frontend assets served from `dist/public` directory

### Environment Configuration
- **Development**: Hot reload with Vite middleware integration
- **Production**: Express server serves static files and API routes
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Deployment Commands
- `npm run dev`: Development mode with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm start`: Production server startup
- `npm run db:push`: Database schema synchronization

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
