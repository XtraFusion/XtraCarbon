import connectDB from '../db/mongodb';
import User from '../models/User';
import NGOProjectSubmission from '../models/NGOProjectSubmission';
import VerifierSubmission from '../models/VerifierSubmission';
import { 
  NGOFormSubmissionData, 
  VerifierFormSubmissionData,
  ProjectSearchFilters,
  VerifierSearchFilters,
  PaginationParams,
  PaginatedResponse
} from '../types';
import { Credit } from '../models/Credit';

// Database connection helper
export async function ensureDBConnection() {
  try {
    // console.log(process.env.MONGODB_URIW)
    await connectDB();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// User operations
export class UserService {
  static async createUser(userData: any) {
    await ensureDBConnection();
    return await User.create(userData);
  }

  static async findByClerkId(clerkId: string) {
    await ensureDBConnection();
    return await User?.findByClerkId(clerkId);
  }

  static async findByEmail(email: string) {
    await ensureDBConnection();
    return await User?.findByEmail(email);
  }

  static async updateUser(clerkId: string, updateData: any) {
    await ensureDBConnection();
    return await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
  }

  static async getUsersByRole(role: string) {
    await ensureDBConnection();
    return await User.findByRole(role);
  }
}

// NGO Project Submission operations
export class NGOProjectService {
  static async createSubmission(data: any, submittedBy: string) {
    const {data:formData} =data;
    console.log("Creating submission with data:", formData, "by user:", submittedBy);
    await ensureDBConnection();
    
    // Transform form data to match schema
    const submissionData = {
      projectName: formData.projectName,
      organizationName: formData.organizationName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      projectType: formData.projectType,
      location: {
        latitude: parseFloat(formData.gpsLatitude),
        longitude: parseFloat(formData.gpsLongitude),
        address: formData.projectLocation,
        country: 'Unknown', // You might want to add country field to form
        region: '',
        city: ''
      },
      landArea: parseFloat(formData.landArea),
      landAreaUnit: formData.landAreaUnit,
      monitoringData: {
        startDate: new Date(formData.monitoringStartDate),
        endDate: new Date(formData.monitoringEndDate),
        collectionMethod: formData.dataCollectionMethod,
        dataSources: formData.dataSources,
        frequency: formData.collectionFrequency
      },
      submittedBy,
      fieldSurveyReports: formData.fieldSurveyReports,
      submissionStatus: 'submitted' as const,
      additionalEvidence:formData.additionalEvidence,
      verificationStatus:"pending",
      imagesList:formData.imagesList,
      proposedCredit:formData.proposedCredit
    };

    // Add project-specific data based on type
    if (formData.projectType === 'blue') {
      submissionData.blueCarbonData = {
        sedimentCoreDetails: formData.sedimentCoreDetails,
        biomassData: formData.biomassData,
        waterQualityParams: formData.waterQualityParams,
        geotaggedPhotos:formData.geotaggedPhotos,
        droneImages:formData.droneImages,
        satelliteImages:formData.satelliteImages
      };
    } else if (formData.projectType === 'green') {
      submissionData.greenCarbonData = {
        biomassData: formData.biomassData,
        soilSampleDetails: formData.soilSampleDetails,
        speciesPlanted: formData.speciesPlanted,
        geotaggedPhotos:formData.geotaggedPhotos,
        droneImages:formData.droneImages,
        satelliteImages:formData.satelliteImages
      };
    } else if (formData.projectType === 'yellow') {
      submissionData.yellowCarbonData = {
        soilSampleDetails: formData.soilSampleDetails,
        speciesPlanted: formData.speciesPlanted,
        activityDescription: formData.activityDescription,
        geotaggedPhotos:formData.geotaggedPhotos,
        droneImages:formData.droneImages,
        satelliteImages:formData.satelliteImages
      };
    }
  
    return await NGOProjectSubmission.create(submissionData);
  }

  static async getSubmissionsByUser(submittedBy: string, pagination?: PaginationParams) {
    await ensureDBConnection();
    
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      NGOProjectSubmission.find({ submittedBy })
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NGOProjectSubmission.countDocuments({ submittedBy })
    ]);

    return {
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async getSubmissionsByStatus(status: string, pagination?: PaginationParams) {
    await ensureDBConnection();
    
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      NGOProjectSubmission.find({ submissionStatus: status })
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NGOProjectSubmission.countDocuments({ submissionStatus: status })
    ]);

    return {
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async searchSubmissions(filters: ProjectSearchFilters, pagination?: PaginationParams) {
    await ensureDBConnection();
    
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (filters.projectType) {
      query.projectType = filters.projectType;
    }
    
    if (filters.status) {
      query.submissionStatus = filters.status;
    }
    
    if (filters.country) {
      query['location.country'] = filters.country;
    }
    
    if (filters.dateRange) {
      query.submissionDate = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }
    
    if (filters.minArea || filters.maxArea) {
      query.landArea = {};
      if (filters.minArea) query.landArea.$gte = filters.minArea;
      if (filters.maxArea) query.landArea.$lte = filters.maxArea;
    }

    const [submissions, total] = await Promise.all([
      NGOProjectSubmission.find(query)
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NGOProjectSubmission.countDocuments(query)
    ]);

    return {
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async getSubmissionById(id: string) {
    await ensureDBConnection();
    return await NGOProjectSubmission.findById(id);
  }

  static async updateSubmissionStatus(id: string, status: string, reviewerId?: string, comments?: string) {
    await ensureDBConnection();
    
    const updateData: any = { submissionStatus: status };
    if (reviewerId) updateData.reviewerId = reviewerId;
    if (comments) updateData.reviewComments = comments;
    if (status === 'rejected' || status === 'approved') {
      updateData.reviewDate = new Date();
    }

    return await NGOProjectSubmission.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async applyVerifierAction(params: {
    projectId: string;
    verifierId: string;
    action: 'confirm' | 'reject' | 'send_back' | 'start';
    issuedCredit?: number;
    message?: string;
  }) {
    await ensureDBConnection();
    const { projectId, verifierId, action, issuedCredit, message } = params;

    const project = await NGOProjectSubmission.findById(projectId);
    if (!project) return null;

    const update: any = {};

    update.verifierId = verifierId;

    if (action === 'start') {
      update.verificationStatus = 'in_progress';
    }

    if (action === 'reject') {
      update.submissionStatus = 'rejected';
      update.verificationStatus = 'rejected';
      update.reviewComments = message || 'Rejected by verifier';
      update.reviewDate = new Date();
    }

    if (action === 'send_back') {
      update.submissionStatus = 'requires_revision';
      update.verificationStatus = 'pending';
      update.reviewComments = message || 'Changes requested by verifier';
      update.reviewDate = new Date();
    }

    if (action === 'confirm') {
      if (typeof issuedCredit !== 'number' || issuedCredit < 0) {
        throw new Error('issuedCredit must be a non-negative number');
      }
      update.verificationStatus = 'verified';
      update.submissionStatus = 'approved';
      update.verifiedCarbonCredits = issuedCredit;
      update.issuedCredit = issuedCredit;
      update.verificationDate = new Date();
      if (message) update.reviewComments = message;
    }

    const updated = await NGOProjectSubmission.findByIdAndUpdate(
      projectId,
      update,
      { new: true }
    );

    return updated;
  }
}

// Verifier Submission operations
export class VerifierService {
  static async createVerification(formData: VerifierFormSubmissionData, verifierId: string, projectSubmissionId: string) {
    await ensureDBConnection();
    
    const verificationData = {
      projectSubmissionId,
      projectName: formData.projectName,
      organizationName: formData.organizationName,
      projectLocation: formData.projectLocation,
      projectType: formData.projectType as 'blue' | 'green' | 'yellow',
      landArea: parseFloat(formData.landArea),
      landAreaUnit: 'hectares' as const, // You might want to add this to form
      verifierId,
      verifierName: formData.verifierName,
      verifierOrganization: formData.verifierOrganization,
      verificationDate: new Date(formData.verificationDate),
      verificationStatus: formData.verificationStatus.toLowerCase().replace('-', '_') as 'pending' | 'in_progress' | 'approved' | 'rejected',
      reviewComments: formData.reviewComments,
      verificationMethodology: formData.verificationMethodology,
      verificationChecklist: {
        meetsStandards: formData.meetsStandards,
        mrvDataComplete: formData.mrvDataComplete,
        evidenceSufficient: formData.evidenceSufficient,
        locationVerified: formData.locationVerified,
        calculationsVerified: formData.calculationsVerified
      }
    };

    // Add approval data if approved
    if (formData.verificationStatus === 'Approved') {
      verificationData.carbonCreditsToMint = parseFloat(formData.carbonCreditsToMint || '0');
      verificationData.creditVintage = parseInt(formData.creditVintage || '2024');
      verificationData.blockchainTxId = formData.blockchainTxId;
    }

    return await VerifierSubmission.create(verificationData);
  }

  static async getVerificationsByVerifier(verifierId: string, pagination?: PaginationParams) {
    await ensureDBConnection();
    
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [verifications, total] = await Promise.all([
      VerifierSubmission.find({ verifierId })
        .sort({ verificationDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VerifierSubmission.countDocuments({ verifierId })
    ]);

    return {
      data: verifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async getPendingVerifications(pagination?: PaginationParams) {
    await ensureDBConnection();
    
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [verifications, total] = await Promise.all([
      VerifierSubmission.findPendingVerifications()
        .skip(skip)
        .limit(limit)
        .lean(),
      VerifierSubmission.countDocuments({ verificationStatus: 'pending' })
    ]);

    return {
      data: verifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async searchVerifications(filters: VerifierSearchFilters, pagination?: PaginationParams) {
    await ensureDBConnection();
    
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (filters.status) {
      query.verificationStatus = filters.status;
    }
    
    if (filters.verifierId) {
      query.verifierId = filters.verifierId;
    }
    
    if (filters.projectType) {
      query.projectType = filters.projectType;
    }
    
    if (filters.dateRange) {
      query.verificationDate = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    const [verifications, total] = await Promise.all([
      VerifierSubmission.find(query)
        .sort({ verificationDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VerifierSubmission.countDocuments(query)
    ]);

    return {
      data: verifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async getVerificationById(id: string) {
    await ensureDBConnection();
    return await VerifierSubmission.findById(id);
  }

  static async getVerificationByProject(projectSubmissionId: string) {
    await ensureDBConnection();
    return await VerifierSubmission.findByProject(projectSubmissionId);
  }

  static async updateVerificationStatus(id: string, status: string, carbonCredits?: number, vintage?: number, txId?: string) {
    await ensureDBConnection();
    
    const updateData: any = { verificationStatus: status };
    
    if (status === 'approved' && carbonCredits && vintage) {
      updateData.carbonCreditsToMint = carbonCredits;
      updateData.creditVintage = vintage;
      updateData.blockchainTxId = txId;
      updateData.completedAt = new Date();
    } else if (status === 'rejected') {
      updateData.completedAt = new Date();
    }

    return await VerifierSubmission.findByIdAndUpdate(id, updateData, { new: true });
  }
}

// Dashboard and analytics operations
export class AnalyticsService {
  static async getDashboardStats() {
    await ensureDBConnection();
    
    const [
      totalProjects,
      pendingVerifications,
      approvedProjects,
      totalCarbonCredits,
      projectsByType,
      recentActivity
    ] = await Promise.all([
      NGOProjectSubmission.countDocuments(),
      NGOProjectSubmission.countDocuments({ submissionStatus: 'submitted' }),
      NGOProjectSubmission.countDocuments({ submissionStatus: 'approved' }),
      VerifierSubmission.aggregate([
        { $match: { verificationStatus: 'approved' } },
        { $group: { _id: null, total: { $sum: '$carbonCreditsToMint' } } }
      ]).then(result => result[0]?.total || 0),
      NGOProjectSubmission.aggregate([
        { $group: { _id: '$projectType', count: { $sum: 1 } } }
      ]),
      NGOProjectSubmission.find()
        .sort({ submissionDate: -1 })
        .limit(5)
        .select('projectName submissionDate submissionStatus')
        .lean()
    ]);

    const typeStats = {
      blue: projectsByType.find(p => p._id === 'blue')?.count || 0,
      green: projectsByType.find(p => p._id === 'green')?.count || 0,
      yellow: projectsByType.find(p => p._id === 'yellow')?.count || 0
    };

    return {
      totalProjects,
      pendingVerifications,
      approvedProjects,
      totalCarbonCredits,
      projectsByType: typeStats,
      recentActivity: recentActivity.map(activity => ({
        id: activity._id.toString(),
        type: 'project_submitted',
        title: `Project "${activity.projectName}" submitted`,
        description: `Status: ${activity.submissionStatus}`,
        timestamp: activity.submissionDate,
        projectId: activity._id.toString()
      }))
    };
  }

  static async getVerificationStats(verifierId?: string) {
    await ensureDBConnection();
    return await VerifierSubmission.getVerificationStats(verifierId);
  }
}
