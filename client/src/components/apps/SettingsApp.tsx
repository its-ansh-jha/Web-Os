import { useStore } from '@/store/useStore';
import { useSettings, useUpdateSettings } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const wallpapers = [
  { id: 'gradient-1', name: 'Purple Dream', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient-2', name: 'Pink Sunset', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient-3', name: 'Ocean Blue', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'gradient-4', name: 'Green Mint', preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 'gradient-5', name: 'Warm Sunrise', preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
];

export function SettingsApp() {
  const { theme, setTheme, wallpaper, setWallpaper } = useStore();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme);
      setWallpaper(settings.wallpaper);
    }
  }, [settings, setTheme, setWallpaper]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    updateSettings.mutate({ theme: newTheme });
  };

  const handleWallpaperChange = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    updateSettings.mutate({ wallpaper: newWallpaper });
  };

  return (
    <div className="flex flex-col h-full overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Appearance */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icons.Palette className="h-5 w-5" />
            Appearance
          </h3>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Theme</Label>
              <RadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as 'light' | 'dark')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" data-testid="theme-light" />
                  <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                    <Icons.Sun className="h-4 w-4" />
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" data-testid="theme-dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                    <Icons.Moon className="h-4 w-4" />
                    Dark
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Wallpaper</Label>
              <div className="grid grid-cols-2 gap-3">
                {wallpapers.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleWallpaperChange(w.id)}
                    className={cn(
                      "relative h-24 rounded-lg overflow-hidden border-2 transition-all hover-elevate",
                      wallpaper === w.id ? "border-primary ring-2 ring-primary/50" : "border-transparent"
                    )}
                    style={{ background: w.preview }}
                    data-testid={`wallpaper-${w.id}`}
                  >
                    {wallpaper === w.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Icons.Check className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-sm py-1 px-2">
                      {w.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icons.Info className="h-5 w-5" />
            System Information
          </h3>
          <div className="space-y-2 bg-card border border-card-border rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">OS Version</span>
              <span className="font-medium">WebOS 1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Browser</span>
              <span className="font-medium">{navigator.userAgent.split(' ').pop()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Screen Resolution</span>
              <span className="font-medium">{window.screen.width} × {window.screen.height}</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icons.HelpCircle className="h-5 w-5" />
            About
          </h3>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Icons.Laptop className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">WebOS</div>
                <div className="text-sm text-muted-foreground">A fully functional web operating system</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, and modern web technologies.
              Featuring 20+ applications with beautiful glassmorphism UI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
