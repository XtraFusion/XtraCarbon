"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Users,
  Globe,
  Leaf,
  DollarSign
} from 'lucide-react';
import { mockCreditsIssuedData, mockCreditsRetiredData, mockProjectTypeData, mockSystemStats } from '@/data/mockDataAdmin';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

// Additional mock data for analytics
const monthlyTransactionData = [
  { name: 'Jan', transactions: 234, volume: 2400000, credits: 45000 },
  { name: 'Feb', transactions: 287, volume: 2800000, credits: 52000 },
  { name: 'Mar', transactions: 256, volume: 2600000, credits: 48000 },
  { name: 'Apr', transactions: 342, volume: 3200000, credits: 61000 },
  { name: 'May', transactions: 298, volume: 2900000, credits: 55000 },
  { name: 'Jun', transactions: 389, volume: 3800000, credits: 67000 }
];

const regionData = [
  { name: 'North America', value: 35, projects: 28 },
  { name: 'South America', value: 28, projects: 22 },
  { name: 'Europe', value: 15, projects: 12 },
  { name: 'Africa', value: 12, projects: 15 },
  { name: 'Asia', value: 10, projects: 12 }
];

const marketTrendsData = [
  { name: 'Week 1', price: 12.50, demand: 85, supply: 92 },
  { name: 'Week 2', price: 13.20, demand: 91, supply: 88 },
  { name: 'Week 3', price: 12.80, demand: 78, supply: 95 },
  { name: 'Week 4', price: 14.10, demand: 96, supply: 82 },
  { name: 'Week 5', price: 13.75, demand: 89, supply: 87 },
  { name: 'Week 6', price: 15.20, demand: 102, supply: 79 }
];

export default function Analytics() {
  const stats = mockSystemStats;

  // TODO: Implement API calls for analytics data
  const handleExportReport = (reportType: string) => {
    console.log('API Call: Export analytics report', reportType);
    // Implementation needed: GET /api/admin/analytics/export/${reportType}
  };

  const handleGenerateReport = (reportType: string, dateRange: string) => {
    console.log('API Call: Generate custom report', { reportType, dateRange });
    // Implementation needed: POST /api/admin/reports/generate
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reporting</h1>
            <p className="text-muted-foreground">
              System performance metrics and market insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExportReport('comprehensive')}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats.monthlyTransactionValue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-success">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Traded</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.retiredCredits / 1000).toFixed(0)}K</div>
              <p className="text-xs text-success">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-success">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Credit Price</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$13.75</div>
              <p className="text-xs text-success">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +5.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="market">Market Trends</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction Volume */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Volume & Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTransactionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="transactions"
                          stackId="1"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                          name="Transactions"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="volume"
                          stroke="hsl(var(--success))"
                          strokeWidth={2}
                          name="Volume ($)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Flow */}
              <Card>
                <CardHeader>
                  <CardTitle>Credit Issuance vs Retirement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockCreditsIssuedData.map((issued, index) => ({
                        name: issued.name,
                        issued: issued.value,
                        retired: mockCreditsRetiredData[index]?.value || 0
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="issued" 
                          stroke="hsl(var(--success))" 
                          strokeWidth={2}
                          name="Credits Issued"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="retired" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Credits Retired"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Trends Tab */}
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Credit Price Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ r: 6 }}
                          name="Average Price ($)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Supply & Demand */}
              <Card>
                <CardHeader>
                  <CardTitle>Supply vs Demand Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marketTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="demand" fill="hsl(var(--success))" name="Demand Index" />
                        <Bar dataKey="supply" fill="hsl(var(--warning))" name="Supply Index" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Market Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-success text-success-foreground">Bullish</Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">+15%</div>
                      <div className="text-xs text-muted-foreground">vs last month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Trading Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">234K</div>
                  <div className="text-xs text-muted-foreground">Credits traded this month</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Market Cap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$33.7M</div>
                  <div className="text-xs text-muted-foreground">Total market value</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockProjectTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {mockProjectTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Project Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Average Project Size</p>
                      <p className="text-2xl font-bold">75K Credits</p>
                    </div>
                    <Leaf className="h-8 w-8 text-success" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Completion Rate</p>
                      <p className="text-2xl font-bold text-success">89%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Avg. Time to Approval</p>
                      <p className="text-2xl font-bold">14 days</p>
                    </div>
                    <Calendar className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geography Tab */}
          <TabsContent value="geography" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Credits by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries by Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { country: 'Brazil', projects: 28, flag: '🇧🇷' },
                    { country: 'United States', projects: 22, flag: '🇺🇸' },
                    { country: 'Indonesia', projects: 19, flag: '🇮🇩' },
                    { country: 'India', projects: 15, flag: '🇮🇳' },
                    { country: 'Kenya', projects: 12, flag: '🇰🇪' }
                  ].map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <p className="font-medium">{country.country}</p>
                          <p className="text-sm text-muted-foreground">{country.projects} projects</p>
                        </div>
                      </div>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Custom Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => handleGenerateReport('user_growth', '30d')}
              >
                <Users className="h-5 w-5" />
                <span>User Growth Report</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => handleGenerateReport('market_analysis', '30d')}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Market Analysis</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => handleGenerateReport('project_performance', '30d')}
              >
                <Leaf className="h-5 w-5" />
                <span>Project Performance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => handleGenerateReport('financial_summary', '30d')}
              >
                <DollarSign className="h-5 w-5" />
                <span>Financial Summary</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}