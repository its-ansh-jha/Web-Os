import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState([0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mockVideo = {
    title: 'Sample Video',
    duration: '5:32',
    thumbnail: 'https://via.placeholder.com/800x450/667eea/ffffff?text=Video+Player',
  };

  return (
    <div className="flex flex-col h-full bg-black/90">
      {/* Video Display */}
      <div className="flex-1 relative flex items-center justify-center">
        <img
          src={mockVideo.thumbnail}
          alt="Video"
          className="max-w-full max-h-full object-contain"
        />
        <button
          className="absolute inset-0 flex items-center justify-center hover-elevate active-elevate-2"
          onClick={() => setIsPlaying(!isPlaying)}
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <Icons.Pause className="h-16 w-16 text-white/80" />
          ) : (
            <Icons.Play className="h-16 w-16 text-white/80" />
          )}
        </button>
      </div>

      {/* Video Info */}
      <div className="p-4 bg-card/40 backdrop-blur-sm border-t border-white/10">
        <h3 className="font-semibold mb-2">{mockVideo.title}</h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="mb-2"
            data-testid="slider-progress"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{mockVideo.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              data-testid="button-play"
            >
              {isPlaying ? (
                <Icons.Pause className="h-5 w-5" />
              ) : (
                <Icons.Play className="h-5 w-5" />
              )}
            </Button>
            <Button size="icon" variant="ghost" data-testid="button-skip-back">
              <Icons.SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" data-testid="button-skip-forward">
              <Icons.SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              data-testid="button-mute"
            >
              {isMuted ? (
                <Icons.VolumeX className="h-5 w-5" />
              ) : (
                <Icons.Volume2 className="h-5 w-5" />
              )}
            </Button>
            <div className="w-24">
              <Slider
                value={isMuted ? [0] : volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                data-testid="slider-volume"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsFullscreen(!isFullscreen)}
              data-testid="button-fullscreen"
            >
              {isFullscreen ? (
                <Icons.Minimize className="h-5 w-5" />
              ) : (
                <Icons.Maximize className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
