// "use client"
"use client";
import dynamic from "next/dynamic";

// Dynamically import the AreaSelector component to avoid SSR issues
const AreaSelector = dynamic(() => import("@/app/components/AreaSelector"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map application...</p>
      </div>
    </div>
  ),
});
import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SatelliteImageryDashboard } from "@/app/satellite-dashboard/_components/SatelliteImageryDashboard";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
interface NGOFormData {
  // Project/Organization Details
  projectName: string;
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  projectLocation: string;
  gpsLatitude: string;
  gpsLongitude: string;
  landArea: string;
  landAreaUnit: string;
  mapPolygon: File | null;
  imagesList: Object[];
  // Project Type
  projectType: string;

  // Monitoring Data
  monitoringStartDate: string;
  monitoringEndDate: string;
  dataCollectionMethod: string;
  dataSources: string;
  collectionFrequency: string;

  // Measurement Inputs
  satelliteImages: File[] | null | File;
  droneImages: File[] | null | File;
  geotaggedPhotos: File[] | null | File;
  biomassData: string;
  soilSampleDetails: string;
  sedimentCoreDetails: string;
  waterQualityParams: string;

  // Activity Reports
  activityDescription: string;
  plantingDates: string;
  speciesPlanted: string;
  fieldSurveyReports: File[] | File | null;

  // Additional Evidence
  additionalEvidence: File[] | null | File;
}

