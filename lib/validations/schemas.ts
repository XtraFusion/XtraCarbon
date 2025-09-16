import { z } from 'zod';

// File upload validation
export const FileUploadSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().min(0),
  url: z.string().url(),
  uploadedAt: z.date()
});

// Location validation
export const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(1).max(500),
  country: z.string().min(1).max(100),
  region: z.string().max(100).optional(),
  city: z.string().max(100).optional()
});

// Monitoring data validation
export const MonitoringDataSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  collectionMethod: z.enum(['satellite', 'drone', 'field', 'sensors', 'mixed']),
  dataSources: z.array(z.string()).min(1),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually'])
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
});

// Project-specific data schemas
export const BlueCarbonDataSchema = z.object({
  sedimentCoreDetails: z.string().min(1).max(2000),
  biomassData: z.string().min(1).max(2000),
  waterQualityParams: z.string().min(1).max(1000),
  satelliteImages: z.array(FileUploadSchema).optional(),
  droneImages: z.array(FileUploadSchema).optional(),
  geotaggedPhotos: z.array(FileUploadSchema).optional()
});

export const GreenCarbonDataSchema = z.object({
  biomassData: z.string().min(1).max(2000),
  soilSampleDetails: z.string().min(1).max(2000),
  speciesPlanted: z.string().min(1).max(1000),
  satelliteImages: z.array(FileUploadSchema).optional(),
  droneImages: z.array(FileUploadSchema).optional(),
  geotaggedPhotos: z.array(FileUploadSchema).optional()
});

export const YellowCarbonDataSchema = z.object({
  soilSampleDetails: z.string().min(1).max(2000),
  speciesPlanted: z.string().min(1).max(1000),
  activityDescription: z.string().min(1).max(2000),
  satelliteImages: z.array(FileUploadSchema).optional(),
  geotaggedPhotos: z.array(FileUploadSchema).optional()
});

// User validation
export const UserSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.enum(['user', 'org', 'admin']),
  organizationName: z.string().max(200).optional(),
  contactPhone: z.string().max(20).optional(),
  profileImage: z.string().url().optional(),
  isActive: z.boolean().default(true),
  preferences: z.object({
    notifications: z.boolean().default(true),
    emailUpdates: z.boolean().default(true),
    language: z.string().default('en')
  }).optional(),
  metadata: z.record(z.any()).optional()
});

// NGO Project Submission validation
export const NGOProjectSubmissionSchema = z.object({
  projectName: z.string().min(1).max(200),
  organizationName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1).max(20),
  projectType: z.enum(['blue', 'green', 'yellow']),
  location: LocationSchema,
  landArea: z.number().min(0),
  landAreaUnit: z.enum(['hectares', 'acres']),
  mapPolygon: FileUploadSchema.optional(),
  monitoringData: MonitoringDataSchema,
  blueCarbonData: BlueCarbonDataSchema.optional(),
  greenCarbonData: GreenCarbonDataSchema.optional(),
  yellowCarbonData: YellowCarbonDataSchema.optional(),
  fieldSurveyReports: z.array(FileUploadSchema).optional(),
  additionalEvidence: z.array(FileUploadSchema).optional(),
  submittedBy: z.string().min(1),
  submissionStatus: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_revision']).default('draft'),
  reviewerId: z.string().optional(),
  reviewComments: z.string().max(2000).optional(),
  reviewDate: z.date().optional(),
  verifierId: z.string().optional(),
  verificationStatus: z.enum(['pending', 'in_progress', 'verified', 'rejected']).optional(),
  verificationDate: z.date().optional(),
  estimatedCarbonCredits: z.number().min(0).optional(),
  verifiedCarbonCredits: z.number().min(0).optional(),
  creditVintage: z.number().min(2020).max(2030).optional()
}).refine(data => {
  // Ensure only relevant project data is present based on project type
  if (data.projectType === 'blue') {
    return !data.greenCarbonData && !data.yellowCarbonData;
  } else if (data.projectType === 'green') {
    return !data.blueCarbonData && !data.yellowCarbonData;
  } else if (data.projectType === 'yellow') {
    return !data.blueCarbonData && !data.greenCarbonData;
  }
  return true;
}, {
  message: "Project-specific data must match the selected project type",
  path: ["projectType"]
});

// Verification checklist validation
export const VerificationChecklistSchema = z.object({
  meetsStandards: z.boolean(),
  mrvDataComplete: z.boolean(),
  evidenceSufficient: z.boolean(),
  locationVerified: z.boolean(),
  calculationsVerified: z.boolean()
});

