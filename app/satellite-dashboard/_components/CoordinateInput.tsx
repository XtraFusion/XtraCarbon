import React, { useState } from 'react';
import { Location } from '@/types/imagery';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Navigation, Search } from 'lucide-react';

interface CoordinateInputProps {
  onLocationSubmit: (location: Location) => void;
  selectedLocation?: Location;
}

export const CoordinateInput: React.FC<CoordinateInputProps> = ({
  onLocationSubmit,
  selectedLocation,
}) => {
  const [latitude, setLatitude] = useState(selectedLocation?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(selectedLocation?.longitude?.toString() || '');
  const [areaSize, setAreaSize] = useState(selectedLocation?.areaSize?.toString() || '100');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (selectedLocation) {
      setLatitude(selectedLocation.latitude.toString());
      setLongitude(selectedLocation.longitude.toString());
      setAreaSize(selectedLocation.areaSize?.toString() || '100');
    }
  }, [selectedLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const area = parseFloat(areaSize);

    // Validation
    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid numeric coordinates');
      return;
    }

    if (isNaN(area) || area <= 0) {
      setError('Please enter a valid area size (greater than 0)');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    onLocationSubmit({
      latitude: lat,
      longitude: lng,
      areaSize: area,
    });
  };

  return (
    <Card className="p-6 shadow-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Coordinate Input</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude" className="text-sm font-medium">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="text"
              placeholder="e.g., 37.7749"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="transition-smooth focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="longitude" className="text-sm font-medium">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="text"
              placeholder="e.g., -122.4194"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="transition-smooth focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaSize" className="text-sm font-medium">
            Area Size (hectares)
          </Label>
          <Input
            id="areaSize"
            type="number"
            placeholder="e.g., 100"
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
            className="transition-smooth focus:ring-primary/20"
            min="1"
            max="10000"
          />
          <p className="text-xs text-muted-foreground">
            Area size determines image zoom level for optimal clarity (1-10,000 hectares)
          </p>
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground transition-smooth"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Location
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Enter coordinates in decimal degrees format (e.g., 37.7749, -122.4194 for San Francisco)
        </p>
      </form>
    </Card>
  );
};