import { useStore } from '@/store/useStore';
import { apps } from '@/lib/apps';
import { Button } from './ui/button';
import { Input } from './ui/input';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function StartMenu() {
  const { isStartMenuOpen, openWindow, closeStartMenu } = useStore();
  const [search, setSearch] = useState('');

  if (!isStartMenuOpen) return null;

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenApp = (app: typeof apps[0]) => {
    openWindow(app);
    closeStartMenu();
    setSearch('');
  };

  return (
    <div
      className="fixed bottom-16 left-4 w-96 h-[600px] backdrop-blur-xl bg-card/90 rounded-xl border border-white/10 shadow-2xl overflow-hidden z-[10000] flex flex-col"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      data-testid="start-menu"
    >
      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-app-search"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3">
          {filteredApps.map((app) => {
            const IconComponent = Icons[app.icon as keyof typeof Icons] as any;
            return (
              <button
                key={app.id}
                onClick={() => handleOpenApp(app)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 transition-transform"
                data-testid={`app-${app.id}`}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                </div>
                <span className="text-xs text-center line-clamp-2">{app.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Power Options */}
      <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => useStore.getState().performSystemAction('lock')}
          data-testid="button-lock"
        >
          <Icons.Lock className="h-4 w-4 mr-2" />
          Lock
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => useStore.getState().performSystemAction('restart')}
          data-testid="button-restart"
        >
          <Icons.RotateCw className="h-4 w-4 mr-2" />
          Restart
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => useStore.getState().performSystemAction('shutdown')}
          data-testid="button-shutdown"
        >
          <Icons.Power className="h-4 w-4 mr-2" />
          Shutdown
        </Button>
      </div>
    </div>
  );
}
