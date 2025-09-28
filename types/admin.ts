export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'buyer' | 'ngo' | 'verifier' | 'admin';
    organizationName?: string;
    status: 'active' | 'pending' | 'suspended';
    createdAt: string;
    lastLogin?: string;
    phoneNumber?: string;
    country?: string;
  }
  
  export interface Organization {
    id: string;
    name: string;
    type: 'buyer' | 'ngo' | 'verifier';
    status: 'active' | 'pending' | 'suspended';
    contactEmail: string;
    country: string;
    registrationDate: string;
    description?: string;
    website?: string;
    verificationDocuments?: string[];
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string;
    type: 'reforestation' | 'renewable_energy' | 'methane_capture' | 'soil_carbon' | 'ocean_protection';
    status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'active' | 'completed';
    ngoId: string;
    ngoName: string;
    location: {
      country: string;
      region: string;
      coordinates?: { lat: number; lng: number };
    };
    expectedCredits: number;
    issuedCredits: number;
    availableCredits: number;
    retiredCredits: number;
    pricePerCredit: number;
    startDate: string;
    endDate: string;
    certificationStandard: 'VCS' | 'CDM' | 'GOLD_STANDARD' | 'NCCR';
    verifierId?: string;
    verifierName?: string;
    documents: ProjectDocument[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProjectDocument {
    id: string;
    name: string;
    type: 'pdf' | 'image' | 'spreadsheet';
    url: string;
    uploadedAt: string;
    size: number;
  }
  
  export interface CarbonCredit {
    id: string;
    projectId: string;
    projectName: string;
    serialNumber: string;
    status: 'issued' | 'available' | 'sold' | 'retired';
    currentOwnerId?: string;
    currentOwnerName?: string;
    issuanceDate: string;
    retirementDate?: string;
    retirementReason?: string;
    vintage: number; // Year the emission reduction occurred
    pricePerCredit: number;
    certificationStandard: 'VCS' | 'CDM' | 'GOLD_STANDARD' | 'NCCR';
  }
  
  export interface Transaction {
    id: string;
    type: 'purchase' | 'retirement' | 'transfer' | 'issuance';
    buyerId?: string;
    buyerName?: string;
    sellerId?: string;
    sellerName?: string;
    creditId: string;
    projectName: string;
    quantity: number;
    pricePerCredit: number;
    totalAmount: number;
    transactionDate: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    notes?: string;
  }
  
  export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userEmail: string;
    userRole: string;
    action: string;
    entityType: 'user' | 'project' | 'credit' | 'transaction' | 'organization';
    entityId: string;
    details: string;
    ipAddress: string;
    userAgent: string;
  }
  
  export interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalProjects: number;
    activeProjects: number;
    pendingProjects: number;
    totalCredits: number;
    availableCredits: number;
    retiredCredits: number;
    totalTransactions: number;
    monthlyTransactionValue: number;
    systemUptime: number;
  }
  
  export interface ChartData {
    name: string;
    value: number;
    date?: string;
    category?: string;
  }
  
  export interface ReportData {
    id: string;
    name: string;
    type: 'credits_issued' | 'credits_retired' | 'market_activity' | 'user_growth' | 'project_status';
    generatedAt: string;
    generatedBy: string;
    filePath: string;
    fileSize: number;
    parameters: Record<string, any>;
  }
  
  export interface Permission {
    id: string;
    name: string;
    description: string;
    category: 'user_management' | 'project_management' | 'credit_management' | 'reporting' | 'system_admin';
  }
  
  export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Alert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    isRead: boolean;
    createdAt: string;
    expiresAt?: string;
    actionUrl?: string;
    actionLabel?: string;
  }