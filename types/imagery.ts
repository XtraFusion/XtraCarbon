export interface Location {
    latitude: number;
    longitude: number;
    name?: string;
    areaUnit?:string
    areaSize?: number; // in hectares
  }
  
  export interface SatelliteImage {
    id: string;
    title: string;
    url: string;
    thumbnailUrl?: string;
    date: string;
    source: 'OpenAerialMap' | 'Sentinel' | 'USGS' | 'Esri World Imagery' | 'NASA MODIS';
    resolution?: string;
    cloudCoverage?: number;
    downloadUrl?: string;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  }
  
  export interface ImagerySearchParams {
    location: Location;
    startDate?: string;
    endDate?: string;
    maxCloudCover?: number;
    limit?: number;
    areaSize?: number; // in hectares
  }