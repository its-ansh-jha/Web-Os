import { useStore } from '@/store/useStore';
import { Button } from './ui/button';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function Taskbar() {
  const { 
    windows, 
    activeWindowId, 
    focusWindow, 
    minimizeWindow,
    toggleStartMenu,
    isStartMenuOpen,
    time,
    theme,
    setTheme,
  } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 backdrop-blur-2xl bg-card/40 border-t border-white/10 flex items-center px-2 gap-2 z-[9999]" data-testid="taskbar">
      {/* Start Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10",
          isStartMenuOpen && "bg-primary text-primary-foreground"
        )}
        onClick={toggleStartMenu}
        data-testid="button-start-menu"
      >
        <Icons.Grid3x3 className="h-5 w-5" />
      </Button>

      {/* Running Apps */}
      <div className="flex-1 flex items-center gap-1">
        {windows.map((window) => {
          const IconComponent = Icons[window.icon as keyof typeof Icons] as any;
          return (
            <Button
              key={window.id}
              variant="ghost"
              className={cn(
                "h-10 px-3 gap-2",
                activeWindowId === window.id && "bg-primary/20",
                window.isMinimized && "opacity-50"
              )}
              onClick={() => {
                if (activeWindowId === window.id && !window.isMinimized) {
                  minimizeWindow(window.id);
                } else {
                  focusWindow(window.id);
                }
              }}
              data-testid={`taskbar-app-${window.appId}`}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span className="text-xs max-w-32 truncate">{window.title}</span>
            </Button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          data-testid="button-theme-toggle"
        >
          {theme === 'dark' ? (
            <Icons.Sun className="h-4 w-4" />
          ) : (
            <Icons.Moon className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-volume">
          <Icons.Volume2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-wifi">
          <Icons.Wifi className="h-4 w-4" />
        </Button>
        <div className="px-3 py-1 text-sm" data-testid="system-time">
          {format(time, 'HH:mm')}
        </div>
      </div>
    </div>
  );
}
