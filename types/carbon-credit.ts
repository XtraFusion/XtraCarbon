// Carbon Credit Platform Types and Interfaces

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastLogin?: string;
  }
  
  export type UserRole = 'buyer' | 'admin' | 'ngo' | 'verifier';
  export type UserStatus = 'active' | 'pending' | 'suspended';
  
  export interface CarbonCredit {
    id: string;
    projectName: string;
    projectType: ProjectType;
    region: string;
    country: string;
    certification: CertificationType;
    pricePerCredit: number;
    availableCredits: number;
    totalCredits: number;
    vintage: number;
    description: string;
    status: ProjectStatus;
    imageUrl?: string;
    verificationDate: string;
    expiryDate: string;
  }
  
  export type ProjectType = 
    | 'forestry' 
    | 'renewable-energy' 
    | 'waste-management' 
    | 'agriculture' 
    | 'industrial-processes';
  
  export type CertificationType = 
    | 'vcs' 
    | 'cdm' 
    | 'gold-standard' 
    | 'california-cap-trade' 
    | 'regional-greenhouse-gas-initiative';
  
  export type ProjectStatus = 'active' | 'pending' | 'suspended' | 'completed';
  
  export interface Transaction {
    id: string;
    userId: string;
    projectId: string;
    projectName: string;
    type: TransactionType;
    creditAmount: number;
    pricePerCredit: number;
    totalAmount: number;
    date: string;
    status: TransactionStatus;
    certificateUrl?: string;
  }
  
  export type TransactionType = 'purchase' | 'retirement' | 'transfer';
  export type TransactionStatus = 'completed' | 'pending' | 'failed';
  
  export interface Portfolio {
    userId: string;
    totalOwned: number;
    totalRetired: number;
    totalValue: number;
    credits: PortfolioCredit[];
  }
  
  export interface PortfolioCredit {
    id: string;
    projectId: string;
    projectName: string;
    amount: number;
    purchasePrice: number;
    currentPrice: number;
    purchaseDate: string;
    status: 'owned' | 'retired';
    retirementDate?: string;
    certificateUrl?: string;
  }
  
  export interface AdminStats {
    totalUsers: number;
    activeProjects: number;
    totalCreditsIssued: number;
    totalCreditsRetired: number;
    pendingApprovals: number;
    systemAlerts: SystemAlert[];
  }
  
  export interface SystemAlert {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    resolved: boolean;
  }
  
  export interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    details: Record<string, any>;
    ipAddress: string;
  }
  
  export interface NewsUpdate {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl?: string;
    publishDate: string;
    author: string;
  }