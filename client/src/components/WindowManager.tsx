import { Rnd } from 'react-rnd';
import { useStore } from '@/store/useStore';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// Import all app components
import { FileManager } from './apps/FileManager';
import { TextEditor } from './apps/TextEditor';
import { CodeEditor } from './apps/CodeEditor';
import { TerminalApp } from './apps/TerminalApp';
import { Calculator } from './apps/Calculator';
import { Paint } from './apps/Paint';
import { SnakeGame } from './apps/SnakeGame';
import { Minesweeper } from './apps/Minesweeper';
import { ChessGame } from './apps/ChessGame';
import { MusicPlayer } from './apps/MusicPlayer';
import { PhotoGallery } from './apps/PhotoGallery';
import { CalendarApp } from './apps/CalendarApp';
import { Weather } from './apps/Weather';
import { Maps } from './apps/Maps';
import { ClockApp } from './apps/ClockApp';
import { TaskManager } from './apps/TaskManager';
import { Notepad } from './apps/Notepad';
import { CameraApp } from './apps/CameraApp';
import { Browser } from './apps/Browser';
import { SettingsApp } from './apps/SettingsApp';
import { EmailClient } from './apps/EmailClient';
import { VideoPlayer } from './apps/VideoPlayer';

const componentMap: Record<string, any> = {
  FileManager,
  TextEditor,
  CodeEditor,
  TerminalApp,
  Calculator,
  Paint,
  SnakeGame,
  Minesweeper,
  ChessGame,
  MusicPlayer,
  PhotoGallery,
  CalendarApp,
  Weather,
  Maps,
  ClockApp,
  TaskManager,
  Notepad,
  CameraApp,
  Browser,
  SettingsApp,
  EmailClient,
  VideoPlayer,
};

export function WindowManager() {
  const { 
    windows, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId 
  } = useStore();

  return (
    <>
      {windows.map((window) => {
        if (window.isMinimized) return null;

        const Component = componentMap[window.component];
        const IconComponent = Icons[window.icon as keyof typeof Icons] as any;

        const position = window.isMaximized
          ? { x: 0, y: 0 }
          : { x: window.x, y: window.y };

        const size = window.isMaximized
          ? { width: '100vw', height: 'calc(100vh - 56px)' }
          : { width: window.width, height: window.height };

        return (
          <Rnd
            key={window.id}
            position={position}
            size={size}
            onDragStop={(e, d) => {
              if (!window.isMaximized) {
                updateWindowPosition(window.id, d.x, d.y);
              }
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!window.isMaximized) {
                updateWindowSize(
                  window.id,
                  parseInt(ref.style.width),
                  parseInt(ref.style.height)
                );
                updateWindowPosition(window.id, position.x, position.y);
              }
            }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            dragHandleClassName="window-handle"
            enableResizing={!window.isMaximized}
            disableDragging={window.isMaximized}
            style={{
              zIndex: window.zIndex,
            }}
            data-testid={`window-${window.appId}`}
          >
            <div
              className={cn(
                "flex flex-col h-full rounded-xl overflow-hidden shadow-2xl border border-white/10",
                "backdrop-blur-xl bg-card/60",
                activeWindowId === window.id && "ring-1 ring-primary/50"
              )}
              onMouseDown={() => focusWindow(window.id)}
            >
              {/* Title Bar */}
              <div className="window-handle flex items-center justify-between h-12 px-4 bg-card/40 border-b border-white/10 cursor-move">
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span className="text-sm font-medium">{window.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      minimizeWindow(window.id);
                    }}
                    data-testid={`button-minimize-${window.appId}`}
                  >
                    <Icons.Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      maximizeWindow(window.id);
                    }}
                    data-testid={`button-maximize-${window.appId}`}
                  >
                    {window.isMaximized ? (
                      <Icons.Minimize2 className="h-4 w-4" />
                    ) : (
                      <Icons.Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-destructive/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeWindow(window.id);
                    }}
                    data-testid={`button-close-${window.appId}`}
                  >
                    <Icons.X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden bg-background/95">
                {Component ? <Component data={window.data} /> : <div>App not found</div>}
              </div>
            </div>
          </Rnd>
        );
      })}
    </>
  );
}
