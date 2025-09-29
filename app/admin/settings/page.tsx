"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Settings as SettingsIcon,
  Shield,
  Users,
  Key,
  Bell,
  Globe,
  Database,
  Mail,
  Smartphone,
  Save,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export default function Settings() {
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'NCCR Carbon Registry',
    siteDescription: 'National Carbon Credit Registry Platform',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoApproval: false,
    maxFileSize: 10,
    sessionTimeout: 30,
    twoFactorRequired: false
  });

  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access and control',
      permissions: ['all'],
      userCount: 2
    },
    {
      id: '2',
      name: 'Registry Admin',
      description: 'Manage projects and credits',
      permissions: ['project_management', 'credit_management', 'user_view'],
      userCount: 8
    },
    {
      id: '3',
      name: 'User Manager',
      description: 'Manage user accounts and organizations',
      permissions: ['user_management', 'organization_management'],
      userCount: 5
    },
    {
      id: '4',
      name: 'Auditor',
      description: 'View-only access to audit logs and reports',
      permissions: ['audit_view', 'reports_view'],
      userCount: 3
    }
  ]);

  const [permissions] = useState<Permission[]>([
    { id: '1', name: 'User Management', description: 'Create, edit, delete users', category: 'Users' },
    { id: '2', name: 'Project Management', description: 'Approve/reject projects', category: 'Projects' },
    { id: '3', name: 'Credit Management', description: 'Issue and manage credits', category: 'Credits' },
    { id: '4', name: 'Audit View', description: 'View audit logs', category: 'Security' },
    { id: '5', name: 'System Settings', description: 'Modify system configuration', category: 'System' },
    { id: '6', name: 'Reports View', description: 'Generate and view reports', category: 'Reports' }
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // TODO: Implement API calls for settings management
  const handleSaveSystemSettings = () => {
    console.log('API Call: Save system settings', systemSettings);
    // Implementation needed: PUT /api/admin/settings/system
  };

  const handleSaveRole = (role: Role) => {
    console.log('API Call: Save role', role);
    // Implementation needed: PUT /api/admin/roles/${role.id}
  };

  const handleDeleteRole = (roleId: string) => {
    console.log('API Call: Delete role', roleId);
    // Implementation needed: DELETE /api/admin/roles/${roleId}
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleTestNotification = (type: 'email' | 'sms') => {
    console.log('API Call: Test notification', type);
    // Implementation needed: POST /api/admin/notifications/test
  };

  const handleBackupDatabase = () => {
    console.log('API Call: Backup database');
    // Implementation needed: POST /api/admin/system/backup
  };

  return (
    < >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system parameters and security settings
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>General Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={systemSettings.siteDescription}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable to restrict system access for maintenance
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.registrationEnabled}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, registrationEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve low-risk applications
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.autoApproval}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoApproval: checked }))}
                    />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" onClick={handleSaveSystemSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span>Security Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Security Level</Label>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-success text-success-foreground">High</Badge>
                      <span className="text-sm text-muted-foreground">All security features enabled</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication Required</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.twoFactorRequired}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, twoFactorRequired: checked }))}
                    />
                  </div>

                  <div className="p-4 border rounded-lg bg-warning/5 border-warning/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning">Security Recommendations</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Enable two-factor authentication for all admin accounts</li>
                          <li>• Set session timeout to 15 minutes or less</li>
                          <li>• Regular password rotation every 90 days</li>
                          <li>• Monitor audit logs for suspicious activity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" onClick={handleSaveSystemSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </Button>
                  <Button variant="outline" className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:from-indigo-600 hover:to-sky-600 border-0" onClick={() => console.log('Generate security report')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Security Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span>Notification Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send system alerts and updates via email
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                      <Button variant="outline" size="sm" onClick={() => handleTestNotification('email')}>
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send critical alerts via SMS
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, smsNotifications: checked }))}
                      />
                      <Button variant="outline" size="sm" onClick={() => handleTestNotification('sms')}>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notification Templates */}
                <div className="space-y-4">
                  <h4 className="font-medium">Notification Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'User Registration', type: 'email', enabled: true },
                      { name: 'Project Approval', type: 'email', enabled: true },
                      { name: 'Credit Issuance', type: 'email', enabled: true },
                      { name: 'System Alert', type: 'sms', enabled: false },
                      { name: 'Security Alert', type: 'sms', enabled: true },
                      { name: 'Maintenance Notice', type: 'email', enabled: true }
                    ].map((template) => (
                      <div key={template.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {template.type === 'email' ? (
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">{template.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{template.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {template.enabled ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted" />
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" onClick={handleSaveSystemSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions */}
          <TabsContent value="roles" className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <span>Roles & Permissions</span>
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input id="roleName" placeholder="Enter role name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea id="roleDescription" placeholder="Describe the role" />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <input type="checkbox" id={`perm-${permission.id}`} />
                              <Label htmlFor={`perm-${permission.id}`} className="text-sm">
                                {permission.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full">Create Role</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-sm text-muted-foreground">{role.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{role.userCount}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 2).map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm.replace('_', ' ')}
                                </Badge>
                              ))}
                              {role.permissions.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRole(role)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setRoleToDelete(role);
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={role.userCount > 0}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System */}
          <TabsContent value="system" className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span>System Maintenance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Database</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Database Size</p>
                          <p className="text-sm text-muted-foreground">Current usage</p>
                        </div>
                        <Badge variant="outline">2.4 GB</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Last Backup</p>
                          <p className="text-sm text-muted-foreground">Automated daily backup</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">Today</Badge>
                      </div>
                    </div>
                    <Button onClick={handleBackupDatabase} className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600">
                      <Database className="mr-2 h-4 w-4" />
                      Create Backup
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">System Health</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">CPU Usage</p>
                          <p className="text-sm text-muted-foreground">Current load</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">12%</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Memory Usage</p>
                          <p className="text-sm text-muted-foreground">RAM utilization</p>
                        </div>
                        <Badge className="bg-warning text-warning-foreground">68%</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Disk Space</p>
                          <p className="text-sm text-muted-foreground">Storage usage</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">34%</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive">Danger Zone</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        These actions are irreversible and should be used with extreme caution.
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="destructive" size="sm">
                          Reset System
                        </Button>
                        <Button variant="outline" size="sm">
                          Clear All Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Role Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Role</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the role "{roleToDelete?.name}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => roleToDelete && handleDeleteRole(roleToDelete.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ >
  );
}