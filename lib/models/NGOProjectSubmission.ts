import mongoose, { Document, Schema } from 'mongoose';

// File upload interface
export interface IFileUpload {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

// Location interface
export interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
  country: string;
  region?: string;
  city?: string;
}

// Monitoring data interface
export interface IMonitoringData {
  startDate: Date;
  endDate: Date;
  collectionMethod: string;
  dataSources: string[];
  frequency: string;
}

// Project-specific data interfaces
export interface IBlueCarbonData {
  sedimentCoreDetails: string;
  biomassData: string;
  waterQualityParams: string;
  satelliteImages?: IFileUpload[];
  droneImages?: IFileUpload[];
  geotaggedPhotos?: IFileUpload[];
}

export interface IGreenCarbonData {
  biomassData: string;
  soilSampleDetails: string;
  speciesPlanted: string;
  satelliteImages?: IFileUpload[];
  droneImages?: IFileUpload[];
  geotaggedPhotos?: IFileUpload[];
}

export interface IYellowCarbonData {
  soilSampleDetails: string;
  speciesPlanted: string;
  activityDescription: string;
  satelliteImages?: IFileUpload[];
  geotaggedPhotos?: IFileUpload[];
}

// NGO Project Submission interface
export interface INGOProjectSubmission extends Document {
  // Basic project information
  projectName: string;
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  projectType: 'blue' | 'green' | 'yellow';
  
  // Location and area
  location: ILocation;
  landArea: number;
  landAreaUnit: 'hectares' | 'acres';
  mapPolygon?: IFileUpload;
  
  // Monitoring data
  monitoringData: IMonitoringData;
  
  // Project-specific data
  blueCarbonData?: IBlueCarbonData;
  greenCarbonData?: IGreenCarbonData;
  yellowCarbonData?: IYellowCarbonData;
  
  // Additional evidence
  fieldSurveyReports?: IFileUpload[];
  additionalEvidence?: IFileUpload[];
  
  // Submission metadata
  submittedBy: string; // Clerk user ID
  submissionStatus: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_revision';
  submissionDate: Date;
  
  // Review information
  reviewerId?: string;
  reviewComments?: string;
  reviewDate?: Date;
  
  // Verification information
  verifierId?: string;
  verificationStatus?: 'pending' | 'in_progress' | 'verified' | 'rejected';
  verificationDate?: Date;
  
  // Carbon credit information
  estimatedCarbonCredits?: number;
  verifiedCarbonCredits?: number;
  creditVintage?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// File upload schema
const FileUploadSchema = new Schema<IFileUpload>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

// Location schema
const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String },
  city: { type: String }
}, { _id: false });

// Monitoring data schema
const MonitoringDataSchema = new Schema<IMonitoringData>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  collectionMethod: { type: String, required: true },
  dataSources: [{ type: String }],
  frequency: { type: String, required: true }
}, { _id: false });

// Project-specific data schemas
const BlueCarbonDataSchema = new Schema<IBlueCarbonData>({
  sedimentCoreDetails: { type: String, required: true },
  biomassData: { type: String, required: true },
  waterQualityParams: { type: String, required: true },
  satelliteImages: [FileUploadSchema],
  droneImages: [FileUploadSchema],
  geotaggedPhotos: [FileUploadSchema]
}, { _id: false });

const GreenCarbonDataSchema = new Schema<IGreenCarbonData>({
  biomassData: { type: String, required: true },
  soilSampleDetails: { type: String, required: true },
  speciesPlanted: { type: String, required: true },
  satelliteImages: [FileUploadSchema],
  droneImages: [FileUploadSchema],
  geotaggedPhotos: [FileUploadSchema]
}, { _id: false });

const YellowCarbonDataSchema = new Schema<IYellowCarbonData>({
  soilSampleDetails: { type: String, required: true },
  speciesPlanted: { type: String, required: true },
  activityDescription: { type: String, required: true },
  satelliteImages: [FileUploadSchema],
  geotaggedPhotos: [FileUploadSchema]
}, { _id: false });

