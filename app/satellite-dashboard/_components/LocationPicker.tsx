import React, { useState, useEffect } from 'react';
import { Location } from '@/types/imagery';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Crosshair } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  selectedLocation,
}) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [mapLatitude, setMapLatitude] = useState(selectedLocation?.latitude?.toString() || '37.7749');
  const [mapLongitude, setMapLongitude] = useState(selectedLocation?.longitude?.toString() || '-122.4194');

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: 'Current Location',
          };
          setCurrentLocation(location);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setMapLatitude(selectedLocation.latitude.toString());
      setMapLongitude(selectedLocation.longitude.toString());
    }
  }, [selectedLocation]);

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      onLocationSelect(currentLocation);
    }
  };

  const handleMapLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(mapLatitude);
    const lng = parseFloat(mapLongitude);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onLocationSelect({
        latitude: lat,
        longitude: lng,
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-sky shadow-elevation">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Select Location</h3>
          </div>
          {currentLocation && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUseCurrentLocation}
              className="flex items-center gap-2 border-primary/20 hover:bg-primary/10"
            >
              <Crosshair className="h-4 w-4" />
              Use Current Location
            </Button>
          )}
        </div>
        
        {/* Interactive Map Placeholder - Will be replaced with actual map */}
        <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-primary/20 bg-sky-light flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <p className="text-primary/80 font-medium mb-2">Interactive Map</p>
            <p className="text-sm text-primary/60">
              Use coordinates below to select location
            </p>
            {selectedLocation && (
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-sm font-medium text-primary">Selected Location:</p>
                <p className="text-xs text-primary/80">
                  {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Coordinate Input Form */}
        <form onSubmit={handleMapLocationSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="map-lat" className="text-xs font-medium text-foreground/80">
                Latitude
              </Label>
              <Input
                id="map-lat"
                type="text"
                value={mapLatitude}
                onChange={(e) => setMapLatitude(e.target.value)}
                placeholder="37.7749"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="map-lng" className="text-xs font-medium text-foreground/80">
                Longitude
              </Label>
              <Input
                id="map-lng"
                type="text"
                value={mapLongitude}
                onChange={(e) => setMapLongitude(e.target.value)}
                placeholder="-122.4194"
                className="text-sm"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            size="sm"
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Set Location
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground">
          Enter coordinates to select a location for satellite imagery analysis.
        </p>
      </div>
    </Card>
  );
}