// Verifier Submission validation
export const VerifierSubmissionSchema = z.object({
  projectSubmissionId: z.string().min(1),
  projectName: z.string().min(1).max(200),
  organizationName: z.string().min(1).max(200),
  projectLocation: z.string().min(1).max(500),
  projectType: z.enum(['blue', 'green', 'yellow']),
  landArea: z.number().min(0),
  landAreaUnit: z.enum(['hectares', 'acres']),
  verifierId: z.string().min(1),
  verifierName: z.string().min(1).max(100),
  verifierOrganization: z.string().min(1).max(200),
  verificationDate: z.date(),
  verificationStatus: z.enum(['pending', 'in_progress', 'approved', 'rejected']).default('pending'),
  reviewComments: z.string().min(1).max(2000),
  verificationMethodology: z.string().min(1).max(1000),
  verificationReport: FileUploadSchema.optional(),
  verificationChecklist: VerificationChecklistSchema,
  carbonCreditsToMint: z.number().min(0).optional(),
  blockchainTxId: z.string().optional(),
  creditVintage: z.number().min(2020).max(2030).optional(),
  verificationNotes: z.string().max(1000).optional(),
  standardsCompliance: z.array(z.string()).optional(),
  riskAssessment: z.string().max(1000).optional(),
  recommendations: z.string().max(1000).optional()
}).refine(data => {
  // If approved, carbon credits and vintage must be provided
  if (data.verificationStatus === 'approved') {
    return data.carbonCreditsToMint !== undefined && data.creditVintage !== undefined;
  }
  return true;
}, {
  message: "Carbon credits amount and vintage are required for approved projects",
  path: ["verificationStatus"]
});

// Form submission validation schemas (for API endpoints)
export const NGOFormSubmissionSchema = z.object({
  // Project/Organization Details
  projectName: z.string().min(1).max(200),
  organizationName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1).max(20),
  projectLocation: z.string().min(1).max(500),
  gpsLatitude: z.number(),
  gpsLongitude: z.number(),
  landArea: z.number(),
  landAreaUnit: z.enum(['hectares', 'acres']),
  
  // Project Type
  projectType: z.enum(['blue', 'green', 'yellow']),
  
  // Monitoring Data
  monitoringStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  monitoringEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dataCollectionMethod: z.enum(['satellite', 'drone', 'field', 'sensors', 'mixed']),
  dataSources: z.string().min(1).max(1000),
  collectionFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually']),
  
  // Measurement Inputs (conditional based on project type)
  biomassData: z.string().min(1).max(2000),
  soilSampleDetails: z.string().min(1).max(2000),
  sedimentCoreDetails: z.string().min(1).max(2000),
  waterQualityParams: z.string().min(1).max(1000),
  
  // Activity Reports
  activityDescription: z.string().min(1).max(2000),
  plantingDates: z.string().max(500),
  speciesPlanted: z.string().min(1).max(1000)
}).refine(data => {
  const startDate = new Date(data.monitoringStartDate);
  const endDate = new Date(data.monitoringEndDate);
  return endDate > startDate;
}, {
  message: "Monitoring end date must be after start date",
  path: ["monitoringEndDate"]
});

export const VerifierFormSubmissionSchema = z.object({
  // Project Review
  projectName: z.string().min(1).max(200),
  organizationName: z.string().min(1).max(200),
  projectLocation: z.string().min(1).max(500),
  projectType: z.string().min(1),
  landArea: z.string().min(1),
  
  // Verification Details
  verificationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  verifierName: z.string().min(1).max(100),
  verifierOrganization: z.string().min(1).max(200),
  verificationStatus: z.enum(['Pending', 'In-Progress', 'Approved', 'Rejected']),
  reviewComments: z.string().min(1).max(2000),
  verificationMethodology: z.string().min(1).max(1000),
  
  // Verification Checklist
  meetsStandards: z.boolean(),
  mrvDataComplete: z.boolean(),
  evidenceSufficient: z.boolean(),
  locationVerified: z.boolean(),
  calculationsVerified: z.boolean(),
  
  // Approval Decision
  carbonCreditsToMint: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  blockchainTxId: z.string().optional(),
  creditVintage: z.string().regex(/^\d{4}$/).optional()
});

// Search and filter validation schemas
export const ProjectSearchFiltersSchema = z.object({
  projectType: z.enum(['blue', 'green', 'yellow']).optional(),
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_revision']).optional(),
  country: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }).optional(),
  minArea: z.number().min(0).optional(),
  maxArea: z.number().min(0).optional()
});

export const VerifierSearchFiltersSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'approved', 'rejected']).optional(),
  verifierId: z.string().optional(),
  projectType: z.enum(['blue', 'green', 'yellow']).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }).optional()
});

// Pagination validation
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Export type inference helpers
export type UserInput = z.infer<typeof UserSchema>;
export type NGOProjectSubmissionInput = z.infer<typeof NGOProjectSubmissionSchema>;
export type VerifierSubmissionInput = z.infer<typeof VerifierSubmissionSchema>;
export type NGOFormSubmissionInput = z.infer<typeof NGOFormSubmissionSchema>;
export type VerifierFormSubmissionInput = z.infer<typeof VerifierFormSubmissionSchema>;
export type ProjectSearchFiltersInput = z.infer<typeof ProjectSearchFiltersSchema>;
export type VerifierSearchFiltersInput = z.infer<typeof VerifierSearchFiltersSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
