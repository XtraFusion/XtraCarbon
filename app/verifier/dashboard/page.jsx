"use client"
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, FileText, CheckCircle, XCircle, Clock, Eye, ChevronDown, ChevronLeft, ChevronRight, User, LogOut, Download, MessageCircle } from 'lucide-react';
import axios from 'axios';

const VerifierDashboard = () => {
  // Sample data - in real app this would come from API
  const [allProjects,setProjects] = useState([]);
  async function loadProjectData (){

    const data = await axios.get("/api/projects");
    console.log(data.data.data)
    setProjects(data.data.data);
  }
  useEffect(()=>{
loadProjectData();
    

  },[]);
  // const [allProjects] = useState([
  //   {
  //     id: 1,
  //     name: "Amazon Rainforest Conservation",
  //     owner: "Green Earth Foundation",
  //     creditType: "Blue",
  //     location: "Brazil, Amazon",
  //     area: 15000,
  //     submissionDate: "2024-03-15",
  //     status: "Under Review",
  //     coordinates: { lat: -3.4653, lng: -62.2159 },
  //     description: "Large-scale forest conservation project protecting 15,000 hectares of primary Amazon rainforest.",
  //     documents: ["Environmental Impact Assessment", "Monitoring Plan", "Baseline Study"],
  //     images: 8,
  //     carbonCredits: 125000,
  //     methodology: "REDD+ Enhanced",
  //     verificationHistory: []
  //   },
  //   {
  //     id: 2,
  //     name: "Solar Farm Initiative",
  //     owner: "Clean Energy Corp",
  //     creditType: "Green",
  //     location: "California, USA",
  //     area: 2500,
  //     submissionDate: "2024-03-10",
  //     status: "Verified",
  //     coordinates: { lat: 36.7783, lng: -119.4179 },
  //     description: "Renewable energy project featuring 2,500 hectares of solar panels generating clean electricity.",
  //     documents: ["Technical Specifications", "Grid Connection Study", "Environmental Clearance"],
  //     images: 12,
  //     carbonCredits: 85000,
  //     methodology: "CDM Renewable Energy",
  //     verificationHistory: [{ date: "2024-03-20", action: "Approved", verifier: "Dr. Smith" }]
  //   },
  //   {
  //     id: 3,
  //     name: "Mangrove Restoration",
  //     owner: "Coastal Conservation Alliance",
  //     creditType: "Blue",
  //     location: "Philippines, Palawan",
  //     area: 800,
  //     submissionDate: "2024-03-20",
  //     status: "Pending",
  //     coordinates: { lat: 9.8349, lng: 118.7384 },
  //     description: "Coastal ecosystem restoration project focused on mangrove reforestation and blue carbon sequestration.",
  //     documents: ["Restoration Plan", "Community Engagement Report", "Biodiversity Assessment"],
  //     images: 15,
  //     carbonCredits: 45000,
  //     methodology: "Blue Carbon Standard",
  //     verificationHistory: []
  //   },
  //   {
  //     id: 4,
  //     name: "Wind Energy Development",
  //     owner: "Nordic Wind Solutions",
  //     creditType: "Green",
  //     location: "Denmark, Jutland",
  //     area: 1200,
  //     submissionDate: "2024-03-25",
  //     status: "Under Review",
  //     coordinates: { lat: 56.2639, lng: 9.5018 },
  //     description: "Offshore wind farm development contributing to renewable energy transition.",
  //     documents: ["Wind Assessment", "Marine Impact Study", "Turbine Specifications"],
  //     images: 6,
  //     carbonCredits: 95000,
  //     methodology: "Gold Standard Renewable",
  //     verificationHistory: []
  //   },
  //   {
  //     id: 5,
  //     name: "Sustainable Agriculture Program",
  //     owner: "FarmGreen Initiative",
  //     creditType: "Yellow",
  //     location: "Kenya, Central Province",
  //     area: 5000,
  //     submissionDate: "2024-03-18",
  //     status: "Verified",
  //     coordinates: { lat: -0.0236, lng: 37.9062 },
  //     description: "Sustainable farming practices reducing emissions while improving soil health and farmer livelihoods.",
  //     documents: ["Soil Analysis Report", "Farmer Training Manual", "Emission Reduction Plan"],
  //     images: 20,
  //     carbonCredits: 65000,
  //     methodology: "VCS Agriculture",
  //     verificationHistory: [{ date: "2024-03-28", action: "Approved", verifier: "Dr. Johnson" }]
  //   },
  //   {
  //     id: 6,
  //     name: "Urban Forest Project",
  //     owner: "City Green Network",
  //     creditType: "Green",
  //     location: "Singapore",
  //     area: 150,
  //     submissionDate: "2024-03-22",
  //     status: "Pending",
  //     coordinates: { lat: 1.3521, lng: 103.8198 },
  //     description: "Urban reforestation initiative creating green corridors and carbon sinks in metropolitan areas.",
  //     documents: ["Urban Planning Assessment", "Species Selection Guide", "Maintenance Protocol"],
  //     images: 10,
  //     carbonCredits: 15000,
  //     methodology: "Urban Forestry Standard",
  //     verificationHistory: []
  //   }
  // ]);

  const [filteredProjects, setFilteredProjects] = useState(allProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreditType, setSelectedCreditType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('submissionDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const itemsPerPage = 5;

  // Filter and search logic
  useEffect(() => {
    const toDisplayStatus = (p) => {
      const raw = (p?.verificationStatus || p?.submissionStatus || '').toString().toLowerCase();
      switch (raw) {
        case 'verified':
        case 'approved':
          return 'Verified';
        case 'under_review':
        case 'in_review':
        case 'review':
          return 'Under Review';
        case 'rejected':
          return 'Rejected';
        case 'pending':
        case 'submitted':
        default:
          return 'Pending';
      }
    };

    const normalizeType = (t) => {
      const v = (t || '').toString().toLowerCase();
      if (v.includes('blue')) return 'Blue';
      if (v.includes('yellow')) return 'Yellow';
      if (v.includes('green')) return 'Green';
      return v ? v.charAt(0).toUpperCase() + v.slice(1) : 'Unknown';
    };

    let filtered = allProjects.filter(project => {
      const name = (project.projectName || '').toString();
      const org = (project.organizationName || '').toString();
      const typeDisplay = normalizeType(project.projectType);
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           typeDisplay.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCreditType = selectedCreditType === 'All' || typeDisplay === selectedCreditType;
      const matchesStatus = selectedStatus === 'All' || toDisplayStatus(project) === selectedStatus;
      return matchesSearch && matchesCreditType && matchesStatus;
    });

    // Sort logic
    filtered.sort((a, b) => {
      let aValue;
      let bValue;
      if (sortColumn === 'name') {
        aValue = (a.projectName || '').toString();
        bValue = (b.projectName || '').toString();
      } else if (sortColumn === 'owner') {
        aValue = (a.organizationName || '').toString();
        bValue = (b.organizationName || '').toString();
      } else if (sortColumn === 'area') {
        aValue = Number(a.landArea) || 0;
        bValue = Number(b.landArea) || 0;
      } else if (sortColumn === 'submissionDate') {
        aValue = a.submissionDate;
        bValue = b.submissionDate;
      } else {
        aValue = a[sortColumn];
        bValue = b[sortColumn];
      }
      
      if (sortColumn === 'submissionDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCreditType, selectedStatus, sortColumn, sortDirection, allProjects]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="w-4 h-4" />;
      case 'Under Review': return <Clock className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCreditTypeColor = (type) => {
    const v = (type || '').toString().toLowerCase();
    if (v.includes('blue')) return 'bg-blue-500';
    if (v.includes('yellow')) return 'bg-yellow-500';
    if (v.includes('green')) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getDisplayType = (type) => {
    const v = (type || '').toString().toLowerCase();
    if (v.includes('blue')) return 'Blue';
    if (v.includes('yellow')) return 'Yellow';
    if (v.includes('green')) return 'Green';
    return v ? v.charAt(0).toUpperCase() + v.slice(1) : 'Unknown';
  };

  const getDisplayStatus = (project) => {
    const raw = (project?.verificationStatus || project?.submissionStatus || '').toString().toLowerCase();
    switch (raw) {
      case 'verified':
      case 'approved':
        return 'Verified';
      case 'under_review':
      case 'in_review':
      case 'review':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      case 'pending':
      case 'submitted':
      default:
        return 'Pending';
    }
  };

  const getDisplayLocation = (loc) => {
    if (!loc) return 'Unknown';
    const parts = [loc.address, loc.city, loc.region, loc.country].filter(Boolean);
    return parts.join(', ') || 'Unknown';
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleVerifierAction = (action, comments = '') => {
    // In real app, this would make API call
    console.log(`${action} project ${selectedProject.id}:`, comments);
    setShowModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Verifier Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-700">Dr. Sarah Wilson</span>
              </div>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Carbon Credit MRV Projects</h2>
          <p className="mt-2 text-gray-600">Review and verify carbon credit projects for compliance and accuracy.</p>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Credit Type Filter */}
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedCreditType}
                onChange={(e) => setSelectedCreditType(e.target.value)}
              >
                <option value="All">All Credit Types</option>
                <option value="Blue">Blue Carbon</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Export Button */}
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Project Name
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('owner')}
                  >
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('area')}
                  >
                    Area (ha)
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('submissionDate')}
                  >
                    Submission Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProjects.map((project, index) => (
                  <tr 
                    key={project._id || index} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                    onClick={() => openProjectDetails(project)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.projectName || 'Untitled Project'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.organizationName || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getCreditTypeColor(project.projectType)}`}></div>
                        <span className="text-sm text-gray-900">{getDisplayType(project.projectType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{getDisplayLocation(project.location)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{Number(project.landArea || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{project.submissionDate ? new Date(project.submissionDate).toLocaleDateString() : '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(getDisplayStatus(project))}`}>
                        {getStatusIcon(getDisplayStatus(project))}
                        <span>{getDisplayStatus(project)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/verifier/project/${project._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Open Page</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {currentProjects.map((project) => (
              <div 
                key={project._id}
                className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => openProjectDetails(project)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{project.projectName || 'Untitled Project'}</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(getDisplayStatus(project))}`}>
                    {getStatusIcon(getDisplayStatus(project))}
                    <span>{getDisplayStatus(project)}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.organizationName || '—'}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getCreditTypeColor(project.projectType)}`}></div>
                    <span>{getDisplayType(project.projectType)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{getDisplayLocation(project.location)}</span>
                  </div>
                  <div>{Number(project.landArea || 0).toLocaleString()} {project.landAreaUnit || 'ha'}</div>
                </div>
                <div className="mt-2">
                  <a
                    href={`/verifier/project/${project._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open Details Page</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === pageNum
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">{selectedProject.projectName || 'Project Details'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Project Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Owner Organization</label>
                      <p className="text-gray-900">{selectedProject.organizationName || '—'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Credit Type</label>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getCreditTypeColor(selectedProject.projectType)}`}></div>
                        <span className="text-gray-900">{getDisplayType(selectedProject.projectType)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{getDisplayLocation(selectedProject.location)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Project Area</label>
                      <p className="text-gray-900">{Number(selectedProject.landArea || 0).toLocaleString()} {selectedProject.landAreaUnit || 'hectares'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Proposed Carbon Credits</label>
                      <p className="text-gray-900">{Number(selectedProject.proposedCredit || 0).toLocaleString()} tCO2e</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Monitoring Method</label>
                      <p className="text-gray-900">{selectedProject.monitoringData?.collectionMethod || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Project Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Email</label>
                      <p className="text-gray-900 text-sm">{selectedProject.contactEmail || '—'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Phone</label>
                      <p className="text-gray-900 text-sm">{selectedProject.contactPhone || '—'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Monitoring Window</label>
                      <p className="text-gray-900 text-sm">
                        {selectedProject.monitoringData?.startDate ? new Date(selectedProject.monitoringData.startDate).toLocaleDateString() : '—'}
                        {' '}to{' '}
                        {selectedProject.monitoringData?.endDate ? new Date(selectedProject.monitoringData.endDate).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data Sources</label>
                      <ul className="space-y-1">
                        {(selectedProject.monitoringData?.dataSources || []).map((src, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{src}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Images</label>
                      <p className="text-gray-900 text-sm">
                        Satellite: {(selectedProject.greenCarbonData?.satelliteImages || []).length} • Geotagged: {(selectedProject.greenCarbonData?.geotaggedPhotos || []).length}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current Status</label>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(getDisplayStatus(selectedProject))}`}>
                        {getStatusIcon(getDisplayStatus(selectedProject))}
                        <span>{getDisplayStatus(selectedProject)}</span>
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Supporting Documents</label>
                      <ul className="space-y-1">
                        {[
                          ...(selectedProject.fieldSurveyReports || []),
                          ...(selectedProject.additionalEvidence || []),
                        ].map((doc, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                              {doc.filename || 'Document'}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification History */}
              {(selectedProject.verificationHistory || []).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Verification History</h4>
                  <div className="space-y-2">
                    {selectedProject.verificationHistory.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{entry.action} by {entry.verifier}</p>
                          <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleVerifierAction('reject')}
                className="flex items-center space-x-2 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => handleVerifierAction('request_changes')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Changes</span>
              </button>
              <button
                onClick={() => handleVerifierAction('approve')}
                className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Verify</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifierDashboard;