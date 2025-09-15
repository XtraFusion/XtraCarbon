import mongoose, { Document, Schema } from 'mongoose';

// Verification checklist interface
export interface IVerificationChecklist {
  meetsStandards: boolean;
  mrvDataComplete: boolean;
  evidenceSufficient: boolean;
  locationVerified: boolean;
  calculationsVerified: boolean;
}

// File upload interface
export interface IFileUpload {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

// Verifier Submission interface
export interface IVerifierSubmission extends Document {
  // Project reference
  projectSubmissionId: string; // Reference to NGOProjectSubmission
  projectName: string;
  organizationName: string;
  projectLocation: string;
  projectType: 'blue' | 'green' | 'yellow';
  landArea: number;
  landAreaUnit: 'hectares' | 'acres';
  
  // Verifier information
  verifierId: string; // Clerk user ID
  verifierName: string;
  verifierOrganization: string;
  verificationDate: Date;
  
  // Verification details
  verificationStatus: 'pending' | 'in_progress' | 'approved' | 'rejected';
  reviewComments: string;
  verificationMethodology: string;
  verificationReport?: IFileUpload;
  
  // Verification checklist
  verificationChecklist: IVerificationChecklist;
  
  // Approval decision
  carbonCreditsToMint?: number;
  blockchainTxId?: string;
  creditVintage?: number;
  
