import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const mockWeatherData = {
  location: 'San Francisco',
  temperature: 18,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: 'Mon', temp: 19, condition: 'Sunny', icon: 'Sun' },
    { day: 'Tue', temp: 17, condition: 'Cloudy', icon: 'Cloud' },
    { day: 'Wed', temp: 16, condition: 'Rainy', icon: 'CloudRain' },
    { day: 'Thu', temp: 18, condition: 'Partly Cloudy', icon: 'CloudSun' },
    { day: 'Fri', temp: 20, condition: 'Sunny', icon: 'Sun' },
  ],
};

export function Weather() {
  const [location, setLocation] = useState('San Francisco');
  const [weather] = useState(mockWeatherData);

  return (
    <div className="flex flex-col h-full p-6">
      {/* Search */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          data-testid="input-location"
        />
        <Button data-testid="button-search">
          <Icons.Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Weather */}
      <div className="flex-1 flex flex-col items-center justify-center mb-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2" data-testid="weather-location">{weather.location}</h2>
          <Icons.CloudSun className="w-24 h-24 mx-auto mb-4 text-primary" />
          <div className="text-6xl font-bold mb-2" data-testid="weather-temp">{weather.temperature}°C</div>
          <div className="text-xl text-muted-foreground mb-6">{weather.condition}</div>
          
          <div className="flex gap-8 justify-center">
            <div className="text-center">
              <Icons.Droplets className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">{weather.humidity}%</div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </div>
            <div className="text-center">
              <Icons.Wind className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">{weather.windSpeed} km/h</div>
              <div className="text-xs text-muted-foreground">Wind Speed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="border-t border-border/50 pt-4">
        <h3 className="text-sm font-medium mb-3">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-2">
          {weather.forecast.map((day, i) => {
            const IconComponent = Icons[day.icon as keyof typeof Icons] as any;
            return (
              <div
                key={i}
                className="text-center p-3 rounded-lg bg-card border border-card-border"
                data-testid={`forecast-${day.day}`}
              >
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <IconComponent className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-lg font-semibold">{day.temp}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
