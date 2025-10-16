import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { StartMenu } from './StartMenu';
import { ContextMenu } from './ContextMenu';
import { apps } from '@/lib/apps';
import * as Icons from 'lucide-react';

const wallpapers = {
  'gradient-1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'gradient-2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'gradient-3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'gradient-4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'gradient-5': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
};

export function Desktop() {
  const { 
    wallpaper, 
    setContextMenu, 
    contextMenu, 
    openWindow, 
    updateTime,
    closeStartMenu 
  } = useStore();

  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [updateTime]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          label: 'View',
          icon: 'Eye',
          onClick: () => {},
        },
        {
          label: 'Sort by',
          icon: 'ArrowUpDown',
          onClick: () => {},
        },
        {
          label: 'Refresh',
          icon: 'RefreshCw',
          onClick: () => window.location.reload(),
        },
        {
          label: 'Personalize',
          icon: 'Palette',
          onClick: () => {
            const settingsApp = apps.find((a) => a.id === 'settings');
            if (settingsApp) openWindow(settingsApp);
          },
        },
      ],
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on desktop, not on children
    if (e.target === e.currentTarget) {
      closeStartMenu();
      setContextMenu(null);
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: wallpapers[wallpaper as keyof typeof wallpapers] || wallpapers['gradient-1'],
      }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      data-testid="desktop"
    >
      {/* Desktop Icons */}
      <div className="flex-1 p-6 grid grid-cols-auto-fill gap-6 content-start" style={{ gridTemplateColumns: 'repeat(auto-fill, 80px)' }}>
        {/* Desktop shortcuts could go here */}
      </div>

      <WindowManager />
      <Taskbar />
      <StartMenu />
      {contextMenu && <ContextMenu />}
    </div>
  );
}