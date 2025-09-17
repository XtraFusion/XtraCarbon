import React from 'react';
import { SatelliteImage, Location } from '@/types/imagery';
import { ImageCard } from './ImageCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Satellite, 
  Globe, 
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { generate3DViewUrl, generateGoogleEarthUrl } from '@/lib/utils/imagery-apis';

interface ImageryGalleryProps {
  images: SatelliteImage[];
  location?: Location;
  isLoading: boolean;
  onRefresh: () => void;
  onView3D: () => void;
}

export const ImageryGallery: React.FC<ImageryGalleryProps> = ({
  images,
  location,
  isLoading,
  onRefresh,
  onView3D,
}) => {
  const { toast } = useToast();

  const handleViewImage = (image: SatelliteImage) => {
    if (image.url) {
      // For tile URLs, create a simple viewer page or show in modal
      const viewerUrl = `data:text/html,<!DOCTYPE html>
      <html>
        <head>
          <title>${image.title}</title>
          <style>
            body { margin: 0; padding: 20px; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; }
            .container { text-align: center; }
            h1 { color: white; font-family: Arial, sans-serif; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${image.title}</h1>
            <img src="${image.url}" alt="${image.title}" onerror="this.style.display='none'; document.querySelector('h1').textContent='Image failed to load. This may be a tile URL that requires specific parameters.'" />
          </div>
        </body>
      </html>`;
      
      window.open(viewerUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Opening Image",
        description: `Opening ${image.title} in new tab`,
      });
    }
  };

  const handleDownload = async (image: SatelliteImage) => {
    if (image.downloadUrl) {
      try {
        toast({
          title: "Starting Download",
          description: `Downloading ${image.title}...`,
        });

        // Create a temporary anchor element to trigger download
        const response = await fetch(image.downloadUrl, { mode: 'cors' });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${image.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast({
            title: "Download Complete",
            description: `${image.title} has been downloaded successfully`,
          });
        } else {
          // Fallback: open in new tab
          window.open(image.downloadUrl, '_blank', 'noopener,noreferrer');
          toast({
            title: "Opening Download Link",
            description: "Image opened in new tab for manual download",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open in new tab
        window.open(image.downloadUrl, '_blank', 'noopener,noreferrer');
        toast({
          title: "Download Method Changed",
          description: "Direct download failed, opened link in new tab",
          variant: "default",
        });
      }
    }
  };

  const handleView3D = () => {
    if (location) {
      // Try F4Map first (works better in blocked environments)
      const f4mapUrl = generate3DViewUrl(location);
      window.open(f4mapUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "3D View Opened",
        description: "Opening interactive 3D map. If blocked, try the fallback options.",
      });
    }
    onView3D();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-earth shadow-elevation">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Satellite className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Satellite Imagery</h2>
              <p className="text-white/80">
                {location 
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}${location.areaSize ? ` • ${location.areaSize} hectares` : ''}`
                  : 'Select a location to view imagery'
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onRefresh}
              variant="secondary"
              size="sm"
              disabled={isLoading || !location}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {location && (
              <Button
                onClick={handleView3D}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Globe className="h-4 w-4 mr-2" />
                View in 3D
              </Button>
            )}
          </div>
        </div>
        
        {images.length > 0 && (
          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              {images.length} images found
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              Latest: {new Date(images[0]?.date).toLocaleDateString()}
            </Badge>
          </div>
        )}
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8">
          <div className="flex items-center justify-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mr-3" />
            <span>Searching for satellite imagery...</span>
          </div>
        </Card>
      )}

      {/* No Location Selected */}
      {!location && !isLoading && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <Satellite className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Select a Location</h3>
            <p>Choose a location on the map or enter coordinates to search for satellite imagery.</p>
          </div>
        </Card>
      )}

      {/* No Images Found */}
      {!isLoading && location && images.length === 0 && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h3 className="text-lg font-semibold mb-2">No Images Found</h3>
            <p className="mb-4">
              No satellite imagery was found for this location. Try selecting a different area or check back later.
            </p>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Image Gallery */}
      {!isLoading && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onViewImage={handleViewImage}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
};