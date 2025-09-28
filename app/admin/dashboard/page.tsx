"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Users,
  FolderTree,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { mockSystemStats, mockAlerts, mockCreditsIssuedData, mockCreditsRetiredData } from '@/data/mockDataAdmin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

export default function AdminDashboard() {
  const stats = mockSystemStats;
  const alerts = mockAlerts.filter(alert => !alert.isRead);

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the NCCR Carbon Credit Registry system
          </p>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Priority Alerts</h2>
            <div className="grid gap-4">
              {alerts.slice(0, 3).map((alert) => (
                <Alert 
                  key={alert.id}
                  className={
                    alert.type === 'error' || alert.priority === 'critical' 
                      ? 'border-destructive' 
                      : alert.type === 'warning' 
                      ? 'border-warning' 
                      : 'border-border'
                  }
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    {alert.title}
                    <Badge variant={alert.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.priority}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    {alert.message}
                    {alert.actionUrl && (
                      <Button variant="link" className="p-0 h-auto ml-2">
                        {alert.actionLabel || 'View Details'}
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+{stats.activeUsers}</span> active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-warning">+{stats.pendingProjects}</span> pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalCredits / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{(stats.availableCredits / 1000000).toFixed(1)}M</span> available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats.monthlyTransactionValue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credits Issued Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Credits Issued Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockCreditsIssuedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Credits Retired Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Credits Retired Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockCreditsRetiredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">System Uptime</p>
                  <p className="text-2xl font-bold text-success">{stats.systemUptime}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Pending Actions</p>
                  <p className="text-2xl font-bold text-warning">{stats.pendingProjects + stats.pendingUsers}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Active Sessions</p>
                  <p className="text-2xl font-bold text-primary">89</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-16 flex flex-col space-y-2">
                <Users className="h-5 w-5" />
                <span>Review Users</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-2">
                <FolderTree className="h-5 w-5" />
                <span>Review Projects</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-2">
                <CreditCard className="h-5 w-5" />
                <span>Issue Credits</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-2">
                <TrendingUp className="h-5 w-5" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}