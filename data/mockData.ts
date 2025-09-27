import { 
    User, 
    CarbonCredit, 
    Transaction, 
    Portfolio, 
    AdminStats, 
    AuditLog, 
    NewsUpdate,
    SystemAlert 
  } from '@/types/carbon-credit';
  
  export const mockUser: User = {
    id: '1',
    email: 'john.doe@company.com',
    firstName: 'John',
    lastName: 'Doe',
    organizationName: 'Green Corp Solutions',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-03-20T14:30:00Z'
  };
  
  export const mockAdminUser: User = {
    id: 'admin1',
    email: 'admin@nccr.org',
    firstName: 'Sarah',
    lastName: 'Admin',
    organizationName: 'NCCR',
    role: 'admin',
    status: 'active',
    createdAt: '2023-06-01T09:00:00Z',
    lastLogin: '2024-03-21T11:15:00Z'
  };
  
  export const mockCarbonCredits: CarbonCredit[] = [
    {
      id: 'cc1',
      projectName: 'Amazon Rainforest Conservation',
      projectType: 'forestry',
      region: 'South America',
      country: 'Brazil',
      certification: 'vcs',
      pricePerCredit: 25.50,
      availableCredits: 15000,
      totalCredits: 50000,
      vintage: 2023,
      description: 'Large-scale rainforest conservation project protecting 100,000 hectares',
      status: 'active',
      imageUrl: '/api/placeholder/400/200',
      verificationDate: '2024-01-15T00:00:00Z',
      expiryDate: '2030-12-31T23:59:59Z'
    },
    {
      id: 'cc2',
      projectName: 'Solar Farm Kenya',
      projectType: 'renewable-energy',
      region: 'Africa',
      country: 'Kenya',
      certification: 'gold-standard',
      pricePerCredit: 18.75,
      availableCredits: 8500,
      totalCredits: 25000,
      vintage: 2024,
      description: '50MW solar installation providing clean energy to rural communities',
      status: 'active',
      imageUrl: '/api/placeholder/400/200',
      verificationDate: '2024-02-20T00:00:00Z',
      expiryDate: '2031-02-20T23:59:59Z'
    },
    {
      id: 'cc3',
      projectName: 'Waste-to-Energy India',
      projectType: 'waste-management',
      region: 'Asia',
      country: 'India',
      certification: 'cdm',
      pricePerCredit: 22.00,
      availableCredits: 12000,
      totalCredits: 30000,
      vintage: 2023,
      description: 'Converting municipal waste to clean energy in Delhi',
      status: 'active',
      imageUrl: '/api/placeholder/400/200',
      verificationDate: '2024-01-10T00:00:00Z',
      expiryDate: '2030-01-10T23:59:59Z'
    }
  ];
  
  export const mockTransactions: Transaction[] = [
    {
      id: 't1',
      userId: '1',
      projectId: 'cc1',
      projectName: 'Amazon Rainforest Conservation',
      type: 'purchase',
      creditAmount: 500,
      pricePerCredit: 25.50,
      totalAmount: 12750.00,
      date: '2024-03-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: 't2',
      userId: '1',
      projectId: 'cc2',
      projectName: 'Solar Farm Kenya',
      type: 'purchase',
      creditAmount: 250,
      pricePerCredit: 18.75,
      totalAmount: 4687.50,
      date: '2024-03-10T14:15:00Z',
      status: 'completed'
    },
    {
      id: 't3',
      userId: '1',
      projectId: 'cc1',
      projectName: 'Amazon Rainforest Conservation',
      type: 'retirement',
      creditAmount: 100,
      pricePerCredit: 25.50,
      totalAmount: 2550.00,
      date: '2024-03-20T09:45:00Z',
      status: 'completed',
      certificateUrl: '/certificates/retirement-t3.pdf'
    }
  ];
  
  export const mockPortfolio: Portfolio = {
    userId: '1',
    totalOwned: 650,
    totalRetired: 100,
    totalValue: 16850.00,
    credits: [
      {
        id: 'pc1',
        projectId: 'cc1',
        projectName: 'Amazon Rainforest Conservation',
        amount: 400,
        purchasePrice: 25.50,
        currentPrice: 26.00,
        purchaseDate: '2024-03-15T10:30:00Z',
        status: 'owned'
      },
      {
        id: 'pc2',
        projectId: 'cc2',
        projectName: 'Solar Farm Kenya',
        amount: 250,
        purchasePrice: 18.75,
        currentPrice: 19.25,
        purchaseDate: '2024-03-10T14:15:00Z',
        status: 'owned'
      },
      {
        id: 'pc3',
        projectId: 'cc1',
        projectName: 'Amazon Rainforest Conservation',
        amount: 100,
        purchasePrice: 25.50,
        currentPrice: 26.00,
        purchaseDate: '2024-03-15T10:30:00Z',
        status: 'retired',
        retirementDate: '2024-03-20T09:45:00Z',
        certificateUrl: '/certificates/retirement-pc3.pdf'
      }
    ]
  };
  
  export const mockAdminStats: AdminStats = {
    totalUsers: 1247,
    activeProjects: 28,
    totalCreditsIssued: 1850000,
    totalCreditsRetired: 425000,
    pendingApprovals: 12,
    systemAlerts: [
      {
        id: 'alert1',
        type: 'warning',
        message: 'Project verification expires in 30 days for Amazon Conservation',
        timestamp: '2024-03-21T08:00:00Z',
        resolved: false
      },
      {
        id: 'alert2',
        type: 'info',
        message: 'New user registration pending approval',
        timestamp: '2024-03-21T10:15:00Z',
        resolved: false
      }
    ]
  };
  
  export const mockAuditLogs: AuditLog[] = [
    {
      id: 'log1',
      userId: '1',
      userEmail: 'john.doe@company.com',
      action: 'purchase_credits',
      entityType: 'transaction',
      entityId: 't1',
      timestamp: '2024-03-15T10:30:00Z',
      details: { creditAmount: 500, projectId: 'cc1' },
      ipAddress: '192.168.1.100'
    },
    {
      id: 'log2',
      userId: 'admin1',
      userEmail: 'admin@nccr.org',
      action: 'approve_project',
      entityType: 'project',
      entityId: 'cc3',
      timestamp: '2024-03-14T16:45:00Z',
      details: { projectName: 'Waste-to-Energy India', status: 'approved' },
      ipAddress: '10.0.0.5'
    }
  ];
  
  export const mockNewsUpdates: NewsUpdate[] = [
    {
      id: 'news1',
      title: 'New Carbon Credit Standards Released',
      summary: 'Updated verification requirements for renewable energy projects',
      content: 'The NCCR has released new standards for carbon credit verification...',
      imageUrl: '/api/placeholder/300/150',
      publishDate: '2024-03-18T12:00:00Z',
      author: 'NCCR Standards Committee'
    },
    {
      id: 'news2',
      title: 'Q1 2024 Market Report',
      summary: 'Carbon credit market shows 15% growth in Q1 2024',
      content: 'The carbon credit market has demonstrated strong growth...',
      imageUrl: '/api/placeholder/300/150',
      publishDate: '2024-03-15T09:00:00Z',
      author: 'Market Research Team'
    },
    {
      id: 'news3',
      title: 'Platform Maintenance Scheduled',
      summary: 'Planned system maintenance on March 25th, 2-4 AM EST',
      content: 'We will be performing routine system maintenance...',
      publishDate: '2024-03-20T14:00:00Z',
      author: 'Technical Team'
    }
  ];
  
  export const mockUsers: User[] = [
    mockUser,
    {
      id: '2',
      email: 'jane.smith@ecocorp.com',
      firstName: 'Jane',
      lastName: 'Smith',
      organizationName: 'EcoCorp Industries',
      role: 'buyer',
      status: 'active',
      createdAt: '2024-02-01T10:00:00Z',
      lastLogin: '2024-03-19T16:20:00Z'
    },
    {
      id: '3',
      email: 'mike.green@ngo.org',
      firstName: 'Mike',
      lastName: 'Green',
      organizationName: 'Green Future NGO',
      role: 'ngo',
      status: 'pending',
      createdAt: '2024-03-18T14:30:00Z'
    }
  ];