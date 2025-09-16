"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Polygon,
  Circle,
  FeatureGroup,
  
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  center: Coordinates;
  selectedLocation: Coordinates | null;
  radius: number;
  areaSize: number;
  areaUnit: "hectares" | "acres";
  onMapClick: (coords: Coordinates) => void;
  enableDrawing?: boolean; // NEW: allow drawing shapes
}

// Handle map click events
function MapEvents({ onMapClick }: { onMapClick: (coords: Coordinates) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Recenter when center changes
function RecenterMap({ center }: { center: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  return null;
}

export default function MapComponent({
  center,
  selectedLocation,
  radius,
  areaSize,
  areaUnit,
  onMapClick,
  enableDrawing = true,
}: MapComponentProps) {
  const handleShapeCreated = (e: any) => {
    const layer = e.layer;
    const type = e.layerType;

    if (type === "polygon" || type === "rectangle") {
      console.log("Polygon coords:", layer.getLatLngs());
    } else if (type === "circle") {
      console.log("Circle center:", layer.getLatLng(), "Radius:", layer.getRadius());
    }
  };

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <RecenterMap center={center} />
      <MapEvents onMapClick={onMapClick} />

      {/* Show marker on selection */}
      {selectedLocation && (
        <>
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>Selected Location</Popup>
          </Marker>
          {/* Show circle */}
          <Circle center={[selectedLocation.lat, selectedLocation.lng]} radius={radius}>
            <Popup>
              Coverage Area (Circle) <br />
              {areaSize} {areaUnit}
            </Popup>
          </Circle>
        </>
      )}

      {/* Drawing controls */}
      {enableDrawing && (
  <FeatureGroup>
    <EditControl
      position="topright"
      onCreated={handleShapeCreated}
      draw={{
        rectangle: true,
        polygon: true,
        circle: true,
        polyline: true,
        marker: true,
      }}
    />
  </FeatureGroup>
)}

    </MapContainer>
  );
}
