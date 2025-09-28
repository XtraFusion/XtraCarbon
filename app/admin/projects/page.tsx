"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  CreditCard,
  MapPin,
  Calendar,
  Leaf,
  Zap,
  Waves,
  Mountain
} from 'lucide-react';
import { mockProjects } from '@/data/mockDataAdmin';
import { Project } from '@/types/admin';

export default function ProjectManagement() {
  const [projects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'rejected'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'under_review':
        return <Badge className="bg-warning text-warning-foreground">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProjectTypeIcon = (type: Project['type']) => {
    const icons = {
      reforestation: Leaf,
      renewable_energy: Zap,
      methane_capture: Mountain,
      soil_carbon: Mountain,
      ocean_protection: Waves
    };
    
    const Icon = icons[type] || Leaf;
    return <Icon className="h-4 w-4" />;
  };

  // TODO: Implement API calls for project management
  const handleApproveProject = (projectId: string) => {
    console.log('API Call: Approve project', projectId);
    // Implementation needed: PUT /api/admin/projects/${projectId}/approve
  };

  const handleRejectProject = (projectId: string) => {
    console.log('API Call: Reject project', projectId);
    // Implementation needed: PUT /api/admin/projects/${projectId}/reject
  };

  const handleIssueCredits = (projectId: string, amount: number) => {
    console.log('API Call: Issue credits', { projectId, amount });
    // Implementation needed: POST /api/admin/projects/${projectId}/issue-credits
  };

  return (
    < >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
            <p className="text-muted-foreground">
              Review and manage carbon credit projects
            </p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Eye className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {projects.filter(p => p.status === 'under_review').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {projects.filter(p => p.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Issued</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.reduce((sum, p) => sum + p.issuedCredits, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Project Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="under_review">Under Review</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Projects Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>NGO</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getProjectTypeIcon(project.type)}
                          <span className="capitalize">
                            {project.type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.ngoName}</div>
                          {project.verifierName && (
                            <div className="text-sm text-muted-foreground">
                              Verified by: {project.verifierName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {project.location.region}, {project.location.country}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Issued: <span className="font-medium">{project.issuedCredits.toLocaleString()}</span></div>
                          <div>Expected: <span className="text-muted-foreground">{project.expectedCredits.toLocaleString()}</span></div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedProject(project)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {project.status === 'under_review' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleApproveProject(project.id)}
                                  className="text-success"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleRejectProject(project.id)}
                                  className="text-destructive"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {project.status === 'active' && (
                              <DropdownMenuItem onClick={() => handleIssueCredits(project.id, 1000)}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Issue Credits
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Project Name</label>
                      <p className="text-lg font-semibold">{selectedProject.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getProjectTypeIcon(selectedProject.type)}
                        <span className="capitalize">{selectedProject.type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedProject.location.region}, {selectedProject.location.country}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Duration</label>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">NGO</label>
                      <p className="font-medium">{selectedProject.ngoName}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Verifier</label>
                      <p className="text-sm">{selectedProject.verifierName || 'Not assigned'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Certification Standard</label>
                      <Badge variant="outline">{selectedProject.certificationStandard}</Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedProject.status)}</div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Price per Credit</label>
                      <p className="text-lg font-semibold">${selectedProject.pricePerCredit}</p>
                    </div>
                  </div>
                </div>

                {/* Credit Statistics */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Expected</p>
                    <p className="text-xl font-bold">{selectedProject.expectedCredits.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Issued</p>
                    <p className="text-xl font-bold text-primary">{selectedProject.issuedCredits.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-xl font-bold text-success">{selectedProject.availableCredits.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Retired</p>
                    <p className="text-xl font-bold text-muted-foreground">{selectedProject.retiredCredits.toLocaleString()}</p>
                  </div>
                </div>

                {/* Documents */}
                {selectedProject.documents.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Project Documents</label>
                    <div className="mt-2 space-y-2">
                      {selectedProject.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{doc.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {(doc.size / 1024 / 1024).toFixed(1)} MB
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2 pt-4 border-t">
                  {selectedProject.status === 'under_review' && (
                    <>
                      <Button onClick={() => handleApproveProject(selectedProject.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Project
                      </Button>
                      <Button variant="destructive" onClick={() => handleRejectProject(selectedProject.id)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Project
                      </Button>
                    </>
                  )}
                  {selectedProject.status === 'active' && (
                    <Button onClick={() => handleIssueCredits(selectedProject.id, 1000)}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Issue Credits
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ >
  );
}