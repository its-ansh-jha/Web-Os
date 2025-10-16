import { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

const samplePhotos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', title: 'Mountain Landscape' },
  { id: 2, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', title: 'Forest Path' },
  { id: 3, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', title: 'Sunset Beach' },
  { id: 4, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', title: 'Lake View' },
  { id: 5, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', title: 'Ocean Waves' },
  { id: 6, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', title: 'Northern Lights' },
];

export function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(samplePhotos[0]);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);

  const handleNext = () => {
    const currentIndex = samplePhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % samplePhotos.length;
    setSelectedPhoto(samplePhotos[nextIndex]);
    setRotation(0);
    setZoom(100);
  };

  const handlePrevious = () => {
    const currentIndex = samplePhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + samplePhotos.length) % samplePhotos.length;
    setSelectedPhoto(samplePhotos[prevIndex]);
    setRotation(0);
    setZoom(100);
  };

  return (
    <div className="flex h-full">
      {/* Thumbnail Sidebar */}
      <div className="w-48 border-r border-border/50 p-3 overflow-auto">
        <h3 className="text-sm font-medium mb-3">Photos</h3>
        <div className="space-y-2">
          {samplePhotos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => {
                setSelectedPhoto(photo);
                setRotation(0);
                setZoom(100);
              }}
              className={cn(
                "w-full aspect-video rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all",
                selectedPhoto.id === photo.id && "ring-2 ring-primary"
              )}
              data-testid={`photo-thumb-${photo.id}`}
            >
              <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              data-testid="button-previous"
            >
              <Icons.ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              data-testid="button-next"
            >
              <Icons.ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <span className="text-sm font-medium">{selectedPhoto.title}</span>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRotation((r) => r - 90)}
              data-testid="button-rotate-left"
            >
              <Icons.RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRotation((r) => r + 90)}
              data-testid="button-rotate-right"
            >
              <Icons.RotateCw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom((z) => Math.max(50, z - 25))}
              data-testid="button-zoom-out"
            >
              <Icons.ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              data-testid="button-zoom-in"
            >
              <Icons.ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-muted/20 p-8 overflow-hidden">
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.title}
            className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300"
            style={{
              transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
            }}
            data-testid="photo-viewer"
          />
        </div>

        <div className="flex items-center justify-center gap-4 p-3 border-t border-border/50 text-sm text-muted-foreground">
          <span>Zoom: {zoom}%</span>
          <span>Rotation: {rotation}°</span>
        </div>
      </div>
    </div>
  );
}