// Main NGO Project Submission schema
const NGOProjectSubmissionSchema = new Schema<INGOProjectSubmission>({
  // Basic project information
  projectName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  organizationName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  projectType: {
    type: String,
    required: true,
    enum: ['blue', 'green', 'yellow']
  },
  
  // Location and area
  location: {
    type: LocationSchema,
    required: true
  },
  landArea: {
    type: Number,
    required: true,
    min: 0
  },
  landAreaUnit: {
    type: String,
    required: true,
    enum: ['hectares', 'acres']
  },
  mapPolygon: FileUploadSchema,
  
  // Monitoring data
  monitoringData: {
    type: MonitoringDataSchema,
    required: true
  },
  
  // Project-specific data (conditional based on project type)
  blueCarbonData: BlueCarbonDataSchema,
  greenCarbonData: GreenCarbonDataSchema,
  yellowCarbonData: YellowCarbonDataSchema,
  
  // Additional evidence
  fieldSurveyReports: [FileUploadSchema],
  additionalEvidence: [FileUploadSchema],
  
  // Submission metadata
  submittedBy: {
    type: String,
    required: true,
    index: true
  },
  submissionStatus: {
    type: String,
    required: true,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_revision'],
    default: 'draft',
    index: true
  },
  submissionDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Review information
  reviewerId: {
    type: String,
    index: true
  },
  reviewComments: {
    type: String,
    maxlength: 2000
  },
  reviewDate: {
    type: Date
  },
  
  // Verification information
  verifierId: {
    type: String,
    index: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'verified', 'rejected'],
    index: true
  },
  verificationDate: {
    type: Date
  },
  
  // Carbon credit information
  estimatedCarbonCredits: {
    type: Number,
    min: 0
  },
  verifiedCarbonCredits: {
    type: Number,
    min: 0
  },
  creditVintage: {
    type: Number,
    min: 2020,
    max: 2030
  }
}, {
  timestamps: true,
  collection: 'ngo_project_submissions'
});

// Indexes for better query performance
NGOProjectSubmissionSchema.index({ submittedBy: 1, submissionStatus: 1 });
NGOProjectSubmissionSchema.index({ projectType: 1, submissionStatus: 1 });
NGOProjectSubmissionSchema.index({ submissionDate: -1 });
NGOProjectSubmissionSchema.index({ 'location.country': 1 });
NGOProjectSubmissionSchema.index({ verifierId: 1, verificationStatus: 1 });
NGOProjectSubmissionSchema.index({ reviewerId: 1 });

// Compound indexes
NGOProjectSubmissionSchema.index({ 
  projectType: 1, 
  submissionStatus: 1, 
  submissionDate: -1 
});

// Pre-save middleware
NGOProjectSubmissionSchema.pre('save', function(next) {
  // Ensure only relevant project data is present based on project type
  if (this.projectType === 'blue') {
    this.greenCarbonData = undefined;
    this.yellowCarbonData = undefined;
  } else if (this.projectType === 'green') {
    this.blueCarbonData = undefined;
    this.yellowCarbonData = undefined;
  } else if (this.projectType === 'yellow') {
    this.blueCarbonData = undefined;
    this.greenCarbonData = undefined;
  }
  
  // Update submission date when status changes to submitted
  if (this.isModified('submissionStatus') && this.submissionStatus === 'submitted') {
    this.submissionDate = new Date();
  }
  
  next();
});

// Static methods
NGOProjectSubmissionSchema.statics.findBySubmitter = function(submittedBy: string) {
  return this.find({ submittedBy }).sort({ submissionDate: -1 });
};

NGOProjectSubmissionSchema.statics.findByStatus = function(status: string) {
  return this.find({ submissionStatus: status }).sort({ submissionDate: -1 });
};

NGOProjectSubmissionSchema.statics.findByProjectType = function(projectType: string) {
  return this.find({ projectType }).sort({ submissionDate: -1 });
};

NGOProjectSubmissionSchema.statics.findPendingVerification = function() {
  return this.find({ 
    submissionStatus: 'submitted',
    verificationStatus: { $in: ['pending', 'in_progress'] }
  }).sort({ submissionDate: 1 });
};

// Instance methods
NGOProjectSubmissionSchema.methods.submitForReview = function() {
  this.submissionStatus = 'submitted';
  this.submissionDate = new Date();
  return this.save();
};

NGOProjectSubmissionSchema.methods.assignVerifier = function(verifierId: string) {
  this.verifierId = verifierId;
  this.verificationStatus = 'in_progress';
  return this.save();
};

NGOProjectSubmissionSchema.methods.completeVerification = function(verifiedCredits: number, vintage: number) {
  this.verificationStatus = 'verified';
  this.verifiedCarbonCredits = verifiedCredits;
  this.creditVintage = vintage;
  this.verificationDate = new Date();
  this.submissionStatus = 'approved';
  return this.save();
};

NGOProjectSubmissionSchema.methods.rejectSubmission = function(comments: string) {
  this.submissionStatus = 'rejected';
  this.verificationStatus = 'rejected';
  this.reviewComments = comments;
  this.reviewDate = new Date();
  return this.save();
};

// Virtual for project area in hectares
NGOProjectSubmissionSchema.virtual('landAreaInHectares').get(function() {
  if (this.landAreaUnit === 'hectares') {
    return this.landArea;
  }
  return this.landArea * 0.404686; // Convert acres to hectares
});

// Ensure virtual fields are serialized
NGOProjectSubmissionSchema.set('toJSON', {
  virtuals: true
});

// Create and export the model
const NGOProjectSubmission = mongoose.models.NGOProjectSubmission || 
  mongoose.model<INGOProjectSubmission>('NGOProjectSubmission', NGOProjectSubmissionSchema);

export default NGOProjectSubmission;
