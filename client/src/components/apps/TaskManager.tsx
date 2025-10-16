import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function TaskManager() {
  const { windows, closeWindow } = useStore();
  const [cpuData, setCpuData] = useState<Array<{ time: string; usage: number }>>([]);
  const [memoryData, setMemoryData] = useState<Array<{ time: string; usage: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const cpuUsage = Math.random() * 100;
      const memUsage = Math.random() * 100;

      setCpuData((prev) => [...prev.slice(-19), { time, usage: cpuUsage }]);
      setMemoryData((prev) => [...prev.slice(-19), { time, usage: memUsage }]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentCpu = cpuData[cpuData.length - 1]?.usage || 0;
  const currentMem = memoryData[memoryData.length - 1]?.usage || 0;

  return (
    <div className="flex flex-col h-full">
      {/* Performance Graphs */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-border/50">
        <div>
          <h3 className="text-sm font-medium mb-2">CPU Usage</h3>
          <div className="text-3xl font-bold mb-2" data-testid="cpu-usage">
            {currentCpu.toFixed(1)}%
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" fill="url(#cpuGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Memory Usage</h3>
          <div className="text-3xl font-bold mb-2" data-testid="memory-usage">
            {currentMem.toFixed(1)}%
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryData}>
                <defs>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="usage" stroke="hsl(var(--chart-2))" fill="url(#memGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Running Processes */}
      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-sm font-medium mb-3">Running Applications</h3>
        <div className="space-y-2">
          {windows.map((window) => {
            const IconComponent = Icons[window.icon as keyof typeof Icons] as any;
            return (
              <div
                key={window.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-card-border"
                data-testid={`process-${window.appId}`}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                  <div>
                    <div className="font-medium">{window.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Status: {window.isMinimized ? 'Minimized' : 'Running'}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => closeWindow(window.id)}
                  data-testid={`button-end-${window.appId}`}
                >
                  <Icons.X className="h-4 w-4 mr-2" />
                  End Task
                </Button>
              </div>
            );
          })}
          {windows.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Icons.Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No applications running</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
