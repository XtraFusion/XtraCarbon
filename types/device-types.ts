// TypeScript interfaces and types for device connectivity

export interface DeviceConnection {
    id: string
    name: string
    type: "drone" | "iot-sensor" | "mobile-camera"
    status: "disconnected" | "connecting" | "connected" | "error"
    lastConnected?: Date
    metadata?: Record<string, any>
  }
  
  export interface DroneDevice extends DeviceConnection {
    type: "drone"
    metadata: {
      model?: string
      batteryLevel?: number
      signalStrength?: number
      location?: { lat: number; lng: number }
    }
  }
  
  export interface IoTSensorDevice extends DeviceConnection {
    type: "iot-sensor"
    metadata: {
      sensorType?: string
      readings?: Record<string, number>
      units?: Record<string, string>
      calibrationDate?: Date
    }
  }
  
  export interface MobileCameraDevice extends DeviceConnection {
    type: "mobile-camera"
    metadata: {
      resolution?: string
      lastPhoto?: string // base64 or URL
      photoCount?: number
      permissions?: boolean
    }
  }
  
  export type AnyDevice = DroneDevice | IoTSensorDevice | MobileCameraDevice
  
  export interface DeviceModalProps {
    isOpen: boolean
    onClose: () => void
    onDeviceConnected: (device: AnyDevice) => void
    connectedDevices?: AnyDevice[]
  }
  
  export interface ConnectionResult {
    success: boolean
    device?: AnyDevice
    error?: string
  }
  
  /**
   * Extended types for advanced device management and API integration
   */
  
  // API Response Types
  export interface DeviceApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    timestamp: string
  }
  
  export interface DeviceListResponse extends DeviceApiResponse {
    data: {
      devices: AnyDevice[]
      total: number
      page: number
      limit: number
    }
  }
  
  // Connection Event Types
  export type ConnectionEventType =
    | "device_connected"
    | "device_disconnected"
    | "device_error"
    | "connection_timeout"
    | "data_received"
  
  export interface ConnectionEvent {
    type: ConnectionEventType
    deviceId: string
    timestamp: Date
    data?: any
    error?: string
  }
  
  // Device Configuration Types
  export interface DeviceConfiguration {
    autoReconnect: boolean
    connectionTimeout: number // milliseconds
    dataPollingInterval?: number // milliseconds
    maxRetries: number
    customSettings?: Record<string, any>
  }
  
  export interface DroneConfiguration extends DeviceConfiguration {
    flightMode?: "manual" | "auto" | "guided"
    maxAltitude?: number // meters
    returnToHomeOnLowBattery?: boolean
    geofenceEnabled?: boolean
  }
  
  export interface SensorConfiguration extends DeviceConfiguration {
    calibrationRequired?: boolean
    samplingRate?: number // Hz
    alertThresholds?: Record<string, { min?: number; max?: number }>
    dataLogging?: boolean
  }
  
  export interface CameraConfiguration extends DeviceConfiguration {
    resolution?: string
    frameRate?: number
    autoFocus?: boolean
    flashEnabled?: boolean
    storageLocation?: "local" | "cloud"
  }
  
  // Form Integration Types
  export interface FormDeviceData {
    deviceId: string
    deviceType: AnyDevice["type"]
    collectedData: Record<string, any>
    timestamp: Date
    location?: {
      lat: number
      lng: number
      accuracy?: number
    }
  }
  
  export interface DataCollectionSession {
    id: string
    name: string
    startTime: Date
    endTime?: Date
    devices: AnyDevice[]
    collectedData: FormDeviceData[]
    status: "active" | "completed" | "cancelled"
  }
  
  // Hook Return Types
  export interface UseDeviceConnectionsReturn {
    connectedDevices: AnyDevice[]
    connectionHistory: AnyDevice[]
    addDevice: (device: AnyDevice) => void
    removeDevice: (deviceId: string) => void
    updateDevice: (deviceId: string, updates: Partial<AnyDevice>) => void
    getDevicesByType: (type: AnyDevice["type"]) => AnyDevice[]
    isDeviceTypeConnected: (type: AnyDevice["type"]) => boolean
    disconnectAll: () => void
    getConnectionSummary: () => ConnectionSummary
  }
  
  export interface ConnectionSummary {
    total: number
    drones: number
    sensors: number
    cameras: number
    activeConnections: number
    errorConnections: number
  }
  
  // Validation Types
  export interface ValidationRule {
    field: string
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean | string
  }
  
  export interface DeviceValidationSchema {
    [deviceType: string]: ValidationRule[]
  }
  
  // Error Types
  export class DeviceConnectionError extends Error {
    constructor(
      message: string,
      public deviceId?: string,
      public deviceType?: AnyDevice["type"],
      public code?: string,
    ) {
      super(message)
      this.name = "DeviceConnectionError"
    }
  }
  
  export class DeviceValidationError extends Error {
    constructor(
      message: string,
      public field: string,
      public value: any,
    ) {
      super(message)
      this.name = "DeviceValidationError"
    }
  }
  
  // Utility Types
  export type DeviceStatus = AnyDevice["status"]
  export type DeviceType = AnyDevice["type"]
  export type DeviceMetadata<T extends AnyDevice = AnyDevice> = T["metadata"]
  
  // Type Guards
  export function isDroneDevice(device: AnyDevice): device is DroneDevice {
    return device.type === "drone"
  }
  
  export function isIoTSensorDevice(device: AnyDevice): device is IoTSensorDevice {
    return device.type === "iot-sensor"
  }
  
  export function isMobileCameraDevice(device: AnyDevice): device is MobileCameraDevice {
    return device.type === "mobile-camera"
  }
  
  // Generic Device Filter Types
  export type DeviceFilter<T extends AnyDevice = AnyDevice> = {
    type?: T["type"]
    status?: T["status"]
    name?: string
    connectedAfter?: Date
    connectedBefore?: Date
    hasMetadata?: keyof T["metadata"]
  }
  
  // Async Operation Types
  export type AsyncDeviceOperation<T = any> = Promise<{
    success: boolean
    data?: T
    error?: string
  }>
  
  // Component Prop Types
  export interface BaseDeviceComponentProps {
    device: AnyDevice
    onUpdate?: (device: AnyDevice) => void
    onRemove?: (deviceId: string) => void
    className?: string
  }
  
  export interface DeviceListProps {
    devices: AnyDevice[]
    onDeviceSelect?: (device: AnyDevice) => void
    onDeviceRemove?: (deviceId: string) => void
    filter?: DeviceFilter
    sortBy?: keyof AnyDevice
    sortOrder?: "asc" | "desc"
  }
  
  // Constants
  export const DEVICE_TYPES = ["drone", "iot-sensor", "mobile-camera"] as const
  export const DEVICE_STATUSES = ["disconnected", "connecting", "connected", "error"] as const
  
  export const DEFAULT_DEVICE_CONFIGURATION: DeviceConfiguration = {
    autoReconnect: true,
    connectionTimeout: 30000, // 30 seconds
    maxRetries: 3,
    dataPollingInterval: 5000, // 5 seconds
  }
  
  export const DRONE_MODELS = [
    "DJI Mini 3 Pro",
    "DJI Air 2S",
    "DJI Mavic 3",
    "Autel EVO Lite+",
    "Parrot Anafi",
    "Skydio 2+",
    "Holy Stone HS720E",
    "Potensic Dreamer Pro",
  ] as const
  
  export const SENSOR_TYPES = [
    "Temperature Sensor",
    "Humidity Sensor",
    "Air Quality Monitor",
    "Motion Detector",
    "Light Sensor",
    "Pressure Sensor",
    "Sound Level Meter",
    "pH Sensor",
    "Soil Moisture Sensor",
    "Gas Detector",
  ] as const
  
  // Type for drone models and sensor types
  export type DroneModel = (typeof DRONE_MODELS)[number]
  export type SensorType = (typeof SENSOR_TYPES)[number]
  