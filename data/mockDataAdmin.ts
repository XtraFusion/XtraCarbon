import { User, Organization, Project, CarbonCredit, Transaction, AuditLog, SystemStats, Alert, ChartData } from '@/types/admin';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.buyer@greentech.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'buyer',
    organizationName: 'GreenTech Solutions',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:22:00Z',
    phoneNumber: '+1-555-0123',
    country: 'United States'
  },
  {
    id: '2',
    email: 'sarah.forest@forestguard.org',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'ngo',
    organizationName: 'Forest Guardian NGO',
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    lastLogin: '2024-01-19T16:45:00Z',
    phoneNumber: '+1-555-0456',
    country: 'Canada'
  },
  {
    id: '3',
    email: 'pending.user@example.com',
    firstName: 'Mike',
    lastName: 'Pending',
    role: 'verifier',
    organizationName: 'Carbon Verify Inc',
    status: 'pending',
    createdAt: '2024-01-18T11:20:00Z',
    phoneNumber: '+44-20-7946-0958',
    country: 'United Kingdom'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Amazon Rainforest Conservation',
    description: 'Large-scale forest protection and restoration project in the Brazilian Amazon',
    type: 'reforestation',
    status: 'active',
    ngoId: '2',
    ngoName: 'Forest Guardian NGO',
    location: {
      country: 'Brazil',
      region: 'Amazonas',
      coordinates: { lat: -3.4653, lng: -62.2159 }
    },
    expectedCredits: 100000,
    issuedCredits: 75000,
    availableCredits: 45000,
    retiredCredits: 30000,
    pricePerCredit: 12.50,
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2028-05-31T23:59:59Z',
    certificationStandard: 'VCS',
    verifierId: '3',
    verifierName: 'Carbon Verify Inc',
    documents: [
      {
        id: 'doc-1',
        name: 'Project Design Document.pdf',
        type: 'pdf',
        url: '/documents/proj-1-pdd.pdf',
        uploadedAt: '2023-05-15T10:30:00Z',
        size: 2048576
      }
    ],
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'proj-2',
    name: 'Solar Farm Initiative Kenya',
    description: 'Community solar energy project providing clean electricity to rural communities',
    type: 'renewable_energy',
    status: 'under_review',
    ngoId: '4',
    ngoName: 'Solar For All',
    location: {
      country: 'Kenya',
      region: 'Nakuru County',
      coordinates: { lat: -0.3031, lng: 36.0800 }
    },
    expectedCredits: 50000,
    issuedCredits: 0,
    availableCredits: 0,
    retiredCredits: 0,
    pricePerCredit: 15.00,
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2029-02-28T23:59:59Z',
    certificationStandard: 'GOLD_STANDARD',
    documents: [
      {
        id: 'doc-2',
        name: 'Technical Specifications.pdf',
        type: 'pdf',
        url: '/documents/proj-2-tech.pdf',
        uploadedAt: '2024-01-10T09:15:00Z',
        size: 1536000
      }
    ],
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-18T11:45:00Z'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'purchase',
    buyerId: '1',
    buyerName: 'GreenTech Solutions',
    sellerId: 'proj-1',
    sellerName: 'Forest Guardian NGO',
    creditId: 'credit-1',
    projectName: 'Amazon Rainforest Conservation',
    quantity: 1000,
    pricePerCredit: 12.50,
    totalAmount: 12500,
    transactionDate: '2024-01-15T14:30:00Z',
    status: 'completed',
    notes: 'Bulk purchase for Q1 offset requirements'
  },
  {
    id: 'tx-2',
    type: 'retirement',
    buyerId: '1',
    buyerName: 'GreenTech Solutions',
    creditId: 'credit-1',
    projectName: 'Amazon Rainforest Conservation',
    quantity: 500,
    pricePerCredit: 12.50,
    totalAmount: 6250,
    transactionDate: '2024-01-18T10:15:00Z',
    status: 'completed',
    notes: 'Retirement for 2023 carbon footprint offset'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2024-01-20T14:22:35Z',
    userId: 'admin-1',
    userEmail: 'admin@nccr.gov',
    userRole: 'admin',
    action: 'PROJECT_APPROVED',
    entityType: 'project',
    entityId: 'proj-1',
    details: 'Project "Amazon Rainforest Conservation" approved and activated',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'log-2',
    timestamp: '2024-01-19T16:45:12Z',
    userId: '1',
    userEmail: 'john.buyer@greentech.com',
    userRole: 'buyer',
    action: 'CREDITS_PURCHASED',
    entityType: 'credit',
    entityId: 'credit-1',
    details: 'Purchased 1000 credits from Amazon Rainforest Conservation project',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  }
];

export const mockSystemStats: SystemStats = {
  totalUsers: 1247,
  activeUsers: 1156,
  pendingUsers: 91,
  totalProjects: 89,
  activeProjects: 67,
  pendingProjects: 15,
  totalCredits: 2456789,
  availableCredits: 1234567,
  retiredCredits: 987654,
  totalTransactions: 5643,
  monthlyTransactionValue: 2847356,
  systemUptime: 99.97
};

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'warning',
    title: 'Pending Project Reviews',
    message: '15 projects are awaiting review and approval',
    priority: 'high',
    isRead: false,
    createdAt: '2024-01-20T09:30:00Z',
    actionUrl: '/admin/projects?status=pending',
    actionLabel: 'Review Projects'
  },
  {
    id: 'alert-2',
    type: 'info',
    title: 'System Maintenance Scheduled',
    message: 'Routine maintenance scheduled for Sunday 2 AM UTC',
    priority: 'medium',
    isRead: false,
    createdAt: '2024-01-19T14:00:00Z',
    expiresAt: '2024-01-21T02:00:00Z'
  },
  {
    id: 'alert-3',
    type: 'error',
    title: 'Failed Verification Process',
    message: 'Project verification failed for Solar Farm Initiative Kenya',
    priority: 'critical',
    isRead: true,
    createdAt: '2024-01-18T11:45:00Z',
    actionUrl: '/admin/projects/proj-2',
    actionLabel: 'View Details'
  }
];

export const mockCreditsIssuedData: ChartData[] = [
  { name: 'Jan', value: 45000, date: '2024-01' },
  { name: 'Feb', value: 52000, date: '2024-02' },
  { name: 'Mar', value: 48000, date: '2024-03' },
  { name: 'Apr', value: 61000, date: '2024-04' },
  { name: 'May', value: 55000, date: '2024-05' },
  { name: 'Jun', value: 67000, date: '2024-06' }
];

export const mockCreditsRetiredData: ChartData[] = [
  { name: 'Jan', value: 32000, date: '2024-01' },
  { name: 'Feb', value: 28000, date: '2024-02' },
  { name: 'Mar', value: 35000, date: '2024-03' },
  { name: 'Apr', value: 42000, date: '2024-04' },
  { name: 'May', value: 38000, date: '2024-05' },
  { name: 'Jun', value: 45000, date: '2024-06' }
];

export const mockProjectTypeData: ChartData[] = [
  { name: 'Reforestation', value: 35, category: 'reforestation' },
  { name: 'Renewable Energy', value: 28, category: 'renewable_energy' },
  { name: 'Methane Capture', value: 15, category: 'methane_capture' },
  { name: 'Soil Carbon', value: 12, category: 'soil_carbon' },
  { name: 'Ocean Protection', value: 10, category: 'ocean_protection' }
];