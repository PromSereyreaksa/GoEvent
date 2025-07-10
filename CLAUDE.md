# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoEvent is a React-based event management application built with Vite. It provides event creation, management, team collaboration, and guest management functionality. The application uses Redux for state management and integrates with a backend API for data persistence.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Architecture

### Frontend Stack
- **React 19** with functional components and hooks
- **Vite** for build tooling and development server
- **Redux Toolkit** for state management
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Lucide React** for icons

### State Management (Redux)
The application uses Redux Toolkit with the following slices:
- `authSlice` - Authentication state and user session
- `eventSlice` - Event data and operations
- `guestSlice` - Guest management for events
- `userSlice` - User profile and preferences
- `teamSlice` - Team collaboration features
- `notificationsSlice` - System notifications

### API Integration
- **Base URL**: Configured via `VITE_API_URL` environment variable, defaults to `http://localhost:8000`
- **Authentication**: JWT-based with automatic token refresh
- **Data Transformation**: Backend/frontend data mapping in `src/utils/api.js`
- **Caching**: Simple in-memory cache with 5-minute TTL

### Route Structure
- **Public Routes**: `/` (landing), `/about`
- **Auth Routes**: `/sign-in`, `/sign-up`
- **Protected Routes**: All other routes require authentication
- **Event Routes**: `/events/*` - Full event management suite
- **Special Routes**: `/guests`, `/team`, `/settings`, `/user`

### Key Components Architecture

#### Event Management
- `EventManagementWrapper` - Provides event context and role-based access
- `EventForm` - Handles event creation/editing with comprehensive validation
- `EventList` - Displays events with filtering and sorting
- `TeamManagement` - Manages event team members and permissions

#### Authentication & Security
- `ProtectedRoute` - Wraps routes requiring authentication
- `RoleProtectedRoute` - Vendor-specific route protection
- `VendorProtectedRoute` - Additional vendor role checks
- `SecurityMonitor` - Real-time security monitoring component

#### Layout & UI
- `Header` - Main navigation with authentication state
- `Footer` - Site footer with links and information
- `AppSidebar` - Dashboard navigation sidebar
- `NotificationsDropdown` - Real-time notifications UI

### Data Flow Patterns

1. **Event Management**: Events are created through `EventForm`, stored in Redux via `eventSlice`, and synchronized with backend through `eventAPI`
2. **Team Collaboration**: Team members are managed through dedicated APIs with event-specific permissions
3. **Guest Management**: Guests are associated with events and managed through the `guestAPI`
4. **Authentication**: JWT tokens are automatically managed with refresh logic in `authAPI`

### Backend Integration

The API layer (`src/utils/api.js`) provides:
- **Event CRUD**: Full event lifecycle management
- **Team Management**: Add/remove team members with proper permissions
- **Guest Management**: Event-specific guest lists
- **Authentication**: Login, registration, profile management
- **File Uploads**: Event banners, logos, and media assets

### Important Development Notes

- **Environment Variables**: Configure `VITE_API_URL` for backend connection
- **Role-based Access**: Events have admin/team member hierarchies
- **Data Transformation**: Always use the transform functions in `api.js` for backend compatibility
- **Error Handling**: API errors are handled centrally with user-friendly messages
- **Caching**: API responses are cached client-side for performance

### Testing Approach

The project uses ESLint for code quality. Run `npm run lint` before committing changes to ensure code standards are maintained.

### Security Considerations

- JWT tokens are stored in localStorage with automatic refresh
- Protected routes enforce authentication
- Role-based access controls limit vendor-specific operations
- API requests include proper authentication headers
- Security monitoring is implemented via `SecurityMonitor` component