  // Additional verification data
  verificationNotes?: string;
  standardsCompliance?: string[];
  riskAssessment?: string;
  recommendations?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Verification checklist schema
const VerificationChecklistSchema = new Schema<IVerificationChecklist>({
  meetsStandards: { type: Boolean, required: true },
  mrvDataComplete: { type: Boolean, required: true },
  evidenceSufficient: { type: Boolean, required: true },
  locationVerified: { type: Boolean, required: true },
  calculationsVerified: { type: Boolean, required: true }
}, { _id: false });

// File upload schema
const FileUploadSchema = new Schema<IFileUpload>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

// Main Verifier Submission schema
const VerifierSubmissionSchema = new Schema<IVerifierSubmission>({
  // Project reference
  projectSubmissionId: {
    type: String,
    required: true,
    index: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  projectLocation: {
    type: String,
    required: true,
    trim: true
  },
  projectType: {
    type: String,
    required: true,
    enum: ['blue', 'green', 'yellow']
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
  
  // Verifier information
  verifierId: {
    type: String,
    required: true,
    index: true
  },
  verifierName: {
    type: String,
    required: true,
    trim: true
  },
  verifierOrganization: {
    type: String,
    required: true,
    trim: true
  },
  verificationDate: {
    type: Date,
    required: true,
    index: true
  },
  
  // Verification details
  verificationStatus: {
    type: String,
    required: true,
    enum: ['pending', 'in_progress', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  reviewComments: {
    type: String,
    required: true,
    maxlength: 2000
  },
  verificationMethodology: {
    type: String,
    required: true,
    maxlength: 1000
  },
  verificationReport: FileUploadSchema,
  
  // Verification checklist
  verificationChecklist: {
    type: VerificationChecklistSchema,
    required: true
  },
  
  // Approval decision
  carbonCreditsToMint: {
    type: Number,
    min: 0
  },
  blockchainTxId: {
    type: String,
    trim: true
  },
  creditVintage: {
    type: Number,
    min: 2020,
    max: 2030
  },
  
  // Additional verification data
  verificationNotes: {
    type: String,
    maxlength: 1000
  },
  standardsCompliance: [{
    type: String,
    trim: true
  }],
  riskAssessment: {
    type: String,
    maxlength: 1000
  },
  recommendations: {
    type: String,
    maxlength: 1000
  },
  
  // Completion timestamp
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'verifier_submissions'
});

// Indexes for better query performance
VerifierSubmissionSchema.index({ projectSubmissionId: 1 });
VerifierSubmissionSchema.index({ verifierId: 1, verificationStatus: 1 });
VerifierSubmissionSchema.index({ verificationStatus: 1, verificationDate: -1 });
VerifierSubmissionSchema.index({ projectType: 1, verificationStatus: 1 });
VerifierSubmissionSchema.index({ verificationDate: -1 });

// Compound indexes
VerifierSubmissionSchema.index({ 
  verificationStatus: 1, 
  verificationDate: -1 
});

VerifierSubmissionSchema.index({ 
  verifierId: 1, 
  verificationStatus: 1, 
  verificationDate: -1 
});

// Pre-save middleware
VerifierSubmissionSchema.pre('save', function(next) {
  // Set completion date when status changes to approved or rejected
  if (this.isModified('verificationStatus') && 
      (this.verificationStatus === 'approved' || this.verificationStatus === 'rejected')) {
    this.completedAt = new Date();
  }
  
  // Validate that carbon credits are provided for approved projects
  if (this.verificationStatus === 'approved' && !this.carbonCreditsToMint) {
    return next(new Error('Carbon credits amount is required for approved projects'));
  }
  
  // Validate that credit vintage is provided for approved projects
  if (this.verificationStatus === 'approved' && !this.creditVintage) {
    return next(new Error('Credit vintage is required for approved projects'));
  }
  
  next();
});

// Static methods
VerifierSubmissionSchema.statics.findByVerifier = function(verifierId: string) {
  return this.find({ verifierId }).sort({ verificationDate: -1 });
};

VerifierSubmissionSchema.statics.findByStatus = function(status: string) {
  return this.find({ verificationStatus: status }).sort({ verificationDate: -1 });
};

VerifierSubmissionSchema.statics.findByProject = function(projectSubmissionId: string) {
  return this.findOne({ projectSubmissionId });
};

VerifierSubmissionSchema.statics.findPendingVerifications = function() {
  return this.find({ verificationStatus: 'pending' }).sort({ verificationDate: 1 });
};

VerifierSubmissionSchema.statics.findInProgressVerifications = function() {
  return this.find({ verificationStatus: 'in_progress' }).sort({ verificationDate: 1 });
};

VerifierSubmissionSchema.statics.findCompletedVerifications = function() {
  return this.find({ 
    verificationStatus: { $in: ['approved', 'rejected'] }
  }).sort({ completedAt: -1 });
};

VerifierSubmissionSchema.statics.getVerificationStats = function(verifierId?: string) {
  const matchStage = verifierId ? { verifierId } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$verificationStatus',
        count: { $sum: 1 },
        totalCredits: { $sum: '$carbonCreditsToMint' }
      }
    }
  ]);
};

// Instance methods
VerifierSubmissionSchema.methods.startVerification = function() {
  this.verificationStatus = 'in_progress';
  return this.save();
};

VerifierSubmissionSchema.methods.approveProject = function(carbonCredits: number, vintage: number, txId?: string) {
  this.verificationStatus = 'approved';
  this.carbonCreditsToMint = carbonCredits;
  this.creditVintage = vintage;
  this.blockchainTxId = txId;
  this.completedAt = new Date();
  return this.save();
};

VerifierSubmissionSchema.methods.rejectProject = function(comments: string) {
  this.verificationStatus = 'rejected';
  this.reviewComments = comments;
  this.completedAt = new Date();
  return this.save();
};

VerifierSubmissionSchema.methods.updateChecklist = function(checklist: IVerificationChecklist) {
  this.verificationChecklist = checklist;
  return this.save();
};

// Virtual for project area in hectares
VerifierSubmissionSchema.virtual('landAreaInHectares').get(function() {
  if (this.landAreaUnit === 'hectares') {
    return this.landArea;
  }
  return this.landArea * 0.404686; // Convert acres to hectares
});

// Virtual for verification duration
VerifierSubmissionSchema.virtual('verificationDuration').get(function() {
  if (this.completedAt && this.createdAt) {
    return Math.ceil((this.completedAt.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)); // days
  }
  return null;
});

// Virtual for checklist completion percentage
VerifierSubmissionSchema.virtual('checklistCompletion').get(function() {
  const checklist = this.verificationChecklist;
  const total = Object.keys(checklist).length;
  const completed = Object.values(checklist).filter(Boolean).length;
  return Math.round((completed / total) * 100);
});

// Ensure virtual fields are serialized
VerifierSubmissionSchema.set('toJSON', {
  virtuals: true
});

// Create and export the model
const VerifierSubmission = mongoose.models.VerifierSubmission || 
  mongoose.model<IVerifierSubmission>('VerifierSubmission', VerifierSubmissionSchema);

export default VerifierSubmission;
