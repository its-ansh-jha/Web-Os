import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

export function Maps() {
  const [search, setSearch] = useState('');
  const [zoom, setZoom] = useState(13);

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="flex items-center gap-2 p-3 border-b border-border/50">
        <Input
          placeholder="Search for a place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-location"
        />
        <Button data-testid="button-search">
          <Icons.Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-muted/20">
        {/* Placeholder Map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Icons.MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Interactive Map</p>
            <p className="text-sm text-muted-foreground">Search for a location to see the map</p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setZoom((z) => Math.min(20, z + 1))}
            data-testid="button-zoom-in"
          >
            <Icons.Plus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setZoom((z) => Math.max(1, z - 1))}
            data-testid="button-zoom-out"
          >
            <Icons.Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Location Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-xl border border-card-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icons.MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold">Current Location</h3>
              <p className="text-sm text-muted-foreground">Zoom level: {zoom}</p>
            </div>
            <Button size="sm" variant="outline" data-testid="button-get-directions">
              <Icons.Navigation className="h-4 w-4 mr-2" />
              Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
