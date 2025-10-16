
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import * as Icons from 'lucide-react';
import { useStore } from '@/store/useStore';

export function VolumeDialog() {
  const { volumeDialogOpen, setVolumeDialogOpen, volume, setVolume, isMuted, toggleMute } = useStore();

  return (
    <Dialog open={volumeDialogOpen} onOpenChange={setVolumeDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.Volume2 className="h-5 w-5" />
            Volume Control
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={toggleMute}
              data-testid="button-toggle-mute"
            >
              {isMuted || volume === 0 ? (
                <Icons.VolumeX className="h-5 w-5" />
              ) : volume < 50 ? (
                <Icons.Volume1 className="h-5 w-5" />
              ) : (
                <Icons.Volume2 className="h-5 w-5" />
              )}
            </Button>
            <div className="flex-1">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={([val]) => setVolume(val)}
                max={100}
                step={1}
                className="w-full"
                data-testid="volume-slider"
              />
            </div>
            <span className="text-sm font-medium w-12 text-right">
              {isMuted ? 0 : volume}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVolume(0)}
            >
              Mute
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVolume(50)}
            >
              50%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVolume(100)}
            >
              100%
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
