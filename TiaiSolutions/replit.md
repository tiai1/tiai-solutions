# TIAI Solutions Website

## Overview

TIAI Solutions is a full-stack web application for an automation-first consulting company that specializes in transforming business data into actionable decisions. The platform showcases services ranging from KPI dashboards and automated reporting to advanced decision systems, featuring a modern React frontend with Express.js backend infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built as a single-page application (SPA) using React 18 with TypeScript, designed for static hosting on GitHub Pages. The frontend employs a component-based architecture with:

- **Framework**: React with Vite as the build tool for fast development and optimized production builds
- **Styling System**: Tailwind CSS for utility-first styling with shadcn/ui component library for consistent UI patterns
- **Animation Framework**: Framer Motion for smooth page transitions and interactive elements, with GSAP ScrollTrigger for scroll-based animations
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Backend Architecture  
The server-side is structured as an Express.js application with TypeScript, designed to support both development and production environments:

- **Framework**: Express.js with middleware for CORS, rate limiting, and request/response logging
- **API Design**: RESTful endpoints under `/api` namespace for contacts, leads, and downloads
- **Storage Strategy**: Abstracted storage interface allowing for both in-memory (development) and PostgreSQL (production) implementations
- **Development Integration**: Vite middleware integration for hot module replacement during development

### Data Storage Solutions
The application implements a flexible storage architecture:

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Connection**: Neon Database serverless PostgreSQL for production hosting
- **Development Mode**: In-memory storage implementation for local development without database dependencies

### Authentication and Authorization
Currently implements a simplified approach suitable for a consulting website:

- **Rate Limiting**: IP-based rate limiting for API endpoints to prevent abuse
- **Form Security**: Honeypot fields for bot detection in contact forms
- **CORS Configuration**: Cross-origin resource sharing enabled for API access

### Component Design Patterns
The frontend follows a structured component hierarchy:

- **Layout Components**: Navbar, Footer, and ProgressRail for consistent page structure
- **Section Components**: Reusable Section wrapper with intersection observer for scroll animations
- **Form Components**: ContactForm with comprehensive validation and error handling
- **Data Visualization**: ChartReveal and BeforeAfter components for interactive data presentation
- **Card Components**: ServiceCard, TestimonialCard, and KPIStat for content display

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with React Router (Wouter) for navigation
- **Styling**: Tailwind CSS with PostCSS for processing
- **Component Library**: Radix UI primitives via shadcn/ui for accessible components
- **Animation**: Framer Motion for micro-interactions and Embla Carousel for content carousels
- **State Management**: TanStack React Query for API state and caching
- **Form Validation**: Zod for schema validation with React Hook Form integration
- **Date Handling**: date-fns for date formatting and manipulation

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support via tsx
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for API request/response validation
- **Development Tools**: Vite for frontend integration and esbuild for production bundling

### Development and Build Tools
- **Build System**: Vite with React plugin for frontend, esbuild for backend bundling
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint and Prettier configuration (referenced in components.json)
- **Replit Integration**: Runtime error overlay and cartographer plugins for development

### Cloud Services and APIs
- **Database Hosting**: Neon Database serverless PostgreSQL
- **Email Service**: Configured for Resend API integration (referenced in prompt documentation)
- **Analytics**: Custom event tracking system via API leads endpoint
- **Static Hosting**: Designed for GitHub Pages deployment with fallback API mocking

### Asset Management
- **Fonts**: Google Fonts integration (Inter, Space Grotesk, JetBrains Mono)
- **Icons**: Lucide React for consistent iconography
- **Images**: Lazy loading strategy with attached assets directory for static files