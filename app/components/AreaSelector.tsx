"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";

// Fix Leaflet default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
});

interface Coordinates {
  lat: number;
  lng: number;
}

export default function AreaSelector({
  locationError,
  isLocating,
  setOpenMap,
  setIsLocating,
  setMapCenter,
  setAreaUnit,
  setAreaSize,
  setSelectedLocation,
  mapCenter,
  areaUnit,
  areaSize,
  selectedLocation,
  setLocationError,
}: {
  locationError: string;
  isLocating: boolean;
  setOpenMap: (open: boolean) => void;
  setIsLocating: (locating: boolean) => void;
  setMapCenter: any;
  setAreaUnit: any;
  setAreaSize: any;
  setSelectedLocation: any;
  mapCenter: any;
  areaUnit: any;
  areaSize: any;
  selectedLocation: any;
  setLocationError: any;
}) {

    const getStaticMapUrl = (lat: number, lng: number, zoom = 15) => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // secure in env
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x400&markers=color:red|${lat},${lng}&key=${apiKey}`;
      };
      
  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelectedLocation(coords);
        setMapCenter(coords);
        setIsLocating(false);
      },
      (error) => {
        setLocationError(error.message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Convert area to square meters for calculations
  const getAreaInSquareMeters = useCallback(() => {
    const baseArea =
      areaUnit === "hectares" ? areaSize * 10000 : areaSize * 4046.86;
    return baseArea;
  }, [areaSize, areaUnit]);

  // Calculate radius from area (for circle)
  const calculateRadius = useCallback(() => {
    const areaInSqMeters = getAreaInSquareMeters();
    // Area = πr², so r = √(Area/π)
    return Math.sqrt(areaInSqMeters / Math.PI);
  }, [getAreaInSquareMeters]);

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAreaSize(value);
    }
  };

  const handleMapClick = (coords: Coordinates) => {
    setSelectedLocation(coords);
  };
  function generateGeoJSON(
    location: { lat: number; lng: number },
    radius: number
  ) {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [location.lng, location.lat], // GeoJSON uses [lng, lat]
          },
          properties: {
            name: "Selected Location",
            radius: radius,
          },
        },
      ],
    };
  }

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Interactive Area Visualizer
        </h1>

        {/* Controls Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Controls */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Location Selection
              </label>
              <button
                onClick={getCurrentLocation}
                disabled={isLocating}
                className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors
                  ${
                    isLocating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  }`}
              >
                {isLocating ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Locating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Use Current Location
                  </span>
                )}
              </button>
              {locationError && (
                <p className="text-sm text-red-600 mt-1">{locationError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Or click anywhere on the map to select a location
              </p>
            </div>

            {/* Area Input */}
            <div className="space-y-2">
              <label
                htmlFor="area-input"
                className="block text-sm font-medium text-gray-700"
              >
                Area Size
              </label>
              <div className="flex space-x-2">
                <input
                  id="area-input"
                  type="number"
                  value={areaSize}
                  onChange={handleAreaChange}
                  min="0.1"
                  step="0.1"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter area"
                />
                <select
                  value={areaUnit}
                  onChange={(e) =>
                    setAreaUnit(e.target.value as "hectares" | "acres")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hectares">Hectares</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
            </div>

            {/* Area Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Area Information
              </label>
              <div className="bg-gray-50 rounded-md p-3 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Selected:</span> {areaSize}{" "}
                  {areaUnit}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Equivalent:</span>{" "}
                  {areaUnit === "hectares"
                    ? `${(areaSize * 2.47105).toFixed(2)} acres`
                    : `${(areaSize / 2.47105).toFixed(2)} hectares`}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Circle Radius:</span>{" "}
                  {calculateRadius().toFixed(1)} meters
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                if (!selectedLocation) return;

                // GeoJSON
                const geojson = generateGeoJSON(
                  selectedLocation,
                  calculateRadius()
                );
                downloadFile(
                  JSON.stringify(geojson, null, 2),
                  "location.geojson",
                  "application/geo+json"
                );
                setOpenMap(false);
            }
            }
            >
              Save
            </Button>
          </div>

          {selectedLocation && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Selected Location:</span>{" "}
                Latitude: {selectedLocation.lat.toFixed(6)}, Longitude:{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-[600px]">
            <MapComponent
              center={mapCenter}
              selectedLocation={selectedLocation}
              radius={calculateRadius()}
              areaSize={areaSize}
              areaUnit={areaUnit}
              onMapClick={handleMapClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
