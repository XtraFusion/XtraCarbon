/**
 * Form-specific types for device integration
 * Defines structures for form data collection with connected devices
 */

import type { AnyDevice } from "./device-types"

// Form Field Types
export interface FormField {
  id: string
  name: string
  type:
    | "text"
    | "number"
    | "email"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "time"
    | "datetime-local"
  label: string
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: (value: any) => boolean | string
  }
  options?: Array<{ value: string; label: string }>
  deviceIntegration?: {
    deviceType: AnyDevice["type"]
    dataPath: string // Path to data in device metadata (e.g., 'metadata.location.lat')
    autoPopulate?: boolean
    formatValue?: (value: any) => string
  }
}

// Form Configuration
export interface FormConfiguration {
  id: string
  title: string
  description?: string
  fields: FormField[]
  deviceIntegrations: {
    required: AnyDevice["type"][]
    optional: AnyDevice["type"][]
    autoConnect?: boolean
  }
  validation?: {
    requireAllDevices?: boolean
    customValidation?: (formData: any, devices: AnyDevice[]) => string | null
  }
  submission?: {
    endpoint?: string
    includeDeviceData?: boolean
    includeTimestamp?: boolean
    includeLocation?: boolean
  }
}

// Form Data Types
export interface FormData {
  [fieldId: string]: any
}

export interface FormSubmission {
  id: string
  formId: string
  data: FormData
  connectedDevices: Array<{
    id: string
    type: AnyDevice["type"]
    name: string
    metadata: Record<string, any>
  }>
  deviceData?: Array<{
    deviceId: string
    dataType: string
    value: any
    timestamp: Date
  }>
  location?: {
    lat: number
    lng: number
    accuracy?: number
  }
  submittedAt: Date
  submittedBy?: string
}

// Form Validation Types
export interface FormValidationResult {
  isValid: boolean
  errors: Array<{
    fieldId: string
    message: string
  }>
  deviceErrors: Array<{
    deviceType: AnyDevice["type"]
    message: string
  }>
}

// Form State Types
export interface FormState {
  data: FormData
  errors: Record<string, string>
  isSubmitting: boolean
  isValid: boolean
  connectedDevices: AnyDevice[]
  deviceModalOpen: boolean
}

// Form Hook Types
export interface UseFormWithDevicesOptions {
  formConfig: FormConfiguration
  initialData?: FormData
  onSubmit?: (submission: FormSubmission) => Promise<void> | void
  onDeviceConnect?: (device: AnyDevice) => void
  onDeviceDisconnect?: (deviceId: string) => void
  autoSave?: boolean
  autoSaveInterval?: number // milliseconds
}

export interface UseFormWithDevicesReturn {
  formState: FormState
  updateField: (fieldId: string, value: any) => void
  connectDevice: (device: AnyDevice) => void
  disconnectDevice: (deviceId: string) => void
  validateForm: () => FormValidationResult
  submitForm: () => Promise<void>
  resetForm: () => void
  openDeviceModal: () => void
  closeDeviceModal: () => void
  populateFromDevice: (deviceId: string, fieldId: string) => void
}

// Pre-built Form Templates
export interface FormTemplate {
  id: string
  name: string
  description: string
  category: "survey" | "inspection" | "monitoring" | "research" | "maintenance"
  configuration: FormConfiguration
  preview?: string // URL to preview image
}

// Common Form Templates
export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "environmental-survey",
    name: "Environmental Survey",
    description: "Collect environmental data using IoT sensors and drone imagery",
    category: "survey",
    configuration: {
      id: "environmental-survey",
      title: "Environmental Data Collection",
      description: "Survey environmental conditions with connected devices",
      fields: [
        {
          id: "location",
          name: "location",
          type: "text",
          label: "Survey Location",
          required: true,
          deviceIntegration: {
            deviceType: "drone",
            dataPath: "metadata.location",
            autoPopulate: true,
            formatValue: (location) => `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
          },
        },
        {
          id: "temperature",
          name: "temperature",
          type: "number",
          label: "Temperature (°C)",
          deviceIntegration: {
            deviceType: "iot-sensor",
            dataPath: "metadata.readings.temperature",
            autoPopulate: true,
          },
        },
      ],
      deviceIntegrations: {
        required: ["iot-sensor"],
        optional: ["drone", "mobile-camera"],
      },
    },
  },
]

// Export utility type for form template IDs
export type FormTemplateId = (typeof FORM_TEMPLATES)[number]["id"]