export default function NGOProjectSubmissionPage() {
  const router = useRouter();
  const fileUploader = useFileUpload();
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [areaSize, setAreaSize] = useState<number>(1);
  const [areaUnit, setAreaUnit] = useState<"hectares" | "acres">("hectares");
  const [mapCenter, setMapCenter] = useState<any>({
    lat: 40.7128,
    lng: -74.006,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [openMap, setOpenMap] = useState(false);
  const [openSatelliteBox, setOpenSatelliteBox] = useState(false);
  const [imagesList, setImagesList] = useState<any[]>([]);
  const [formData, setFormData] = useState<NGOFormData>({
    projectName: "",
    organizationName: "",
    contactEmail: "",
    contactPhone: "",
    projectLocation: "",
    gpsLatitude: "",
    gpsLongitude: "",
    landArea: "",
    landAreaUnit: "hectares",
    mapPolygon: null,
    projectType: "",
    monitoringStartDate: "",
    monitoringEndDate: "",
    dataCollectionMethod: "",
    dataSources: "",
    collectionFrequency: "",
    satelliteImages: null,
    droneImages: null,
    geotaggedPhotos: null,
    biomassData: "",
    soilSampleDetails: "",
    sedimentCoreDetails: "",
    waterQualityParams: "",
    activityDescription: "",
    plantingDates: "",
    speciesPlanted: "",
    fieldSurveyReports: null,
    additionalEvidence: null,
    imagesList: [],
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      gpsLatitude: mapCenter.lat,
      gpsLongitude: mapCenter.lng,
    }));
    setFormData((prev) => ({
      ...prev,
      landArea: areaSize,
      landAreaUnit: areaUnit,
    }));
  }, [mapCenter.lat, areaUnit, areaSize]);

  // Dynamic sections based on project type
  const getSections = (projectType: string) => {
    const baseSections = ["Project Details", "Monitoring Data"];

    switch (projectType) {
      case "blue":
        return [...baseSections, "Blue Carbon Data", "Evidence Upload"];
      case "green":
        return [...baseSections, "Green Carbon Data", "Evidence Upload"];
      case "yellow":
        return [...baseSections, "Yellow Carbon Data", "Evidence Upload"];
      default:
        return [
          "Project Details",
          "Monitoring Data",
          "Measurement Inputs",
          "Evidence Upload",
        ];
    }
  };

  const sections = getSections(formData.projectType);

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (!files) {
      return;
    }

    // Convert FileList to an array
    const filesArray = Array.from(files);

    setFormData((prev) => {
      // Check if the previous state for this key is an array
      const prevFiles = Array.isArray(prev[name]) ? prev[name] : [];

      // Concatenate the previous files with the new files
      return {
        ...prev,
        [name]: [...prevFiles, ...filesArray],
      };
    });
  }

  // setSubmitting(false)
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(false);
    const satelliteImageUrl = await fileUploader.uploadMultipleFiles(
      formData.satelliteImages || null
    );
    const mapPolygonUrl = await fileUploader.uploadFile(
      formData.mapPolygon || null
    );
    const droneImagesUrl = await fileUploader.uploadMultipleFiles(
      formData.droneImages || null
    );
    const geoTaggedPhotosUrl = await fileUploader.uploadMultipleFiles(
      formData.geotaggedPhotos || null
    );
    const fieldSurveyReportsUrl = await fileUploader.uploadMultipleFiles(
      formData.fieldSurveyReports || null
    );
    const additionalEvidenceUrl = await fileUploader.uploadMultipleFiles(
      formData.additionalEvidence || null
    );
    console.log("datelite", satelliteImageUrl);
    setFormData((prev) => ({
      ...prev,
      satelliteImages: satelliteImageUrl,
      mapPolygon: mapPolygonUrl,
      droneImages: droneImagesUrl,
      geotaggedPhotos: geoTaggedPhotosUrl,
      fieldSurveyReports: fieldSurveyReportsUrl,
      additionalEvidence: additionalEvidenceUrl,
      imagesList: imagesList,
    }));
    console.log("NGO Form Data:", formData);
    const data = await axios.post("/api/projects", { data: {...formData,imagesList:imagesList} });
    router.push("/org/dashboard");
  }

  useEffect(() => {
    // console.log(imagesList);
    // console.log(formData.satelliteImages);
  }, [imagesList, formData]);

  function nextSection() {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  }

  function prevSection() {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  }

  const inputStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #D1D5DB",
    color: "#111827",
  };

  const sectionStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
  };

  return (
    <main className="min-h-dvh bg-gray-50">
      {openSatelliteBox && (
        <div className="absolute w-full h-full top-0 left-0 z-10">
          <SatelliteImageryDashboard
            setOpenSatelliteBox={setOpenSatelliteBox}
            imagesList={imagesList}
            setImagesList={setImagesList}
            latitude={Number(formData.gpsLatitude)}
            longitude={Number(formData.gpsLongitude)}
            areaSize={Number(formData.landArea)}
            areaUnit={formData.landAreaUnit}
          />
        </div>
      )}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            NGO Project Submission
          </h1>
          <p className="text-gray-600 mt-2">
            Please fill all mandatory project details and upload supporting
            materials for MRV verification.
          </p>
        </header>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentSection
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    index <= currentSection ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {section}
                </span>
                {index < sections.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      index < currentSection ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form className="space-y-8" onSubmit={onSubmit}>
          {/* Section 1: Project Details */}
          {currentSection === 0 && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Project / Organization Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Project Name *
                  </label>
                  <input
                    required
                    id="projectName"
                    name="projectName"
                    type="text"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="e.g., Amazon Rainforest Conservation Project"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organizationName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organization / NGO Name *
                  </label>
                  <input
                    required
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="e.g., Green Earth Foundation"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Email *
                  </label>
                  <input
                    required
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="contact@organization.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Phone *
                  </label>
                  <input
                    required
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectLocation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Project Location *
                  </label>
                  <input
                    required
                    id="projectLocation"
                    name="projectLocation"
                    type="text"
                    value={formData.projectLocation}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="City, State/Province, Country"
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Carbon Credit Type *
                  </label>
                  <select
                    required
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  >
                    <option value="">Select Carbon Credit Type</option>
                    <option value="blue">Blue Carbon (Coastal & Marine)</option>
                    <option value="green">
                      Green Carbon (Forests & Grasslands)
                    </option>
                    <option value="yellow">
                      Yellow Carbon (Agricultural Soils)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="gpsLatitude"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    GPS Latitude *
                  </label>
                  <input
                    required
                    id="gpsLatitude"
                    name="gpsLatitude"
                    type="number"
                    step="any"
                    value={formData.gpsLatitude}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="e.g., -3.4653"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gpsLongitude"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    GPS Longitude *
                  </label>
                  <input
                    required
                    id="gpsLongitude"
                    name="gpsLongitude"
                    type="number"
                    step="any"
                    value={formData.gpsLongitude}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="e.g., -62.2159"
                  />
                </div>
                <Button
                  onClick={() => {
                    setOpenMap(true);
                  }}
                >
                  Get Location
                </Button>
                {openMap && (
                  <div className="absolute w-full h-full top-0 left-0 z-10">
                    <AreaSelector
                      setOpenMap={setOpenMap}
                      setIsLocating={setIsLocating}
                      isLocating={isLocating}
                      locationError={locationError}
                      setMapCenter={setMapCenter}
                      setAreaUnit={setAreaUnit}
                      setAreaSize={setAreaSize}
                      setSelectedLocation={setSelectedLocation}
                      mapCenter={mapCenter}
                      areaUnit={areaUnit}
                      areaSize={areaSize}
                      selectedLocation={selectedLocation}
                      setLocationError={setLocationError}
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="landArea"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Project Area (hectares) *
                  </label>
                  <div className="flex">
                    <input
                      required
                      id="landArea"
                      name="landArea"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.landArea}
                      onChange={handleInputChange}
                      className="w-full rounded-l-md px-3 py-2"
                      style={inputStyle}
                      placeholder="100"
                    />
                    <select
                      name="landAreaUnit"
                      value={formData.landAreaUnit}
                      onChange={handleInputChange}
                      className="rounded-r-md px-3 py-2 border-l-0"
                      style={inputStyle}
                    >
                      <option value="hectares">Hectares</option>
                      <option value="acres">Acres</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="mapPolygon"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Map Polygon Upload
                </label>
                <input
                  id="mapPolygon"
                  name="mapPolygon"
                  type="file"
                  accept=".geojson,.kml,.shp,.gpx"
                  onChange={handleFileChange}
                  className="w-full rounded-md px-3 py-2"
                  style={inputStyle}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload GeoJSON, KML, Shapefile, or GPX files containing
                  project boundaries
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Monitoring Data */}
          {currentSection === 1 && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Monitoring Data
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="monitoringStartDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Monitoring Period Start Date *
                  </label>
                  <input
                    required
                    id="monitoringStartDate"
                    name="monitoringStartDate"
                    type="date"
                    value={formData.monitoringStartDate}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="monitoringEndDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Monitoring Period End Date *
                  </label>
                  <input
                    required
                    id="monitoringEndDate"
                    name="monitoringEndDate"
                    type="date"
                    value={formData.monitoringEndDate}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="dataCollectionMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data Collection Methods *
                  </label>
                  <select
                    required
                    id="dataCollectionMethod"
                    name="dataCollectionMethod"
                    value={formData.dataCollectionMethod}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  >
                    <option value="">Select Methods</option>
                    <option value="satellite">Satellite Imagery</option>
                    <option value="drone">Drone Survey</option>
                    <option value="field">Field Survey</option>
                    <option value="sensors">IoT Sensors</option>
                    <option value="mixed">Mixed Methods</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="collectionFrequency"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Frequency of Data Collection *
                  </label>
                  <select
                    required
                    id="collectionFrequency"
                    name="collectionFrequency"
                    value={formData.collectionFrequency}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  >
                    <option value="">Select Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="dataSources"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data Sources *
                </label>
                <textarea
                  required
                  id="dataSources"
                  name="dataSources"
                  rows={3}
                  value={formData.dataSources}
                  onChange={handleInputChange}
                  className="w-full rounded-md px-3 py-2"
                  style={inputStyle}
                  placeholder="e.g., Sentinel-2, Landsat-8, Drone ID: DR001, Field Survey Team Alpha"
                />
              </div>
            </div>
          )}

          {/* Section 3: Blue Carbon Data */}
          {currentSection === 2 && formData.projectType === "blue" && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Blue Carbon Data (Coastal & Marine Ecosystems)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="satelliteImages"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Satellite & Drone Images (geotagged) *
                  </label>
                  <input
                    required
                    id="satelliteImages"
                    name="satelliteImages"
                    type="file"
                    accept="image/*,.tif,.tiff"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload satellite imagery and drone survey images (TIFF,
                    GeoTIFF preferred)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="geotaggedPhotos"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Geotagged Photos / Videos *
                  </label>
                  <input
                    required
                    id="geotaggedPhotos"
                    name="geotaggedPhotos"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload geotagged field photos and videos of coastal/marine
                    ecosystems
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div
                  onClick={() => setOpenSatelliteBox(true)}
                  className="cursor-pointer"
                >
                  Get Satellite Images
                </div>

                <div>
                  <label
                    htmlFor="sedimentCoreDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sediment Core Sample Data *
                  </label>
                  <textarea
                    required
                    id="sedimentCoreDetails"
                    name="sedimentCoreDetails"
                    rows={4}
                    value={formData.sedimentCoreDetails}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Core depth, carbon content, sedimentation rates, sample locations, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="biomassData"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Plant Biomass/Species Information *
                  </label>
                  <textarea
                    required
                    id="biomassData"
                    name="biomassData"
                    rows={4}
                    value={formData.biomassData}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Mangroves, seagrass, salt marsh species composition, biomass measurements, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="waterQualityParams"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Water Quality Parameters *
                  </label>
                  <textarea
                    required
                    id="waterQualityParams"
                    name="waterQualityParams"
                    rows={3}
                    value={formData.waterQualityParams}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Salinity, pH, turbidity, dissolved oxygen, temperature, nutrient levels, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Green Carbon Data */}
          {currentSection === 2 && formData.projectType === "green" && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Green Carbon Data (Terrestrial Forests & Grasslands)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="satelliteImages"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Satellite & Drone Images (geotagged) *
                  </label>
                  <input
                    required
                    id="satelliteImages"
                    name="satelliteImages"
                    type="file"
                    accept="image/*,.tif,.tiff"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload satellite imagery and drone survey images (TIFF,
                    GeoTIFF preferred)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="geotaggedPhotos"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Geotagged Photos / Videos *
                  </label>
                  <input
                    required
                    id="geotaggedPhotos"
                    name="geotaggedPhotos"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload geotagged field photos and videos of forest/grassland
                    ecosystems
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="biomassData"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Biomass/Plant Measurements *
                  </label>
                  <textarea
                    required
                    id="biomassData"
                    name="biomassData"
                    rows={4}
                    value={formData.biomassData}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Tree counts, DBH (diameter at breast height), tree height, forest density, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="soilSampleDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Soil Sample Data *
                  </label>
                  <textarea
                    required
                    id="soilSampleDetails"
                    name="soilSampleDetails"
                    rows={3}
                    value={formData.soilSampleDetails}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Organic carbon %, depth, sample locations, pH, bulk density, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="speciesPlanted"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Species / Forest Type Description *
                  </label>
                  <textarea
                    required
                    id="speciesPlanted"
                    name="speciesPlanted"
                    rows={3}
                    value={formData.speciesPlanted}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Forest type, dominant species, biodiversity composition, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Yellow Carbon Data */}
          {currentSection === 2 && formData.projectType === "yellow" && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Yellow Carbon Data (Agricultural Soils & Practices)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="satelliteImages"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Satellite Images (geotagged) *
                  </label>
                  <input
                    required
                    id="satelliteImages"
                    name="satelliteImages"
                    type="file"
                    accept="image/*,.tif,.tiff"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload satellite imagery of agricultural fields (TIFF,
                    GeoTIFF preferred)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="geotaggedPhotos"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Proof of Practice Photos *
                  </label>
                  <input
                    required
                    id="geotaggedPhotos"
                    name="geotaggedPhotos"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload photos showing farming practices, soil conditions,
                    crop rotations
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="soilSampleDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Soil Sample Data *
                  </label>
                  <textarea
                    required
                    id="soilSampleDetails"
                    name="soilSampleDetails"
                    rows={3}
                    value={formData.soilSampleDetails}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Organic carbon %, sample dates, depth, sample locations, soil health indicators, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="speciesPlanted"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Crop and Rotation Details *
                  </label>
                  <textarea
                    required
                    id="speciesPlanted"
                    name="speciesPlanted"
                    rows={3}
                    value={formData.speciesPlanted}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Crop types, rotation schedules, planting dates, harvest information, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="activityDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description of Restoration & Conservation Activities *
                  </label>
                  <textarea
                    required
                    id="activityDescription"
                    name="activityDescription"
                    rows={4}
                    value={formData.activityDescription}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Cover cropping, zero tillage, organic farming, regenerative practices, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Evidence Upload */}
          {currentSection === 3 && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Evidence Upload
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="fieldSurveyReports"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Field Survey or Audit Reports *
                  </label>
                  <input
                    required
                    id="fieldSurveyReports"
                    name="fieldSurveyReports"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload field survey reports, third-party audit reports, and
                    documentation
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="additionalEvidence"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Any Additional Evidence (photos, videos) *
                  </label>
                  <input
                    required
                    id="additionalEvidence"
                    name="additionalEvidence"
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload any additional supporting evidence, photos, videos,
                    or documents
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={nextSection}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                // di5sabled={submitting}
                className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit for Verification"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
