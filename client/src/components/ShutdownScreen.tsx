
import { Button } from './ui/button';
import * as Icons from 'lucide-react';

interface ShutdownScreenProps {
  onPowerOn: () => void;
}

export function ShutdownScreen({ onPowerOn }: ShutdownScreenProps) {
  return (
    <div 
      className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center"
      data-testid="shutdown-screen"
    >
      <div className="text-white text-center space-y-8">
        <Button
          size="icon"
          className="h-20 w-20 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/30"
          onClick={onPowerOn}
          data-testid="button-power-on"
        >
          <Icons.Power className="h-10 w-10" />
        </Button>
        <p className="text-sm text-white/60">Click to power on</p>
      </div>
    </div>
  );
}
