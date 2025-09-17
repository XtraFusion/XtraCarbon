import React from 'react';
import { SatelliteImage } from '@/types/imagery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Layers,
  Cloud
} from 'lucide-react';
import { format } from 'date-fns';

interface ImageCardProps {
  image: SatelliteImage;
  onViewImage: (image: SatelliteImage) => void;
  onDownload?: (image: SatelliteImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onViewImage,
  onDownload,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case 'OpenAerialMap':
        return 'default';
      case 'Sentinel':
        return 'secondary';
      case 'USGS':
        return 'outline';
      case 'Esri World Imagery':
        return 'default';
      case 'NASA MODIS':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="group hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold text-card-foreground line-clamp-2">
            {image.title}
          </CardTitle>
          <Badge variant={getSourceBadgeVariant(image.source)} className="ml-2 shrink-0">
            {image.source}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Thumbnail */}
        {image.thumbnailUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
            <img
              src={image.thumbnailUrl}
              alt={image.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(image.date)}</span>
          </div>
          
          {image.resolution && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>{image.resolution}</span>
            </div>
          )}
          
          {image.cloudCoverage !== undefined && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cloud className="h-4 w-4" />
              <span>{image.cloudCoverage}% clouds</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewImage(image)}
            className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground transition-smooth"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Button>
          
          {(image.downloadUrl || onDownload) && (
            <Button
              onClick={() => onDownload?.(image)}
              variant="outline"
              size="sm"
              className="border-primary/20 hover:bg-primary/10 transition-smooth"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

}