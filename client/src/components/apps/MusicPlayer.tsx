import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import * as Icons from 'lucide-react';

const sampleSongs = [
  { id: 1, title: 'Summer Vibes', artist: 'DJ Sunshine', duration: '3:45' },
  { id: 2, title: 'Midnight Jazz', artist: 'The Night Owls', duration: '4:12' },
  { id: 3, title: 'Digital Dreams', artist: 'Synthwave', duration: '3:30' },
  { id: 4, title: 'Ocean Waves', artist: 'Nature Sounds', duration: '5:00' },
];

export function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(sampleSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState([0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const currentIndex = sampleSongs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % sampleSongs.length;
    setCurrentSong(sampleSongs[nextIndex]);
  };

  const playPrevious = () => {
    const currentIndex = sampleSongs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + sampleSongs.length) % sampleSongs.length;
    setCurrentSong(sampleSongs[prevIndex]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-64 h-64 bg-gradient-to-br from-primary/40 to-purple-500/40 rounded-xl shadow-2xl flex items-center justify-center">
          <Icons.Music className="w-24 h-24 text-white/80" />
        </div>
      </div>

      {/* Song Info */}
      <div className="text-center px-8 pb-4">
        <h3 className="text-xl font-semibold" data-testid="song-title">{currentSong.title}</h3>
        <p className="text-sm text-muted-foreground" data-testid="song-artist">{currentSong.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-8 pb-4">
        <Slider
          value={progress}
          onValueChange={setProgress}
          max={100}
          step={1}
          className="cursor-pointer"
          data-testid="progress-slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0:00</span>
          <span>{currentSong.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-8 pb-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={playPrevious}
          data-testid="button-previous"
        >
          <Icons.SkipBack className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-12 w-12"
          onClick={togglePlay}
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <Icons.Pause className="h-6 w-6" />
          ) : (
            <Icons.Play className="h-6 w-6" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={playNext}
          data-testid="button-next"
        >
          <Icons.SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-8 pb-4">
        <Icons.Volume2 className="h-4 w-4" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
          data-testid="volume-slider"
        />
      </div>

      {/* Playlist */}
      <div className="border-t border-border/50 p-4">
        <h4 className="text-sm font-medium mb-2">Playlist</h4>
        <div className="space-y-1 max-h-32 overflow-auto">
          {sampleSongs.map((song) => (
            <button
              key={song.id}
              onClick={() => setCurrentSong(song)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md text-sm hover-elevate active-elevate-2 transition-colors",
                currentSong.id === song.id && "bg-primary/20"
              )}
              data-testid={`song-${song.id}`}
            >
              <div className="flex items-center gap-2">
                <Icons.Music className="h-3 w-3" />
                <span>{song.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{song.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
