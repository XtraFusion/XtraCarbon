// Re-export all model interfaces for easy access
export type { IUser } from '../models/User';
export type { 
  INGOProjectSubmission, 
  IFileUpload, 
  ILocation, 
  IMonitoringData,
  IBlueCarbonData,
  IGreenCarbonData,
  IYellowCarbonData
} from '../models/NGOProjectSubmission';
export type { 
  IVerifierSubmission, 
  IVerificationChecklist 
} from '../models/VerifierSubmission';

// Common types used across the application
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form submission types
export interface NGOFormSubmissionData {
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
  mapPolygon?: File;
  
  // Project Type
  projectType: 'blue' | 'green' | 'yellow';
  
  // Monitoring Data
  monitoringStartDate: string;
  monitoringEndDate: string;
  dataCollectionMethod: string;
  dataSources: string;
  collectionFrequency: string;
  
  // Measurement Inputs
  satelliteImages?: File;
  droneImages?: File;
  geotaggedPhotos?: File;
  biomassData: string;
  soilSampleDetails: string;
  sedimentCoreDetails: string;
  waterQualityParams: string;
  
  // Activity Reports
  activityDescription: string;
  plantingDates: string;
  speciesPlanted: string;
  fieldSurveyReports?: File;
  
  // Additional Evidence
  additionalEvidence?: File;
}

export interface VerifierFormSubmissionData {
  // Project Review
  projectName: string;
  organizationName: string;
  projectLocation: string;
  projectType: string;
  landArea: string;
  
  // Verification Details
  verificationDate: string;
  verifierName: string;
  verifierOrganization: string;
  verificationStatus: string;
  reviewComments: string;
  verificationMethodology: string;
  verificationReport?: File;
  
  // Verification Checklist
  meetsStandards: boolean;
  mrvDataComplete: boolean;
  evidenceSufficient: boolean;
  locationVerified: boolean;
  calculationsVerified: boolean;
  
  // Approval Decision
  carbonCreditsToMint: string;
  blockchainTxId: string;
  creditVintage: string;
}

// Dashboard and analytics types
export interface DashboardStats {
  totalProjects: number;
  pendingVerifications: number;
  approvedProjects: number;
  totalCarbonCredits: number;
  projectsByType: {
    blue: number;
    green: number;
    yellow: number;
  };
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'project_submitted' | 'project_approved' | 'project_rejected' | 'verification_completed';
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  projectId?: string;
}

// Search and filter types
export interface ProjectSearchFilters {
  projectType?: 'blue' | 'green' | 'yellow';
  status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_revision';
  country?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  minArea?: number;
  maxArea?: number;
}

export interface VerifierSearchFilters {
  status?: 'pending' | 'in_progress' | 'approved' | 'rejected';
  verifierId?: string;
  projectType?: 'blue' | 'green' | 'yellow';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Notification types
export interface NotificationData {
  id: string;
  userId: string;
  type: 'project_status_change' | 'verification_assigned' | 'verification_completed' | 'system_announcement';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// File upload types
export interface FileUploadResult {
  success: boolean;
  file?: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  };
  error?: string;
}

// Blockchain integration types
export interface CarbonCreditToken {
  tokenId: string;
  projectId: string;
  amount: number; // in tCO2e
  vintage: number;
  projectType: 'blue' | 'green' | 'yellow';
  blockchainTxId: string;
  mintedAt: Date;
  status: 'minted' | 'retired' | 'transferred';
}

export interface BlockchainTransaction {
  txId: string;
  blockNumber: number;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
  confirmedAt?: Date;
}
