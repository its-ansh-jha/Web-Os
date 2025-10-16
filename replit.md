# WebOS - A Fully Functional Web-Based Operating System

## Overview

WebOS is a comprehensive, fully functional web-based operating system featuring 20+ applications with a stunning glassmorphism UI. Built with React, TypeScript, and modern web technologies, it provides a desktop-like experience directly in the browser.

## Recent Changes (October 2025)

- Initial implementation of complete web OS with 20+ applications
- Implemented desktop environment with window management, taskbar, and start menu
- Created all core applications: File Manager, Text Editor, Code Editor, Terminal, Calculator, Paint, Games (Snake, Minesweeper, Chess), Music Player, Photo Gallery, Calendar, Weather, Maps, Clock, Task Manager, Notepad, Camera, Web Browser, and Settings
- Implemented comprehensive backend API for data persistence
- Applied glassmorphism design system with smooth animations

## Project Architecture

### Frontend Structure
- **Desktop Environment**: Main container with dynamic wallpaper, taskbar, and start menu
- **Window Management**: Draggable, resizable, minimizable, maximizable windows using react-rnd
- **State Management**: Zustand for global state (windows, files, settings, etc.)
- **Routing**: Single-page application with desktop paradigm
- **Styling**: Tailwind CSS with glassmorphism design system

### Applications

1. **File Manager** - Browse files/folders with grid/list views, create/delete operations
2. **Text Editor** - Multi-tab editor with syntax highlighting, find/replace
3. **Code Editor** - Monaco-based IDE with file tree, syntax highlighting, multi-language support
4. **Terminal** - Command-line interface with built-in commands (help, ls, pwd, calc, etc.)
5. **Calculator** - Standard calculator with full arithmetic operations
6. **Paint** - Drawing app with brush, eraser, shapes, color picker
7. **Snake Game** - Classic snake with score tracking and high scores
8. **Minesweeper** - Classic minesweeper with configurable difficulty
9. **Chess** - Chess game with AI opponent and move validation
10. **Music Player** - Media player with playlist, controls, and visualizer
11. **Photo Gallery** - Image viewer with zoom, rotate, slideshow
12. **Calendar** - Event management with date picker and categories
13. **Weather** - Weather forecast with animations and 5-day outlook
14. **Maps** - Interactive map placeholder with search
15. **Clock** - World clock, stopwatch, and countdown timer
16. **Task Manager** - Running apps list with CPU/memory graphs
17. **Notepad** - Quick notes with list view and editor
18. **Camera** - Webcam access with photo capture
19. **Web Browser** - Tab-based browser with bookmarks and navigation
20. **Settings** - Theme, wallpaper, and system preferences

### Backend Structure
- **Storage**: In-memory storage with full CRUD operations
- **API Routes**: RESTful endpoints for all data operations
  - `/api/files` - File system operations
  - `/api/settings` - User preferences
  - `/api/calendar-events` - Calendar management
  - `/api/notes` - Notes operations
  - `/api/high-scores` - Game scores
  - `/api/bookmarks` - Browser bookmarks
  - `/api/paint-canvases` - Saved drawings
  - `/api/chess-games` - Saved chess games

### Design System

**Colors** (Dark Mode):
- Background: Deep blue-grey (220 25% 12%)
- Primary: Vibrant blue (210 100% 55%)
- Card: Dark with 60% opacity + backdrop blur
- Glassmorphism: backdrop-blur-xl with translucent backgrounds

**Typography**:
- Font Family: Inter, system fonts
- Monospace: Fira Code, Cascadia Code, Monaco
- Window Titles: 14px, font-weight 600
- Body: 14px, font-weight 400

**Spacing**:
- Window padding: p-4 to p-6
- Toolbar spacing: gap-2 to gap-3
- Section gaps: gap-4 to gap-8

**Animations**:
- Window open/close: Scale + opacity fade (200ms)
- Hover: Subtle elevation with hover-elevate utility
- Active: More dramatic elevation with active-elevate-2

## Key Features

- **Dynamic Wallpapers**: 5 beautiful gradient wallpapers with smooth transitions
- **Window Management**: Full drag, resize, minimize, maximize, close functionality
- **Dark/Light Mode**: Complete theme system with instant switching
- **Context Menus**: Right-click menus on desktop and files
- **System Tray**: Time display, volume, wifi, theme toggle
- **Smooth Animations**: Framer Motion for fluid transitions
- **Responsive Design**: Works across different screen sizes

## Technical Stack

### Dependencies
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **State**: Zustand for global state management
- **UI Components**: Radix UI primitives with custom styling
- **Code Editor**: Monaco Editor (VS Code engine)
- **Window System**: react-rnd for draggable/resizable windows
- **Chess**: chess.js for game logic
- **Calendar**: react-calendar
- **Data Fetching**: TanStack Query (React Query v5)
- **Backend**: Express.js with TypeScript
- **Validation**: Zod schemas

### File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── Desktop.tsx          # Main desktop container
│   │   ├── WindowManager.tsx    # Window management system
│   │   ├── Taskbar.tsx          # Bottom taskbar
│   │   ├── StartMenu.tsx        # Application launcher
│   │   ├── ContextMenu.tsx      # Right-click menus
│   │   ├── apps/                # All application components
│   │   └── ui/                  # Shadcn UI components
│   ├── store/
│   │   └── useStore.ts          # Zustand global state
│   ├── lib/
│   │   ├── apps.ts              # App definitions
│   │   └── queryClient.ts       # React Query setup
│   └── App.tsx                  # App entry point
│
server/
├── storage.ts                    # In-memory storage implementation
└── routes.ts                     # API routes

shared/
└── schema.ts                     # Shared TypeScript types and Zod schemas
```

## Development Guidelines

### Adding New Applications

1. Create component in `client/src/components/apps/[AppName].tsx`
2. Add app definition to `client/src/lib/apps.ts`
3. Import component in `WindowManager.tsx`
4. Add any required backend routes in `server/routes.ts`
5. Update storage interface if persistence is needed

### Styling Conventions

- Use glassmorphism: `backdrop-blur-xl bg-card/60`
- Border styling: `border border-white/10`
- Hover effects: Use `hover-elevate` utility
- Active effects: Use `active-elevate-2` utility
- Consistent spacing: Use Tailwind spacing scale (p-4, gap-2, etc.)

### Window Management

Windows are managed through Zustand store:
- `openWindow(app, data?)` - Open new window
- `closeWindow(id)` - Close window
- `minimizeWindow(id)` - Toggle minimize
- `maximizeWindow(id)` - Toggle maximize
- `focusWindow(id)` - Bring to front

## User Preferences

All user preferences are stored in-memory and persist during the session:
- Theme (light/dark)
- Wallpaper selection
- Window positions and sizes
- Application data (files, notes, bookmarks, etc.)

## Running the Application

The application is already configured to run:
```bash
npm run dev
```

This starts:
- Express server (backend)
- Vite dev server (frontend)
- Both on the same port (port 5000)

## Future Enhancements

Potential additions:
- Video Editor with timeline and effects
- Email Client with inbox management
- PDF Viewer with annotations
- Screen Recorder for desktop capture
- Persistent storage using IndexedDB
- Multi-user support with authentication
