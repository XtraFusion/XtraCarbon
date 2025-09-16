// polygonGenerator.ts
export function generatePolygon(
    center: { lat: number; lng: number },
    radius: number,
    sides: number = 6 // default hexagon
  ) {
    const points: [number, number][] = [];
    const angleStep = (2 * Math.PI) / sides;
  
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep;
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);
  
      // Convert meters to lat/lng offsets
      const newLat = center.lat + (dy / 111320); // meters per degree latitude
      const newLng = center.lng + (dx / (111320 * Math.cos((center.lat * Math.PI) / 180)));
  
      points.push([newLat, newLng]);
    }
  
    return points;
  }
  