import { Location, SatelliteImage, ImagerySearchParams } from '@/types/imagery';

// Calculate appropriate zoom level based on area size
const calculateZoomLevel = (areaSize: number): number => {
  // Convert hectares to appropriate zoom level
  // Smaller area = higher zoom (more detailed)
  if (areaSize <= 10) return 18;      // Very detailed for small areas
  if (areaSize <= 50) return 16;      // High detail
  if (areaSize <= 200) return 14;     // Medium detail
  if (areaSize <= 500) return 12;     // Lower detail
  if (areaSize <= 1000) return 10;    // Wide area view
  return 8;                           // Very wide area view
};

// Esri World Imagery - Free satellite imagery service with current data
export const fetchEsriSatelliteImages = async (params: ImagerySearchParams): Promise<SatelliteImage[]> => {
  try {
    const { location, areaSize = 100 } = params;
    const zoom = calculateZoomLevel(areaSize);
    
    // Generate tile coordinates for the location
    const lat = location.latitude;
    const lon = location.longitude;
    
    // Calculate tile coordinates
    const n = Math.pow(2, zoom);
    const x = Math.floor(n * ((lon + 180) / 360));
    const y = Math.floor(n * (1 - (Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI)) / 2);
    
    // Create multiple images with different zoom levels
    const images: SatelliteImage[] = [
      {
        id: `esri-world-imagery-${Date.now()}-1`,
        title: `Esri World Imagery (Current) - ${lat.toFixed(4)}, ${lon.toFixed(4)} - ${areaSize}ha`,
        url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`,
        thumbnailUrl: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom-2}/${Math.floor(y/4)}/${Math.floor(x/4)}`,
        date: new Date().toISOString(),
        source: 'Esri World Imagery',
        resolution: areaSize <= 10 ? '0.3m' : areaSize <= 100 ? '0.6m' : '1.2m',
        downloadUrl: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`,
        bounds: {
          west: (x / n) * 360 - 180,
          south: Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * 180 / Math.PI,
          east: ((x + 1) / n) * 360 - 180,
          north: Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI,
        },
      },
      {
        id: `esri-world-imagery-${Date.now()}-2`,
        title: `Esri World Imagery (Wide View) - ${lat.toFixed(4)}, ${lon.toFixed(4)} - ${areaSize}ha`,
        url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom-1}/${Math.floor(y/2)}/${Math.floor(x/2)}`,
        thumbnailUrl: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom-3}/${Math.floor(y/8)}/${Math.floor(x/8)}`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Esri World Imagery',
        resolution: '1.2m',
        downloadUrl: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom-1}/${Math.floor(y/2)}/${Math.floor(x/2)}`,
      }
    ];

    return images;
  } catch (error) {
    console.error('Error fetching Esri satellite images:', error);
    return [];
  }
};

// NASA GIBS - Free NASA satellite imagery with recent data
export const fetchNASAGIBSImages = async (params: ImagerySearchParams): Promise<SatelliteImage[]> => {
  try {
    const { location, areaSize = 100 } = params;
    const zoom = Math.max(6, calculateZoomLevel(areaSize) - 2); // NASA GIBS works better with lower zoom
    
    // Calculate tile coordinates for NASA GIBS
    const lat = location.latitude;
    const lon = location.longitude;
    const n = Math.pow(2, zoom);
    const x = Math.floor(n * ((lon + 180) / 360));
    const y = Math.floor(n * (1 - (Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI)) / 2);
    
    // Get recent dates for imagery (NASA GIBS has daily updates)
    const today = new Date();
    const yesterday = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    const images: SatelliteImage[] = [
      {
        id: `nasa-modis-terra-${Date.now()}`,
        title: `NASA MODIS Terra (Latest) - ${lat.toFixed(4)}, ${lon.toFixed(4)} - ${areaSize}ha`,
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${formatDate(yesterday)}/GoogleMapsCompatible_Level9/${zoom}/${y}/${x}.jpg`,
        thumbnailUrl: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${formatDate(yesterday)}/GoogleMapsCompatible_Level6/6/${Math.floor(y/8)}/${Math.floor(x/8)}.jpg`,
        date: yesterday.toISOString(),
        source: 'NASA MODIS',
        resolution: areaSize <= 100 ? '250m' : '500m',
        downloadUrl: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${formatDate(yesterday)}/GoogleMapsCompatible_Level9/${zoom}/${y}/${x}.jpg`,
      },
      {
        id: `nasa-viirs-${Date.now()}`,
        title: `NASA VIIRS (High-Res) - ${lat.toFixed(4)}, ${lon.toFixed(4)} - ${areaSize}ha`,
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${formatDate(threeDaysAgo)}/GoogleMapsCompatible_Level9/${zoom}/${y}/${x}.jpg`,
        thumbnailUrl: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${formatDate(threeDaysAgo)}/GoogleMapsCompatible_Level6/6/${Math.floor(y/8)}/${Math.floor(x/8)}.jpg`,
        date: threeDaysAgo.toISOString(),
        source: 'NASA MODIS',
        resolution: areaSize <= 50 ? '375m' : '750m',
        downloadUrl: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${formatDate(threeDaysAgo)}/GoogleMapsCompatible_Level9/${zoom}/${y}/${x}.jpg`,
      }
    ];

    return images;
  } catch (error) {
    console.error('Error fetching NASA GIBS images:', error);
    return [];
  }
};

// Sentinel Hub - using their free/demo endpoints
export const fetchSentinelImages = async (params: ImagerySearchParams): Promise<SatelliteImage[]> => {
  try {
    // Note: This is a simplified implementation. In production, you'd need proper Sentinel Hub API setup
    // For now, we'll return mock data that represents what Sentinel would provide
    const mockSentinelData: SatelliteImage[] = [
      {
        id: 'sentinel-1',
        title: 'Sentinel-2 L2A',
        url: `https://apps.sentinel-hub.com/sentinel-playground/?source=S2L2A&lat=${params.location.latitude}&lng=${params.location.longitude}&zoom=12`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Sentinel',
        resolution: '10m',
        cloudCoverage: 15,
      },
      {
        id: 'sentinel-2',
        title: 'Sentinel-2 L1C',
        url: `https://apps.sentinel-hub.com/sentinel-playground/?source=S2L1C&lat=${params.location.latitude}&lng=${params.location.longitude}&zoom=12`,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Sentinel',
        resolution: '10m',
        cloudCoverage: 8,
      },
    ];

    return mockSentinelData;
  } catch (error) {
    console.error('Error fetching Sentinel images:', error);
    return [];
  }
};

// Combined imagery search
export const searchImagery = async (params: ImagerySearchParams): Promise<SatelliteImage[]> => {
  const [esriImages, nasaImages, sentinelImages] = await Promise.all([
    fetchEsriSatelliteImages(params),
    fetchNASAGIBSImages(params),
    fetchSentinelImages(params),
  ]);

  const allImages = [...esriImages, ...nasaImages, ...sentinelImages];
  
  // Sort by date (newest first) and limit results
  return allImages
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, params.limit || 5);
};

// Generate alternative 3D viewing options (since Google Earth may be blocked)
export const generate3DViewUrl = (location: Location): string => {
  // Use F4map as free alternative to Google Earth - works better in blocked environments
  return `https://demo.f4map.com/#lat=${location.latitude}&lon=${location.longitude}&zoom=16&camera.theta=60`;
};

// Generate Google Earth URL as fallback
export const generateGoogleEarthUrl = (location: Location): string => {
  return `https://earth.google.com/web/@${location.latitude},${location.longitude},1000a,1000d,35y,0h,0t,0r`;
};