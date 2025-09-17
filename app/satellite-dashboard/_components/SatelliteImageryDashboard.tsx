import React, { useState } from 'react';
import { Location, SatelliteImage, ImagerySearchParams } from '@/types/imagery';
import { LocationPicker } from './LocationPicker';
import { CoordinateInput } from './CoordinateInput';
import { ImageryGallery } from './ImageryGallery';
import { searchImagery } from '@/lib/utils/imagery-apis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Satellite, 
  Search, 
  TreePine,
  Target,
  Activity
} from 'lucide-react';

export const SatelliteImageryDashboard: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    toast({
      title: "Location Selected",
      description: `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`,
    });
  };

  const handleSearchImagery = async () => {
    if (!selectedLocation) {
      toast({
        title: "No Location Selected", 
        description: "Please select a location first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setImages([]);

    try {
      const searchParams: ImagerySearchParams = {
        location: selectedLocation,
        limit: 5,
        maxCloudCover: 30,
        areaSize: selectedLocation.areaSize || 100,
      };

      const results = await searchImagery(searchParams);
      setImages(results);

      if (results.length === 0) {
        toast({
          title: "No Images Found",
          description: "No satellite imagery available for this location. Try a different area.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Imagery Found",
          description: `Found ${results.length} satellite images for analysis.`,
        });
      }
    } catch (error) {
      console.error('Error searching imagery:', error);
      toast({
        title: "Search Failed",
        description: "Failed to fetch satellite imagery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView3D = () => {
    toast({
      title: "Opening 3D View",
      description: "Opening Google Earth for terrain analysis...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-earth shadow-elevation">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Satellite className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Satellite Imagery Dashboard</h1>
              <p className="text-white/80 mt-1">
                Carbon Project Verification & MRV Analysis
              </p>
            </div>
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 text-white/90">
              <Target className="h-5 w-5" />
              <span className="text-sm">Multi-source imagery fetching</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <TreePine className="h-5 w-5" />
              <span className="text-sm">Tree counting & forest analysis</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Activity className="h-5 w-5" />
              <span className="text-sm">Temporal change detection</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Location Selection */}
          <div className="lg:col-span-1 space-y-6">
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
            
            <Separator />
            
            <CoordinateInput
              onLocationSubmit={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
            
            {/* Search Button */}
            <Card className="p-4">
              <Button
                onClick={handleSearchImagery}
                disabled={!selectedLocation || isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground transition-smooth"
                size="lg"
              >
                <Search className="h-5 w-5 mr-2" />
                {isLoading ? 'Searching...' : 'Search Satellite Imagery'}
              </Button>
              
              {selectedLocation && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Searching OpenAerialMap, Sentinel, and other free sources
                </p>
              )}
            </Card>
          </div>

          {/* Right Panel - Imagery Gallery */}
          <div className="lg:col-span-2">
            <ImageryGallery
              images={images}
              location={selectedLocation}
              isLoading={isLoading}
              onRefresh={handleSearchImagery}
              onView3D={handleView3D}
            />
          </div>
        </div>
      </main>
    </div>
  );
};