import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

export function ClockApp() {
  const [time, setTime] = useState(new Date());
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!stopwatchRunning) return;
    const interval = setInterval(() => {
      setStopwatchTime((t) => t + 10);
    }, 10);
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  useEffect(() => {
    if (!timerRunning || (timerMinutes === 0 && timerSeconds === 0)) {
      if (timerMinutes === 0 && timerSeconds === 0 && timerRunning) {
        setTimerRunning(false);
      }
      return;
    }
    const interval = setInterval(() => {
      if (timerSeconds === 0) {
        setTimerMinutes((m) => m - 1);
        setTimerSeconds(59);
      } else {
        setTimerSeconds((s) => s - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerMinutes, timerSeconds]);

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full p-4">
      <Tabs defaultValue="clock" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clock" data-testid="tab-clock">Clock</TabsTrigger>
          <TabsTrigger value="world" data-testid="tab-world">World</TabsTrigger>
          <TabsTrigger value="stopwatch" data-testid="tab-stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="timer" data-testid="tab-timer">Timer</TabsTrigger>
        </TabsList>

        <TabsContent value="clock" className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-7xl font-bold mb-2" data-testid="current-time">
              {format(time, 'HH:mm:ss')}
            </div>
            <div className="text-2xl text-muted-foreground">
              {format(time, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="world" className="flex-1 overflow-auto">
          <div className="space-y-4 p-4">
            {[
              { city: 'New York', timezone: 'America/New_York', offset: -5 },
              { city: 'London', timezone: 'Europe/London', offset: 0 },
              { city: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9 },
              { city: 'Sydney', timezone: 'Australia/Sydney', offset: 11 },
            ].map((location) => (
              <div
                key={location.city}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-card-border"
                data-testid={`world-clock-${location.city}`}
              >
                <div>
                  <div className="font-medium">{location.city}</div>
                  <div className="text-sm text-muted-foreground">
                    GMT{location.offset >= 0 ? '+' : ''}{location.offset}
                  </div>
                </div>
                <div className="text-2xl font-semibold">
                  {format(new Date(time.getTime() + location.offset * 3600000), 'HH:mm')}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stopwatch" className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-6xl font-bold font-mono" data-testid="stopwatch-display">
            {formatStopwatch(stopwatchTime)}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setStopwatchRunning(!stopwatchRunning)}
              data-testid="button-stopwatch-toggle"
            >
              {stopwatchRunning ? <Icons.Pause className="h-4 w-4 mr-2" /> : <Icons.Play className="h-4 w-4 mr-2" />}
              {stopwatchRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStopwatchTime(0);
                setStopwatchRunning(false);
              }}
              data-testid="button-stopwatch-reset"
            >
              <Icons.RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="timer" className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-6xl font-bold font-mono" data-testid="timer-display">
            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
          </div>
          {!timerRunning && (
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                max="59"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-center"
                placeholder="Min"
                data-testid="input-timer-minutes"
              />
              <Input
                type="number"
                min="0"
                max="59"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-20 text-center"
                placeholder="Sec"
                data-testid="input-timer-seconds"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={() => setTimerRunning(!timerRunning)}
              disabled={!timerRunning && timerMinutes === 0 && timerSeconds === 0}
              data-testid="button-timer-toggle"
            >
              {timerRunning ? <Icons.Pause className="h-4 w-4 mr-2" /> : <Icons.Play className="h-4 w-4 mr-2" />}
              {timerRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTimerRunning(false);
                setTimerMinutes(5);
                setTimerSeconds(0);
              }}
              data-testid="button-timer-reset"
            >
              <Icons.RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
