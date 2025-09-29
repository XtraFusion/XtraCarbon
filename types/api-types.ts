/**
 * API-specific types for device connectivity
 * Defines request/response structures for backend integration
 */

import type { AnyDevice, DeviceConfiguration } from "./device-types"

// Base API Types
export interface ApiRequest<T = any> {
  endpoint: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: T
  timeout?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId: string
    version: string
  }
}

// Device Connection API Types
export interface ConnectDeviceRequest {
  deviceType: AnyDevice["type"]
  deviceName?: string
  configuration?: DeviceConfiguration
  metadata?: Record<string, any>
}

export interface ConnectDeviceResponse extends ApiResponse<AnyDevice> {}

export interface DisconnectDeviceRequest {
  deviceId: string
  reason?: string
}

export interface DisconnectDeviceResponse extends ApiResponse<{ deviceId: string }> {}

// Device Data API Types
export interface DeviceDataRequest {
  deviceId: string
  startTime?: string // ISO string
  endTime?: string // ISO string
  dataTypes?: string[]
  limit?: number
  offset?: number
}

export interface DeviceDataPoint {
  timestamp: string
  deviceId: string
  dataType: string
  value: any
  unit?: string
  quality?: "good" | "poor" | "unknown"
}

export interface DeviceDataResponse
  extends ApiResponse<{
    dataPoints: DeviceDataPoint[]
    total: number
    hasMore: boolean
  }> {}

// Device Management API Types
export interface ListDevicesRequest {
  type?: AnyDevice["type"]
  status?: AnyDevice["status"]
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ListDevicesResponse
  extends ApiResponse<{
    devices: AnyDevice[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {}

export interface UpdateDeviceRequest {
  deviceId: string
  updates: Partial<Pick<AnyDevice, "name" | "metadata">>
}

export interface UpdateDeviceResponse extends ApiResponse<AnyDevice> {}

// Real-time API Types
export interface WebSocketMessage<T = any> {
  type: string
  deviceId?: string
  timestamp: string
  data: T
}

export interface DeviceStatusMessage
  extends WebSocketMessage<{
    status: AnyDevice["status"]
    metadata?: Record<string, any>
  }> {
  type: "device_status"
}

export interface DeviceDataMessage extends WebSocketMessage<DeviceDataPoint> {
  type: "device_data"
}

export interface ConnectionEventMessage
  extends WebSocketMessage<{
    event: "connected" | "disconnected" | "error"
    reason?: string
  }> {
  type: "connection_event"
}

// Error Response Types
export interface ApiErrorResponse extends ApiResponse<never> {
  success: false
  error: {
    code: string
    message: string
    details?: {
      field?: string
      value?: any
      constraint?: string
    }
  }
}

// Common API Error Codes
export const API_ERROR_CODES = {
  DEVICE_NOT_FOUND: "DEVICE_NOT_FOUND",
  DEVICE_ALREADY_CONNECTED: "DEVICE_ALREADY_CONNECTED",
  CONNECTION_TIMEOUT: "CONNECTION_TIMEOUT",
  INVALID_DEVICE_TYPE: "INVALID_DEVICE_TYPE",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]
