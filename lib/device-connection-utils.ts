/**
 * Utility functions for device connections
 * Contains mock API calls and connection logic
 */

import type {
    AnyDevice,
    DroneDevice,
    IoTSensorDevice,
    MobileCameraDevice,
    ConnectionResult,
  } from "@/types/device-types"
  
  /**
   * Mock API endpoints for different device types
   */
  export const API_ENDPOINTS = {
    drone: "/api/devices/drone",
    sensor: "/api/devices/sensor",
    camera: "/api/devices/camera",
  } as const
  
  /**
   * Simulates a drone connection with realistic delay and error handling
   */
  export async function connectDroneDevice(
    model: string,
    deviceName?: string,
    apiEndpoint?: string,
  ): Promise<ConnectionResult> {
    try {
      // Simulate API call to drone service
      const response = await mockApiCall(apiEndpoint || API_ENDPOINTS.drone, {
        method: "POST",
        body: { model, deviceName },
        delay: 2000 + Math.random() * 1000, // 2-3 second delay
      })
  
      if (response.success) {
        const droneDevice: DroneDevice = {
          id: `drone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: deviceName || `${model} Drone`,
          type: "drone",
          status: "connected",
          lastConnected: new Date(),
          metadata: {
            model,
            batteryLevel: Math.floor(Math.random() * 100),
            signalStrength: Math.floor(Math.random() * 100),
            location: {
              lat: 37.7749 + (Math.random() - 0.5) * 0.01,
              lng: -122.4194 + (Math.random() - 0.5) * 0.01,
            },
          },
        }
  
        return { success: true, device: droneDevice }
      } else {
        return { success: false, error: response.error || "Failed to connect to drone" }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection timeout",
      }
    }
  }
  
  /**
   * Simulates IoT sensor detection and connection
   */
  export async function connectIoTSensorDevice(
    sensorType: string,
    deviceName?: string,
    apiEndpoint?: string,
  ): Promise<ConnectionResult> {
    try {
      // Simulate sensor scanning and connection
      const response = await mockApiCall(apiEndpoint || API_ENDPOINTS.sensor, {
        method: "POST",
        body: { sensorType, deviceName },
        delay: 1500 + Math.random() * 500, // 1.5-2 second delay
      })
  
      if (response.success) {
        const sensorDevice: IoTSensorDevice = {
          id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: deviceName || sensorType,
          type: "iot-sensor",
          status: "connected",
          lastConnected: new Date(),
          metadata: {
            sensorType,
            readings: generateSensorReadings(sensorType),
            units: getSensorUnits(sensorType),
            calibrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          },
        }
  
        return { success: true, device: sensorDevice }
      } else {
        return { success: false, error: response.error || "Sensor not detected" }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sensor connection failed",
      }
    }
  }
  
  /**
   * Handles mobile camera connection using browser APIs
   */
  export async function connectMobileCameraDevice(constraints?: MediaStreamConstraints): Promise<ConnectionResult> {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, error: "Camera API not supported in this browser" }
      }
  
      const defaultConstraints: MediaStreamConstraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }
  
      const stream = await navigator.mediaDevices.getUserMedia(constraints || defaultConstraints)
  
      const cameraDevice: MobileCameraDevice = {
        id: `camera-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: "Mobile Camera",
        type: "mobile-camera",
        status: "connected",
        lastConnected: new Date(),
        metadata: {
          resolution: "1920x1080",
          photoCount: 0,
          permissions: true,
        },
      }
  
      // Store stream reference for cleanup
      ;(cameraDevice as any).stream = stream
  
      return { success: true, device: cameraDevice }
    } catch (error) {
      let errorMessage = "Camera access denied"
  
      if (error instanceof Error) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage = "Camera permission denied by user"
            break
          case "NotFoundError":
            errorMessage = "No camera device found"
            break
          case "NotReadableError":
            errorMessage = "Camera is already in use by another application"
            break
          case "OverconstrainedError":
            errorMessage = "Camera constraints cannot be satisfied"
            break
          default:
            errorMessage = error.message
        }
      }
  
      return { success: false, error: errorMessage }
    }
  }
  
  /**
   * Mock API call simulator
   */
  async function mockApiCall(
    endpoint: string,
    options: {
      method: string
      body?: any
      delay?: number
    },
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, options.delay || 1000))
  
    // Simulate different success rates based on endpoint
    const successRates = {
      [API_ENDPOINTS.drone]: 0.9, // 90% success rate
      [API_ENDPOINTS.sensor]: 0.85, // 85% success rate
      [API_ENDPOINTS.camera]: 0.95, // 95% success rate
    }
  
    const successRate = successRates[endpoint as keyof typeof successRates] || 0.8
    const isSuccess = Math.random() < successRate
  
    if (isSuccess) {
      return { success: true, data: options.body }
    } else {
      const errors = [
        "Connection timeout",
        "Device not responding",
        "Authentication failed",
        "Service temporarily unavailable",
        "Invalid device configuration",
      ]
  
      return {
        success: false,
        error: errors[Math.floor(Math.random() * errors.length)],
      }
    }
  }
  
  /**
   * Generate realistic sensor readings based on sensor type
   */
  function generateSensorReadings(sensorType: string): Record<string, number> {
    const type = sensorType.toLowerCase()
  
    if (type.includes("temperature")) {
      return {
        temperature: Math.round((Math.random() * 40 + 10) * 10) / 10,
        humidity: Math.round(Math.random() * 100),
      }
    }
  
    if (type.includes("humidity")) {
      return { humidity: Math.round(Math.random() * 100) }
    }
  
    if (type.includes("air quality")) {
      return {
        pm25: Math.round(Math.random() * 50),
        pm10: Math.round(Math.random() * 100),
        co2: Math.round(Math.random() * 1000 + 400),
        voc: Math.round(Math.random() * 500),
      }
    }
  
    if (type.includes("motion")) {
      return {
        motion: Math.random() > 0.5 ? 1 : 0,
        sensitivity: Math.round(Math.random() * 100),
      }
    }
  
    if (type.includes("light")) {
      return {
        lux: Math.round(Math.random() * 1000),
        uv: Math.round(Math.random() * 10),
      }
    }
  
    // Default generic sensor
    return { value: Math.round(Math.random() * 100) }
  }
  
  /**
   * Get appropriate units for sensor readings
   */
  function getSensorUnits(sensorType: string): Record<string, string> {
    const type = sensorType.toLowerCase()
  
    if (type.includes("temperature")) {
      return { temperature: "°C", humidity: "%" }
    }
  
    if (type.includes("humidity")) {
      return { humidity: "%" }
    }
  
    if (type.includes("air quality")) {
      return { pm25: "μg/m³", pm10: "μg/m³", co2: "ppm", voc: "ppb" }
    }
  
    if (type.includes("motion")) {
      return { motion: "bool", sensitivity: "%" }
    }
  
    if (type.includes("light")) {
      return { lux: "lx", uv: "index" }
    }
  
    return { value: "units" }
  }
  
  /**
   * Validate device connection data
   */
  export function validateDeviceData(device: Partial<AnyDevice>): string[] {
    const errors: string[] = []
  
    if (!device.name || device.name.trim().length === 0) {
      errors.push("Device name is required")
    }
  
    if (!device.type || !["drone", "iot-sensor", "mobile-camera"].includes(device.type)) {
      errors.push("Invalid device type")
    }
  
    if (device.type === "drone" && !device.metadata?.model) {
      errors.push("Drone model is required")
    }
  
    if (device.type === "iot-sensor" && !device.metadata?.sensorType) {
      errors.push("Sensor type is required")
    }
  
    return errors
  }
  
  /**
   * Format device connection status for display
   */
  export function formatConnectionStatus(device: AnyDevice): {
    status: string
    color: string
    description: string
  } {
    switch (device.status) {
      case "connected":
        return {
          status: "Connected",
          color: "text-green-600",
          description: `Connected ${formatTimeAgo(device.lastConnected)}`,
        }
      case "connecting":
        return {
          status: "Connecting",
          color: "text-yellow-600",
          description: "Establishing connection...",
        }
      case "error":
        return {
          status: "Error",
          color: "text-red-600",
          description: "Connection failed",
        }
      default:
        return {
          status: "Disconnected",
          color: "text-gray-600",
          description: "Not connected",
        }
    }
  }
  
  /**
   * Format time ago helper
   */
  function formatTimeAgo(date?: Date): string {
    if (!date) return "unknown"
  
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
  
    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
  
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
  
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }
  