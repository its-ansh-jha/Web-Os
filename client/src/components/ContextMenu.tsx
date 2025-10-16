import { useStore } from '@/store/useStore';
import * as Icons from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ContextMenu() {
  const { contextMenu, setContextMenu } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setContextMenu]);

  if (!contextMenu) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[10001] w-56 backdrop-blur-xl bg-popover/95 rounded-lg border border-popover-border shadow-lg overflow-hidden"
      style={{
        left: contextMenu.x,
        top: contextMenu.y,
      }}
      data-testid="context-menu"
    >
      {contextMenu.items.map((item, index) => {
        const IconComponent = item.icon ? Icons[item.icon as keyof typeof Icons] as any : null;
        return (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover-elevate active-elevate-2 transition-colors"
            data-testid={`context-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
