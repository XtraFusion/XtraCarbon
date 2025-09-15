"use client"

import type React from "react"
import { useState } from "react"

interface VerifierFormData {
  // Project Review
  projectName: string
  organizationName: string
  projectLocation: string
  projectType: string
  landArea: string
  
  // Verification Details
  verificationDate: string
  verifierName: string
  verifierOrganization: string
  verificationStatus: string
  reviewComments: string
  verificationMethodology: string
  verificationReport: File | null
  
  // Verification Checklist
  meetsStandards: boolean
  mrvDataComplete: boolean
  evidenceSufficient: boolean
  locationVerified: boolean
  calculationsVerified: boolean
  
  // Approval Decision
  carbonCreditsToMint: string
  blockchainTxId: string
  creditVintage: string
}

export default function VerifierReviewPage() {
  const [submitting, setSubmitting] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<VerifierFormData>({
    projectName: "",
    organizationName: "",
    projectLocation: "",
    projectType: "",
    landArea: "",
    verificationDate: "",
    verifierName: "",
    verifierOrganization: "",
    verificationStatus: "Pending",
    reviewComments: "",
    verificationMethodology: "",
    verificationReport: null,
    meetsStandards: false,
    mrvDataComplete: false,
    evidenceSufficient: false,
    locationVerified: false,
    calculationsVerified: false,
    carbonCreditsToMint: "",
    blockchainTxId: "",
    creditVintage: ""
  })

  const sections = ["Project Review", "Verification Details", "Approval Decision"]

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, [name]: file }))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    console.log("Verifier Form Data:", formData)
    setTimeout(() => {
      alert("Verification completed successfully!")
      setSubmitting(false)
    }, 2000)
  }

  function nextSection() {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  function prevSection() {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  function approveProject() {
    setFormData(prev => ({...prev, verificationStatus: 'Approved'}))
    alert('Project approved! Carbon credits will be minted.')
  }

  function rejectProject() {
    setFormData(prev => ({...prev, verificationStatus: 'Rejected'}))
    alert('Project rejected. Please provide detailed feedback.')
  }

  const inputStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #D1D5DB",
    color: "#111827",
  }

  const sectionStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
  }

  const readOnlyStyle = {
    backgroundColor: "#F9FAFB",
    border: "1px solid #D1D5DB",
    color: "#6B7280",
  }

  return (
    <main className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Verifier Review & Approval</h1>
          <p className="text-gray-600 mt-2">
            Please evaluate the submitted project data and upload your verification report. Confirm the project's compliance with the carbon credit standards.
          </p>
        </header>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentSection
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index <= currentSection ? "text-gray-900" : "text-gray-500"
                }`}>
                  {section}
                </span>
                {index < sections.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < currentSection ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Section 1: Project Review */}
          {currentSection === 0 && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Project Review
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Submitted Project Information</h3>
                <p className="text-sm text-blue-800">
                  Review the project details submitted by the NGO. These fields are read-only for data integrity.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                    Verified Project Name *
                  </label>
                  <input
                    required
                    id="projectName"
                    name="projectName"
                    type="text"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={readOnlyStyle}
                    placeholder="Auto-filled from NGO submission"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization / NGO Name *
                  </label>
                  <input
                    required
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={readOnlyStyle}
                    placeholder="Auto-filled from NGO submission"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="projectLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Location *
                  </label>
                  <input
                    required
                    id="projectLocation"
                    name="projectLocation"
                    type="text"
                    value={formData.projectLocation}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={readOnlyStyle}
                    placeholder="Auto-filled from NGO submission"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                    Carbon Credit Type *
                  </label>
                  <input
                    required
                    id="projectType"
                    name="projectType"
                    type="text"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={readOnlyStyle}
                    placeholder="Auto-filled from NGO submission"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="landArea" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Area *
                  </label>
                  <input
                    required
                    id="landArea"
                    name="landArea"
                    type="text"
                    value={formData.landArea}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={readOnlyStyle}
                    placeholder="Auto-filled from NGO submission"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="verificationDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Date *
                  </label>
                  <input
                    required
                    id="verificationDate"
                    name="verificationDate"
                    type="date"
                    value={formData.verificationDate}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="verifierName" className="block text-sm font-medium text-gray-700 mb-1">
                    Verifier Name *
                  </label>
                  <input
                    required
                    id="verifierName"
                    name="verifierName"
                    type="text"
                    value={formData.verifierName}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="verifierOrganization" className="block text-sm font-medium text-gray-700 mb-1">
                    Verifier Organization *
                  </label>
                  <input
                    required
                    id="verifierOrganization"
                    name="verifierOrganization"
                    type="text"
                    value={formData.verifierOrganization}
                    onChange={handleInputChange}
                    className="w-full rounded-md px-3 py-2"
                    style={inputStyle}
                    placeholder="Your organization"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="verificationStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Status *
                </label>
                <select
                  required
                  id="verificationStatus"
                  name="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={handleInputChange}
                  className="w-full rounded-md px-3 py-2"
                  style={inputStyle}
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In Progress</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          )}

          {/* Section 2: Verification Details */}
          {currentSection === 1 && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Verification Details
              </h2>
              
              <div>
                <label htmlFor="reviewComments" className="block text-sm font-medium text-gray-700 mb-1">
                  Review Comments / Observations *
                </label>
                <textarea
                  required
                  id="reviewComments"
                  name="reviewComments"
                  rows={5}
                  value={formData.reviewComments}
                  onChange={handleInputChange}
                  className="w-full rounded-md px-3 py-2"
                  style={inputStyle}
                  placeholder="Detailed review comments, observations, and findings from the verification process"
                />
              </div>

              <div>
                <label htmlFor="verificationMethodology" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Methodology Description *
                </label>
                <textarea
                  required
                  id="verificationMethodology"
                  name="verificationMethodology"
                  rows={4}
                  value={formData.verificationMethodology}
                  onChange={handleInputChange}
                  className="w-full rounded-md px-3 py-2"
                  style={inputStyle}
                  placeholder="Describe the verification methodology used, standards applied, and assessment criteria"
                />
              </div>

              <div>
                <label htmlFor="verificationReport" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Verification Report *
                </label>
                <input
                  required
                  id="verificationReport"
                  name="verificationReport"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full rounded-md px-3 py-2"
                  style={inputStyle}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload verification report (PDF or DOC required)
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Checklist</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="meetsStandards"
                      checked={formData.meetsStandards}
                      onChange={handleInputChange}
                      className="mr-3" 
                    />
                    <span className="text-sm text-gray-700">Project meets carbon credit standards</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="mrvDataComplete"
                      checked={formData.mrvDataComplete}
                      onChange={handleInputChange}
                      className="mr-3" 
                    />
                    <span className="text-sm text-gray-700">MRV data is complete and accurate</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="evidenceSufficient"
                      checked={formData.evidenceSufficient}
                      onChange={handleInputChange}
                      className="mr-3" 
                    />
                    <span className="text-sm text-gray-700">Evidence documentation is sufficient</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="locationVerified"
                      checked={formData.locationVerified}
                      onChange={handleInputChange}
                      className="mr-3" 
                    />
                    <span className="text-sm text-gray-700">Project location and boundaries verified</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="calculationsVerified"
                      checked={formData.calculationsVerified}
                      onChange={handleInputChange}
                      className="mr-3" 
                    />
                    <span className="text-sm text-gray-700">Carbon sequestration calculations verified</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Approval Decision */}
          {currentSection === 2 && (
            <div className="rounded-lg p-6 space-y-6" style={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Final Approval Decision
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Project Summary</h3>
                <p className="text-sm text-blue-800">
                  <strong>Project:</strong> {formData.projectName || 'N/A'}<br/>
                  <strong>Organization:</strong> {formData.organizationName || 'N/A'}<br/>
                  <strong>Status:</strong> {formData.verificationStatus}<br/>
                  <strong>Verifier:</strong> {formData.verifierName} ({formData.verifierOrganization})
                </p>
              </div>

              {formData.verificationStatus === 'Approved' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Carbon Credit Tokenization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="carbonCreditsToMint" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Verified Carbon Credits to Mint (tCO2e) *
                      </label>
                      <input
                        required
                        id="carbonCreditsToMint"
                        name="carbonCreditsToMint"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.carbonCreditsToMint}
                        onChange={handleInputChange}
                        className="w-full rounded-md px-3 py-2"
                        style={inputStyle}
                        placeholder="100.50"
                      />
                    </div>

                    <div>
                      <label htmlFor="creditVintage" className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Vintage/Year *
                      </label>
                      <input
                        required
                        id="creditVintage"
                        name="creditVintage"
                        type="number"
                        min="2020"
                        max="2030"
                        value={formData.creditVintage}
                        onChange={handleInputChange}
                        className="w-full rounded-md px-3 py-2"
                        style={inputStyle}
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="blockchainTxId" className="block text-sm font-medium text-gray-700 mb-1">
                      Blockchain Transaction ID/Reference
                    </label>
                    <input
                      id="blockchainTxId"
                      name="blockchainTxId"
                      type="text"
                      value={formData.blockchainTxId}
                      onChange={handleInputChange}
                      className="w-full rounded-md px-3 py-2"
                      style={inputStyle}
                      placeholder="0x1234567890abcdef..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Transaction hash or reference ID for blockchain minting
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={approveProject}
                  className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Approve and Mint Credits
                </button>
                
                <button
                  type="button"
                  onClick={rejectProject}
                  className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                >
                  Reject with Comments
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={nextSection}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : "Complete Verification"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
