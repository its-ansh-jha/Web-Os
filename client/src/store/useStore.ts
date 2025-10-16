import { create } from 'zustand';

export interface Window {
  id: string;
  appId: string;
  title: string;
  icon: string;
  component: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  data?: any;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: string;
  defaultWidth: number;
  defaultHeight: number;
}

interface Store {
  // Window Management
  windows: Window[];
  activeWindowId: string | null;
  nextZIndex: number;
  openWindow: (app: AppDefinition, data?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;

  // Desktop & System UI State
  theme: 'light' | 'dark';
  wallpaper: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setWallpaper: (wallpaper: string) => void;
  time: Date;
  updateTime: () => void;

  // Current Path (for File Manager)
  currentPath: string;
  setCurrentPath: (path: string) => void;

  // Terminal History (local only, not persisted)
  terminalHistory: string[];
  addTerminalCommand: (command: string) => void;

  // Context Menu
  contextMenu: {
    x: number;
    y: number;
    items: Array<{ label: string; onClick: () => void; icon?: string }>;
  } | null;
  setContextMenu: (menu: Store['contextMenu']) => void;

  // Start Menu
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
}

export const useStore = create<Store>((set, get) => ({
  // Window Management
  windows: [],
  activeWindowId: null,
  nextZIndex: 1000,

  openWindow: (app, data) => {
    const id = `${app.id}-${Date.now()}`;
    const centerX = window.innerWidth / 2 - app.defaultWidth / 2;
    const centerY = window.innerHeight / 2 - app.defaultHeight / 2;
    
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          appId: app.id,
          title: app.name,
          icon: app.icon,
          component: app.component,
          x: centerX,
          y: centerY,
          width: app.defaultWidth,
          height: app.defaultHeight,
          isMinimized: false,
          isMaximized: false,
          zIndex: state.nextZIndex,
          data,
        },
      ],
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }));
  },

  focusWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  updateWindowSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w
      ),
    }));
  },

  // Desktop & System
  theme: 'dark',
  wallpaper: 'gradient-1',
  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  setWallpaper: (wallpaper) => set({ wallpaper }),
  time: new Date(),
  updateTime: () => set({ time: new Date() }),

  // Current Path
  currentPath: 'root',
  setCurrentPath: (path) => set({ currentPath: path }),

  // Terminal History
  terminalHistory: [],
  addTerminalCommand: (command) =>
    set((state) => ({ terminalHistory: [...state.terminalHistory, command] })),

  // Context Menu
  contextMenu: null,
  setContextMenu: (menu) => set({ contextMenu: menu }),

  // Start Menu
  isStartMenuOpen: false,
  toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),
}));

// Initialize dark mode
if (typeof window !== 'undefined') {
  document.documentElement.classList.add('dark');
}
