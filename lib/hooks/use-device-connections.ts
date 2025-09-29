"use client"

import { useState, useCallback, useEffect } from "react"
import type { AnyDevice } from "@/types/device-types"

/**
 * Custom hook for managing device connections
 * Provides state management and utility functions for device connectivity
 */
export function useDeviceConnections() {
  const [connectedDevices, setConnectedDevices] = useState<AnyDevice[]>([])
  const [connectionHistory, setConnectionHistory] = useState<AnyDevice[]>([])

  /**
   * Add a new device connection
   */
  const addDevice = useCallback((device: AnyDevice) => {
    setConnectedDevices((prev) => {
      // Prevent duplicate connections
      const exists = prev.find((d) => d.id === device.id)
      if (exists) return prev

      return [...prev, device]
    })

    // Add to history
    setConnectionHistory((prev) => {
      const filtered = prev.filter((d) => d.id !== device.id)
      return [device, ...filtered].slice(0, 10) // Keep last 10 connections
    })
  }, [])

  /**
   * Remove a device connection
   */
  const removeDevice = useCallback((deviceId: string) => {
    setConnectedDevices((prev) => prev.filter((d) => d.id !== deviceId))
  }, [])

  /**
   * Update device status or metadata
   */
  const updateDevice = useCallback((deviceId: string, updates: Partial<AnyDevice>) => {
    setConnectedDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, ...updates, lastConnected: new Date() } : device)),
    )
  }, [])

  /**
   * Get devices by type
   */
  const getDevicesByType = useCallback(
    (type: AnyDevice["type"]) => {
      return connectedDevices.filter((device) => device.type === type)
    },
    [connectedDevices],
  )

  /**
   * Check if a device type is already connected
   */
  const isDeviceTypeConnected = useCallback(
    (type: AnyDevice["type"]) => {
      return connectedDevices.some((device) => device.type === type)
    },
    [connectedDevices],
  )

  /**
   * Disconnect all devices
   */
  const disconnectAll = useCallback(() => {
    setConnectedDevices([])
  }, [])

  /**
   * Get connection summary
   */
  const getConnectionSummary = useCallback(() => {
    return {
      total: connectedDevices.length,
      drones: getDevicesByType("drone").length,
      sensors: getDevicesByType("iot-sensor").length,
      cameras: getDevicesByType("mobile-camera").length,
    }
  }, [connectedDevices, getDevicesByType])

  // Persist connections to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("device-connections")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConnectedDevices(parsed.devices || [])
        setConnectionHistory(parsed.history || [])
      } catch (error) {
        console.warn("Failed to load saved device connections:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "device-connections",
      JSON.stringify({
        devices: connectedDevices,
        history: connectionHistory,
      }),
    )
  }, [connectedDevices, connectionHistory])

  return {
    connectedDevices,
    connectionHistory,
    addDevice,
    removeDevice,
    updateDevice,
    getDevicesByType,
    isDeviceTypeConnected,
    disconnectAll,
    getConnectionSummary,
  }
}
