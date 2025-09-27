"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TreePine,
  Leaf,
  Plus,
  TrendingUp,
  Bell,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  HelpCircle,
  BarChart3,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Project = {
  _id: string;
  projectName: string;
  projectType: string;
  verificationStatus?: string;
  submissionStatus?: string;
  reviewComments?: string;
  location?: { address?: string };
  updatedAt?: string;
  issuedCredit?: number;
  proposedCredit?: number;
};

const OrganizationDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editProposedCredit, setEditProposedCredit] = useState<number>(0);

  async function loadProjectData() {
    const data = await axios.get("/api/projects/user");
    // console.log(data.data.data);
    setProjects(data.data.data);
  }
  useEffect(() => {
    loadProjectData();
  }, []);
  const [creditTypeData, setCreditTypeData] = useState([
    { name: "Blue Credits", value: 35, color: "#3B82F6" },
    { name: "Green Credits", value: 45, color: "#10B981" },
    { name: "Yellow Credits", value: 20, color: "#F59E0B" },
  ] as { name: string; value: number; color: string }[]);
  useEffect(() => {
    let blueCount = 0;
    let greenCount = 0;
    let yellowCount = 0;
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].projectType == "blue") {
        blueCount++;
      } else if (projects[i].projectType == "yellow") {
        yellowCount++;
      } else if (projects[i].projectType == "green") {
        greenCount++;
      } else {
      }
    }

    const total = blueCount + greenCount + yellowCount || 1;
    const toPercent = (n: number) => Math.round((n / total) * 100 * 100) / 100;
    const data = [
      { name: "Blue Credits", value: toPercent(blueCount), color: "#3B82F6" },
      { name: "Green Credits", value: toPercent(greenCount), color: "#10B981" },
      { name: "Yellow Credits", value: toPercent(yellowCount), color: "#F59E0B" },
    ];
    setCreditTypeData(data);
  }, [projects]);
  const projectsss = [
    {
      id: 1,
      name: "Urban Tree Planting Initiative",
      type: "Green",
      status: "verified",
      location: "São Paulo, Brazil",
      lastUpdate: "2024-01-15",
      creditsIssued: 2450,
      description: "Large-scale urban reforestation project",
    },
    {
      id: 2,
      name: "Solar Rooftop Installation",
      type: "Yellow",
      status: "under-review",
      location: "Mumbai, India",
      lastUpdate: "2024-01-12",
      creditsIssued: 1800,
      description: "Residential solar panel deployment",
    },
    {
      id: 3,
      name: "Coastal Mangrove Restoration",
      type: "Blue",
      status: "submitted",
      location: "Mombasa, Kenya",
      lastUpdate: "2024-01-10",
      creditsIssued: 0,
      description: "Marine ecosystem restoration",
    },
    {
      id: 4,
      name: "Wind Farm Development",
      type: "Yellow",
      status: "verified",
      location: "Texas, USA",
      lastUpdate: "2024-01-08",
      creditsIssued: 5200,
      description: "Renewable energy generation project",
    },
    {
      id: 5,
      name: "Ocean Cleanup Program",
      type: "Blue",
      status: "rejected",
      location: "Pacific Ocean",
      lastUpdate: "2024-01-05",
      creditsIssued: 0,
      description: "Marine plastic waste removal",
    },
  ];

  const creditsTrendData = [
    { month: "Jan", credits: 1200 },
    { month: "Feb", credits: 1800 },
    { month: "Mar", credits: 2400 },
    { month: "Apr", credits: 2100 },
    { month: "May", credits: 2800 },
    { month: "Jun", credits: 3200 },
    { month: "Jul", credits: 2900 },
    { month: "Aug", credits: 3400 },
    { month: "Sep", credits: 3800 },
    { month: "Oct", credits: 4200 },
    { month: "Nov", credits: 3900 },
    { month: "Dec", credits: 4500 },
  ];

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "verified":
        return "default";
      case "pending":
        return "outline";
      case "submitted":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "submitted":
        return <AlertCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCreditTypeColor = (type: string) => {
    switch (type) {
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((project.location?.address || "").toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || project.verificationStatus === statusFilter;
    const matchesType =
      typeFilter === "all" || project.projectType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCredits = projects?.reduce(
    (sum, project) => sum + (project.issuedCredit || 0),
    0
  );
  const proposedCredit = projects?.reduce(
    (sum, project) => sum + (project.proposedCredit || 0),
    0
  );
  console.log(totalCredits);
  const verifiedProjects = projects?.filter(
    (p) => p.verificationStatus === "verified"
  ).length;
  const verificationRate = projects.length
    ? ((verifiedProjects / projects.length) * 100).toFixed(1)
    : "0.0";
  const pendingCredits = projects?.filter(
    (p) => p.verificationStatus === "pending" || p.verificationStatus === "submitted"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    XtraCarbon MRV
                  </h1>
                  <p className="text-sm text-muted-foreground">Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {projects.length}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <TreePine className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Credits Earned
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {totalCredits.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <Award className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    MRV Verification Rate
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {verificationRate}%
                  </p>
                </div>
                <div className="p-3 bg-info/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Credits Pending
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {proposedCredit}
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="default" className="h-auto p-4 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    <Link href={"/submit/project/ngo"} className="font-semibold">Add New Project</Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col">
                    <Award className="h-6 w-6 mb-2" />
                    <span className="font-semibold">View All Credits</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Download Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Projects</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="under-review">
                          Under Review
                        </SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Yellow">Yellow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Credits Issued</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow
                        key={project._id}
                        className={`hover:bg-muted/50 ${
                          project.submissionStatus === "requires_revision"
                            ? "bg-red-50"
                            : ""
                        }`}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{project.projectName}</p>
                            <p className="text-sm text-muted-foreground">
                              {project?.projectName}
                            </p>
                            {project.submissionStatus === "requires_revision" && (
                              <div className="mt-1 text-sm text-red-600 flex items-start gap-1">
                                <AlertCircle className="h-4 w-4 mt-0.5" />
                                <span>
                                  {project.reviewComments || "Revision required by reviewer."}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCreditTypeColor(
                              project.projectType
                            )}`}
                          >
                            {project.projectType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusVariant(
                              project.verificationStatus ?? ""
                            )}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getStatusIcon(project.verificationStatus ?? "")}
                            {project.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {project.location?.address}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {project.updatedAt}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {project?.proposedCredit || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setViewingProject(project);
                                setIsViewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                console.log(project)
                                if (project._id) {
                                  router.push(`/submit/project/update/${project._id}`);
                                }
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credits Trend Chart */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Credits Earned Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={creditsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="credits"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Credit Types Distribution */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Credit Types Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={creditTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${value}%`
                      }
                    >
                      {creditTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {creditTypeData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Button */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-info/10 rounded-full w-fit mx-auto mb-3">
                    <HelpCircle className="h-6 w-6 text-info" />
                  </div>
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access documentation and support for the MRV platform
                  </p>
                  <Button variant="outline" className="w-full">
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposedCredit">Proposed Credit</Label>
              <Input
                id="proposedCredit"
                type="number"
                value={isNaN(editProposedCredit) ? "" : editProposedCredit}
                onChange={(e) => setEditProposedCredit(parseFloat(e.target.value))}
              />
            </div>
            {editingProject?.submissionStatus === "requires_revision" && (
              <div className="text-xs text-muted-foreground">
                Changes will set SubmissionStatus to reapply.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditOpen(false);
                setEditingProject(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!editingProject?._id) return;
                try {
                  await axios.patch(`/api/projects/${editingProject._id}`, {
                    updates: {
                      projectName: editName,
                      proposedCredit: Number(editProposedCredit) || 0,
                    },
                    setReapply: true,
                  });
                  await loadProjectData();
                  setIsEditOpen(false);
                  setEditingProject(null);
                } catch (err) {
                  console.error("Failed to update project", err);
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Documents Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Related Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {(() => {
              const filesFrom = (src: any): { url: string; label: string; isImage: boolean }[] => {
                if (!src) return [];
                const arr = Array.isArray(src) ? src : [src];
                return arr
                  .map((item: any, idx: number) => {
                    const url =
                      (typeof item === "string" && item) ||
                      item?.url ||
                      item?.downloadUrl ||
                      item?.href ||
                      item?.path ||
                      "";
                    if (!url) return null;
                    const isImage = /\.(png|jpg|jpeg|gif|webp|tif|tiff)$/i.test(url);
                    const label = item?.name || `file-${idx + 1}`;
                    return { url, label, isImage };
                  })
                  .filter(Boolean) as { url: string; label: string; isImage: boolean }[];
              };

              const sections: { title: string; items: { url: string; label: string; isImage: boolean }[] }[] = [
                { title: "Images List", items: filesFrom(viewingProject?.imagesList) },
                { title: "Field Survey Reports", items: filesFrom((viewingProject as any)?.fieldSurveyReports) },
                { title: "Additional Evidence", items: filesFrom((viewingProject as any)?.additionalEvidence) },
                { title: "Blue Carbon • Satellite Images", items: filesFrom((viewingProject as any)?.blueCarbonData?.satelliteImages) },
                { title: "Blue Carbon • Geotagged Photos", items: filesFrom((viewingProject as any)?.blueCarbonData?.geotaggedPhotos) },
                { title: "Green Carbon • Drone Images", items: filesFrom((viewingProject as any)?.greenCarbonData?.droneImages) },
                { title: "Green Carbon • Geotagged Photos", items: filesFrom((viewingProject as any)?.greenCarbonData?.geotaggedPhotos) },
                { title: "Yellow Carbon • Satellite Images", items: filesFrom((viewingProject as any)?.yellowCarbonData?.satelliteImages) },
                { title: "Yellow Carbon • Geotagged Photos", items: filesFrom((viewingProject as any)?.yellowCarbonData?.geotaggedPhotos) },
                { title: "Map Polygon", items: filesFrom((viewingProject as any)?.mapPolygon) },
              ];

              return (
                <div className="space-y-6">
                  {sections
                    .filter((s) => s.items.length > 0)
                    .map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {section.items.map((f, i) => (
                            <a
                              key={i}
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              className="border rounded-md p-2 hover:bg-muted/50"
                            >
                              {f.isImage ? (
                                <img
                                  src={f.url}
                                  alt={f.label}
                                  className="w-full h-28 object-cover rounded"
                                />
                              ) : (
                                <div className="text-sm truncate">{f.label}</div>
                              )}
                              <div className="mt-1 text-xs text-muted-foreground truncate">{f.label}</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  {sections.every((s) => s.items.length === 0) && (
                    <div className="text-sm text-muted-foreground">No related files found.</div>
                  )}
                </div>
              );
            })()}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationDashboard;
