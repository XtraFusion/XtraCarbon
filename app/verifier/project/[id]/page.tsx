"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Download, FileText, MapPin, Calendar, Image as ImageIcon } from "lucide-react";

type MediaItem = { url: string; filename?: string };

const formatLocation = (loc: any) => {
  if (!loc) return "Unknown";
  const parts = [loc.address, loc.city, loc.region, loc.country].filter(Boolean);
  return parts.join(", ") || "Unknown";
};

const normalizeType = (t?: string) => {
  const v = (t || "").toLowerCase();
  if (v.includes("blue")) return "Blue";
  if (v.includes("yellow")) return "Yellow";
  if (v.includes("green")) return "Green";
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : "Unknown";
};

const ProjectDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [project, setProject] = useState<any>(null);
  const [projectUser,setProjectUser] = useState<any>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [issuedCredit, setIssuedCredit] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/projects/${id}`);
        setProject(res.data.data);
        setProjectUser(res.data.projectUser)
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  const performAction = async (action: 'confirm'|'reject'|'send_back'|'start') => {
    try {
      setActionLoading(action);
      const payload: any = { action };
      if (action === 'confirm') {
        payload.issuedCredit = Number(issuedCredit || 0);
        payload.message = message || undefined;
      }
      if (action === 'reject' || action === 'send_back') {
        payload.message = message || undefined;
      }
      const res = await axios.patch(`/api/projects/${id}`, payload);
      setProject(res.data.data);
      setMessage("");
      setIssuedCredit("");
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const allDocs: MediaItem[] = useMemo(() => {
    const docs: MediaItem[] = [];
    for (const m of project?.fieldSurveyReports || []) docs.push(m);
    for (const m of project?.additionalEvidence || []) docs.push(m);
    return docs;
  }, [project]);

  const allImages: MediaItem[] = useMemo(() => {
    const imgs: MediaItem[] = [];
    const green = project?.greenCarbonData;
    const blue = project?.blueCarbonData;
    const yellow = project?.yellowCarbonData;
    for (const m of green?.satelliteImages || []) imgs.push(m);
    for (const m of green?.droneImages || []) imgs.push(m);
    for (const m of green?.geotaggedPhotos || []) imgs.push(m);
    for (const m of blue?.satelliteImages || []) imgs.push(m);
    for (const m of blue?.droneImages || []) imgs.push(m);
    for (const m of blue?.geotaggedPhotos || []) imgs.push(m);
    for (const m of yellow?.satelliteImages || []) imgs.push(m);
    for (const m of yellow?.droneImages || []) imgs.push(m);
    for (const m of yellow?.geotaggedPhotos || []) imgs.push(m);
    for (const m of project?.imagesList || []) imgs.push(m);
    return imgs;
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">Loading project…</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">Project not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
          <p className="text-gray-600">{project.organizationName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: Primary Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Actions</h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => performAction('start')}
                    disabled={actionLoading !== null}
                    className="px-3 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50"
                  >
                    {actionLoading === 'start' ? 'Starting…' : 'Start Review'}
                  </button>
                  <button
                    onClick={() => performAction('reject')}
                    disabled={actionLoading !== null}
                    className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading === 'reject' ? 'Rejecting…' : 'Reject'}
                  </button>
                  <button
                    onClick={() => performAction('send_back')}
                    disabled={actionLoading !== null}
                    className="px-3 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    {actionLoading === 'send_back' ? 'Sending…' : 'Send Back to NGO'}
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Issued credits"
                      value={issuedCredit}
                      onChange={(e) => setIssuedCredit(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => performAction('confirm')}
                      disabled={actionLoading !== null}
                      className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {actionLoading === 'confirm' ? 'Confirming…' : 'Confirm Verification'}
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Optional message to NGO (for rejection or send back)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border rounded p-2 text-sm min-h-20"
                />
                <div className="text-xs text-gray-500">
                  Current status: {project.verificationStatus || project.submissionStatus}
                </div>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{formatLocation(project.location)}</span>
                </div>
                <div className="text-sm text-gray-900">
                  Type: <span className="font-medium">{normalizeType(project.projectType)}</span>
                </div>
                <div className="text-sm text-gray-900">
                  Area: <span className="font-medium">{Number(project.landArea || 0).toLocaleString()} {project.landAreaUnit || 'hectares'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">Submitted {project.submissionDate ? new Date(project.submissionDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="text-sm text-gray-900">
                  Proposed Credits: <span className="font-medium">{Number(project.proposedCredit || 0).toLocaleString()} tCO2e</span>
                </div>
                <div className="text-sm text-gray-900">
                  Status: <span className="font-medium">{project.verificationStatus || project.submissionStatus}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Monitoring</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-900">
                <div>
                  <div className="text-gray-600">Method</div>
                  <div>{project.monitoringData?.collectionMethod || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600">Frequency</div>
                  <div>{project.monitoringData?.frequency || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600">Start Date</div>
                  <div>{project.monitoringData?.startDate ? new Date(project.monitoringData.startDate).toLocaleDateString() : '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600">End Date</div>
                  <div>{project.monitoringData?.endDate ? new Date(project.monitoringData.endDate).toLocaleDateString() : '—'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-600">Data Sources</div>
                  <ul className="list-disc pl-5">
                    {(project.monitoringData?.dataSources || []).map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
              {allDocs.length === 0 ? (
                <div className="text-sm text-gray-600">No documents uploaded.</div>
              ) : (
                <ul className="space-y-2">
                  {allDocs.map((doc, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-50 rounded p-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 break-all">{doc.filename || 'Document'}</span>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
              {allImages.length === 0 ? (
                <div className="text-sm text-gray-600">No images uploaded.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allImages.map((img, idx) => (
                    <div key={idx} className="group border rounded overflow-hidden bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.filename || `image-${idx}`} className="w-full h-32 object-cover" />
                      <div className="flex items-center justify-between p-2 text-xs">
                        <div className="flex items-center space-x-1 text-gray-600 truncate">
                          <ImageIcon className="w-3 h-3" />
                          <span className="truncate" title={img.filename}>{img.filename || 'Image'}</span>
                        </div>
                        <a href={img.url} target="_blank" rel="noreferrer" download className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Contact and Meta */}
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="text-sm text-gray-900 space-y-2">
                <div>
                  <div className="text-gray-600">Email</div>
                  <div>{project.contactEmail || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600">Phone</div>
                  <div>{project.contactPhone || '—'}</div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Identifiers</h2>
              <div className="text-sm text-gray-900 space-y-2">
                <div className="break-all">Project ID: {project._id}</div>
                <div>Submitted By: {projectUser.email}</div>
                <div>Created: {project.createdAt ? new Date(project.createdAt).toLocaleString() : '—'}</div>
                <div>Updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;


