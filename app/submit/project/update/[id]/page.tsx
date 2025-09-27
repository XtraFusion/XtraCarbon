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
import { useParams, useRouter } from "next/navigation";
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
  landArea: string | number;
  landAreaUnit: string;
  mapPolygon: File | null;
  imagesList: Object[];
  // Project Type
  projectType: string;
  proposedCredit: Number;

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
  const params = useParams();
  const projectId = (params as any)?.id as string | undefined;
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
  const [treeCountResult, setTreeCountResult] = useState<{count: number, success: boolean} | null>(null);
  const [isCountingTrees, setIsCountingTrees] = useState(false);
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
    proposedCredit: 0,
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

  // Existing files loaded from backend for preview
  const [existingFiles, setExistingFiles] = useState<any>({
    imagesList: [],
    fieldSurveyReports: [],
    additionalEvidence: [],
    mapPolygon: [],
    blue: { satelliteImages: [], geotaggedPhotos: [] },
    green: { satelliteImages: [], geotaggedPhotos: [], droneImages: [] },
    yellow: { satelliteImages: [], geotaggedPhotos: [] },
  });

  const filesFrom = (src: any): { url: string; label: string; isImage: boolean }[] => {
    if (!src) return [];
    const arr = Array.isArray(src) ? src : [src];
    return arr
      .map((item: any, idx: number) => {
        const url =
          (typeof item === "string" && item) ||
          item?.url ||
          item?.downloadUrl ||
          item?.href ||
          item?.path ||
          "";
        if (!url) return null;
        const isImage = /\.(png|jpg|jpeg|gif|webp|tif|tiff)$/i.test(url);
        const label = item?.name || `file-${idx + 1}`;
        return { url, label, isImage };
      })
      .filter(Boolean) as { url: string; label: string; isImage: boolean }[];
  };

  const FilePreview = ({ items }: { items: { url: string; label: string; isImage: boolean }[] }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((f, i) => (
          (() => {
            const lowerUrl = (f.url || "").toLowerCase();
            const isDoc = /\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i.test(lowerUrl);
            const openUrl = !f.isImage && isDoc
              ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(f.url)}`
              : f.url;
            return (
              <a
                key={i}
                href={openUrl}
                target="_blank"
                rel="noreferrer"
                className="border rounded-md p-2 hover:bg-gray-50"
              >
            {f.isImage ? (
              <img src={f.url} alt={f.label} className="w-full h-28 object-cover rounded" />
            ) : (
              <div className="text-sm truncate">{f.label}</div>
            )}
            <div className="mt-1 text-xs text-gray-500 truncate">{f.label}</div>
              </a>
            );
          })()
        ))}
      </div>
    );
  };

  // Load existing project for edit mode by route param id
  useEffect(() => {
    async function loadForEdit(id: string) {
      try {
        const res = await axios.get(`/api/projects/${id}`);
        const p = res.data?.data;
        if (!p) return;
        setFormData((prev) => ({
          ...prev,
          projectName: p.projectName || "",
          organizationName: p.organizationName || "",
          contactEmail: p.contactEmail || "",
          contactPhone: p.contactPhone || "",
          projectLocation: p.location?.address || "",
          gpsLatitude: String(p.location?.latitude ?? ""),
          gpsLongitude: String(p.location?.longitude ?? ""),
          landArea: String(p.landArea ?? ""),
          landAreaUnit: p.landAreaUnit || "hectares",
          projectType: p.projectType || "",
          monitoringStartDate: p.monitoringData?.startDate ? new Date(p.monitoringData.startDate).toISOString().slice(0,10) : "",
          monitoringEndDate: p.monitoringData?.endDate ? new Date(p.monitoringData.endDate).toISOString().slice(0,10) : "",
          dataCollectionMethod: p.monitoringData?.collectionMethod || "",
          dataSources: Array.isArray(p.monitoringData?.dataSources)
            ? p.monitoringData.dataSources.join(", ")
            : (p.monitoringData?.dataSources || ""),
          collectionFrequency: p.monitoringData?.frequency || "",
          proposedCredit: Number(p.proposedCredit || 0),
          imagesList: Array.isArray(p.imagesList) ? p.imagesList : [],
          biomassData: p.greenCarbonData?.biomassData || "",
          soilSampleDetails: p.greenCarbonData?.soilSampleDetails || p.yellowCarbonData?.soilSampleDetails || "",
          sedimentCoreDetails: p.blueCarbonData?.sedimentCoreDetails || "",
          waterQualityParams: p.blueCarbonData?.waterQualityParams || "",
          activityDescription: p.yellowCarbonData?.activityDescription || "",
          plantingDates: "",
          speciesPlanted: p.greenCarbonData?.speciesPlanted || p.yellowCarbonData?.speciesPlanted || "",
        }));
        // Normalize and store existing files for previews
        setExistingFiles({
          imagesList: filesFrom(p.imagesList),
          fieldSurveyReports: filesFrom(p.fieldSurveyReports),
          additionalEvidence: filesFrom(p.additionalEvidence),
          mapPolygon: filesFrom(p.mapPolygon),
          blue: {
            satelliteImages: filesFrom(p.blueCarbonData?.satelliteImages),
            geotaggedPhotos: filesFrom(p.blueCarbonData?.geotaggedPhotos),
          },
          green: {
            satelliteImages: filesFrom(p.greenCarbonData?.satelliteImages),
            geotaggedPhotos: filesFrom(p.greenCarbonData?.geotaggedPhotos),
            droneImages: filesFrom(p.greenCarbonData?.droneImages),
          },
          yellow: {
            satelliteImages: filesFrom(p.yellowCarbonData?.satelliteImages),
            geotaggedPhotos: filesFrom(p.yellowCarbonData?.geotaggedPhotos),
          },
        });
        if (p.location?.latitude && p.location?.longitude) {
          setMapCenter({ lat: p.location.latitude, lng: p.location.longitude });
        }
      } catch (e) {
        console.error("Failed to load project for edit", e);
      }
    }
    if (projectId) {
      loadForEdit(projectId);
    }
  }, [projectId]);

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
      const prevFiles = Array.isArray(prev[name as keyof NGOFormData]) ? prev[name as keyof NGOFormData] as File[] : [];

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
    
    // Helper function to convert single file to array
    const toFileArray = (files: File | File[] | null): File[] | null => {
      if (!files) return null;
      return Array.isArray(files) ? files : [files];
    };
    
    const satelliteImageUrl = await fileUploader.uploadMultipleFiles(
      toFileArray(formData.satelliteImages)
    );
    const mapPolygonUrl = formData.mapPolygon ? await fileUploader.uploadFile(
      formData.mapPolygon
    ) : null;
    const droneImagesUrl = await fileUploader.uploadMultipleFiles(
      toFileArray(formData.droneImages)
    );
    const geoTaggedPhotosUrl = await fileUploader.uploadMultipleFiles(
      toFileArray(formData.geotaggedPhotos)
    );
    const fieldSurveyReportsUrl = await fileUploader.uploadMultipleFiles(
      toFileArray(formData.fieldSurveyReports)
    );
    const additionalEvidenceUrl = await fileUploader.uploadMultipleFiles(
      toFileArray(formData.additionalEvidence)
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

    if (projectId) {
      const updates: any = {
        projectName: formData.projectName,
        organizationName: formData.organizationName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        projectType: formData.projectType,
        location: {
          latitude: parseFloat(String(formData.gpsLatitude || 0)),
          longitude: parseFloat(String(formData.gpsLongitude || 0)),
          address: formData.projectLocation,
        },
        landArea: Number(formData.landArea || 0),
        landAreaUnit: formData.landAreaUnit,
        monitoringData: {
          startDate: formData.monitoringStartDate ? new Date(formData.monitoringStartDate) : undefined,
          endDate: formData.monitoringEndDate ? new Date(formData.monitoringEndDate) : undefined,
          collectionMethod: formData.dataCollectionMethod,
          dataSources: typeof formData.dataSources === "string"
            ? formData.dataSources.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.dataSources,
          frequency: formData.collectionFrequency,
        },
        proposedCredit: Number(formData.proposedCredit || 0),
        imagesList: imagesList,
        blueCarbonData: {
          sedimentCoreDetails: formData.sedimentCoreDetails,
          waterQualityParams: formData.waterQualityParams,
          satelliteImages: satelliteImageUrl || undefined,
          geotaggedPhotos: geoTaggedPhotosUrl || undefined,
        },
        greenCarbonData: {
          biomassData: formData.biomassData,
          soilSampleDetails: formData.soilSampleDetails,
          speciesPlanted: formData.speciesPlanted,
          satelliteImages: satelliteImageUrl || undefined,
          droneImages: droneImagesUrl || undefined,
          geotaggedPhotos: geoTaggedPhotosUrl || undefined,
        },
        yellowCarbonData: {
          soilSampleDetails: formData.soilSampleDetails,
          speciesPlanted: formData.speciesPlanted,
          activityDescription: formData.activityDescription,
          satelliteImages: satelliteImageUrl || undefined,
          geotaggedPhotos: geoTaggedPhotosUrl || undefined,
        },
        fieldSurveyReports: fieldSurveyReportsUrl || undefined,
        additionalEvidence: additionalEvidenceUrl || undefined,
      };

      await axios.patch(`/api/projects/${projectId}`, {
        updates,
        setReapply: true,
      });
      router.push("/org/dashboard");
      return;
    }
    // Fallback: if no id present, redirect back
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

  // Function to count trees in satellite images
  async function countTreesInImages() {
    if (!imagesList || imagesList.length === 0) {
      alert("Please select satellite images first!");
      return;
    }

    setIsCountingTrees(true);
    setTreeCountResult(null);

    try {
      let totalTrees = 0;
      let processedImages = 0;

      for (const image of imagesList) {
        try {
          const imageUrl = image.url || image.downloadUrl;
          if (!imageUrl) {
            console.warn("Image missing URL/downloadUrl", image);
            continue;
          }

          const response = await fetch("/api/tree/count", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              totalTrees += result.count;
              processedImages++;
            }
          } else {
            console.error(`Tree counting API error: ${response.status}`);
          }
        } catch (imageError) {
          console.error("Error processing individual image:", imageError);
          continue;
        }
      }

      if (processedImages > 0) {
        setTreeCountResult({
          count: totalTrees,
          success: true
        });
        alert(`Tree Count Analysis Complete!\n\nProcessed Images: ${processedImages}\nTotal Trees Detected: ${totalTrees}\nAverage Trees per Image: ${Math.round(totalTrees / processedImages)}`);
      } else {
        setTreeCountResult({
          count: 0,
          success: false
        });
        alert("No images could be processed for tree counting.");
      }
    } catch (error) {
      console.error("Tree counting error:", error);
      setTreeCountResult({
        count: 0,
        success: false
      });
      alert("Error processing images for tree counting. Please try again.");
    } finally {
      setIsCountingTrees(false);
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
          <h1 className="text-3xl font-bold text-green-600">Update Project</h1>
          <p className="text-gray-600 mt-2">
            Update your project details and resubmit for MRV verification.
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
                    htmlFor="proposedCredit"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Propose Credit *
                  </label>
                  <input
                    required
                    id="proposedCredit"
                    name="proposedCredit"
                    type="number"
                    value={formData.proposedCredit.toString()}
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
                      {...({
                        setOpenMap,
                        setIsLocating,
                        isLocating,
                        locationError,
                        setMapCenter,
                        setAreaUnit,
                        setAreaSize,
                        setSelectedLocation,
                        mapCenter,
                        areaUnit,
                        areaSize,
                        selectedLocation,
                        setLocationError,
                      } as any)}
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
              <FilePreview items={existingFiles.mapPolygon} />
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
                  <FilePreview items={existingFiles.blue.satelliteImages} />
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
                  <FilePreview items={existingFiles.blue.geotaggedPhotos} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div
                    onClick={() => setOpenSatelliteBox(true)}
                    className="
      cursor-pointer 
      bg-gradient-to-r from-green-500 to-emerald-600 
      text-white font-semibold 
      px-6 py-3 rounded-2xl 
      shadow-md 
      transform transition-all duration-300 
      hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-emerald-700 
      active:scale-95
    "
                  >
                    Get Satellite Images
                  </div>
                  
                  <button
                    type="button"
                    onClick={countTreesInImages}
                    disabled={isCountingTrees || imagesList.length === 0}
                    className={`
      cursor-pointer 
      bg-gradient-to-r from-blue-500 to-blue-600 
      text-white font-semibold 
      px-6 py-3 rounded-2xl 
      shadow-md 
      transform transition-all duration-300 
      hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 
      active:scale-95
      ${(isCountingTrees || imagesList.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}
    `}
                  >
                    {isCountingTrees ? "Counting Trees..." : "Count Trees"}
                  </button>
                </div>

                {treeCountResult && (
                  <div className={`p-4 rounded-lg border-2 ${
                    treeCountResult.success 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <h4 className="font-semibold mb-2">Tree Count Results</h4>
                    <p>Total Trees Detected: <span className="font-bold">{treeCountResult.count}</span></p>
                    <p className="text-sm mt-1">
                      {treeCountResult.success 
                        ? 'Analysis completed successfully!' 
                        : 'Analysis failed. Please try again.'}
                    </p>
                  </div>
                )}

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
                  <FilePreview
                    items={
                      existingFiles.green.satelliteImages && existingFiles.green.satelliteImages.length > 0
                        ? existingFiles.green.satelliteImages
                        : existingFiles.green.droneImages
                    }
                  />
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
                  <FilePreview items={existingFiles.green.geotaggedPhotos} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div
                    onClick={() => setOpenSatelliteBox(true)}
                    className="
      cursor-pointer 
      bg-gradient-to-r from-green-500 to-emerald-600 
      text-white font-semibold 
      px-6 py-3 rounded-2xl 
      shadow-md 
      transform transition-all duration-300 
      hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-emerald-700 
      active:scale-95
    "
                  >
                    Get Satellite Images
                  </div>
                  
                  <button
                    type="button"
                    onClick={countTreesInImages}
                    disabled={isCountingTrees || imagesList.length === 0}
                    className={`
      cursor-pointer 
      bg-gradient-to-r from-blue-500 to-blue-600 
      text-white font-semibold 
      px-6 py-3 rounded-2xl 
      shadow-md 
      transform transition-all duration-300 
      hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 
      active:scale-95
      ${(isCountingTrees || imagesList.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}
    `}
                  >
                    {isCountingTrees ? "Counting Trees..." : "Count Trees"}
                  </button>
                </div>

                {treeCountResult && (
                  <div className={`p-4 rounded-lg border-2 ${
                    treeCountResult.success 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <h4 className="font-semibold mb-2">Tree Count Results</h4>
                    <p>Total Trees Detected: <span className="font-bold">{treeCountResult.count}</span></p>
                    <p className="text-sm mt-1">
                      {treeCountResult.success 
                        ? 'Analysis completed successfully!' 
                        : 'Analysis failed. Please try again.'}
                    </p>
                  </div>
                )}

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
                  <FilePreview items={existingFiles.yellow.satelliteImages} />
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
                  <FilePreview items={existingFiles.yellow.geotaggedPhotos} />
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
                  <FilePreview items={existingFiles.fieldSurveyReports} />
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
                  <FilePreview items={existingFiles.additionalEvidence} />
                </div>
                {existingFiles.imagesList?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Previously Added Images</h3>
                    <FilePreview items={existingFiles.imagesList} />
                  </div>
                )}
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
