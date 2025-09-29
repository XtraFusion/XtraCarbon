"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DeviceConnectionModal } from "@/components/device-connection-modal"
import { useDeviceConnections } from "@/lib/hooks/use-device-connections"
import type { AnyDevice } from "@/types/device-types"
import {
  Wifi,
  Plus,
  Trash2,
  Eye,
  MapPin,
  Camera,
  Bone as Drone,
  SunSnow as Sensor,
  Battery,
  Signal,
} from "lucide-react"

/**
 * Example form page demonstrating device connection modal integration
 * This represents a typical data collection form that benefits from device connectivity
 */
export default function DataCollectionForm() {
  // Form state
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    description: "",
    notes: "",
  })

  // Device connection state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { connectedDevices, addDevice, removeDevice, getConnectionSummary, getDevicesByType } = useDeviceConnections()

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submissionData = {
      ...formData,
      connectedDevices: connectedDevices.map((device) => ({
        id: device.id,
        name: device.name,
        type: device.type,
        metadata: device.metadata,
      })),
      submittedAt: new Date().toISOString(),
    }

    console.log("Form submitted with data:", submissionData)

    // Here you would typically send the data to your API
    alert("Form submitted successfully! Check console for details.")
  }

  // Handle device connection from modal
  const handleDeviceConnected = (device: AnyDevice) => {
    addDevice(device)
    setIsModalOpen(false)
  }

  // Get connection summary for display
  const connectionSummary = getConnectionSummary()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Data Collection Form</h1>
          <p className="text-muted-foreground">
            Collect field data with connected devices for enhanced accuracy and automation
          </p>
        </div>

        {/* Connection Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Device Connections
              <Badge variant="secondary" className="ml-auto">
                {connectionSummary.total} Connected
              </Badge>
            </CardTitle>
            <CardDescription>
              Connect devices to automatically populate form data and enhance data collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Drone className="w-4 h-4" />
                  {connectionSummary.drones} Drones
                </span>
                <span className="flex items-center gap-1">
                  <Sensor className="w-4 h-4" />
                  {connectionSummary.sensors} Sensors
                </span>
                <span className="flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  {connectionSummary.cameras} Cameras
                </span>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Connect Device
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Enter basic project details and connect devices for automated data collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={formData.projectName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                        placeholder="Environmental Survey 2024"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="San Francisco, CA"
                          required
                        />
                        {getDevicesByType("drone").length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={() => {
                              const drone = getDevicesByType("drone")[0]
                              if (drone.metadata?.location) {
                                setFormData((prev) => ({
                                  ...prev,
                                  location: `${drone.metadata.location.lat.toFixed(4)}, ${drone.metadata.location.lng.toFixed(4)}`,
                                }))
                              }
                            }}
                          >
                            <MapPin className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the data collection project..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional observations or notes..."
                      rows={2}
                    />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full">
                    Submit Data Collection Form
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Connected Devices Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connected Devices</CardTitle>
                <CardDescription>Manage your connected devices and view their status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectedDevices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wifi className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No devices connected</p>
                    <p className="text-xs">Click "Connect Device" to get started</p>
                  </div>
                ) : (
                  connectedDevices.map((device) => (
                    <DeviceCard key={device.id} device={device} onRemove={() => removeDevice(device.id)} />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Device Data Preview */}
            {connectedDevices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Data Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getDevicesByType("iot-sensor").map((sensor) => (
                    <div key={sensor.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{sensor.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Live
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {sensor.metadata?.readings &&
                          Object.entries(sensor.metadata.readings).map(([key, value]) => (
                            <div key={key} className="flex justify-between p-2 bg-muted rounded">
                              <span className="capitalize">{key}:</span>
                              <span className="font-mono">
                                {value}
                                {sensor.metadata?.units?.[key] || ""}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  {getDevicesByType("drone").map((drone) => (
                    <div key={drone.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{drone.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between p-2 bg-muted rounded">
                          <span>Battery:</span>
                          <span className="font-mono">{drone.metadata?.batteryLevel}%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded">
                          <span>Signal:</span>
                          <span className="font-mono">{drone.metadata?.signalStrength}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Device Connection Modal */}
        <DeviceConnectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDeviceConnected={handleDeviceConnected}
          connectedDevices={connectedDevices}
        />
      </div>
    </div>
  )
}

/**
 * Individual device card component for the connected devices panel
 */
function DeviceCard({
  device,
  onRemove,
}: {
  device: AnyDevice
  onRemove: () => void
}) {
  const getDeviceIcon = () => {
    switch (device.type) {
      case "drone":
        return <Drone className="w-4 h-4 text-blue-500" />
      case "iot-sensor":
        return <Sensor className="w-4 h-4 text-green-500" />
      case "mobile-camera":
        return <Camera className="w-4 h-4 text-purple-500" />
      default:
        return <Wifi className="w-4 h-4" />
    }
  }

  const getDeviceDetails = () => {
    switch (device.type) {
      case "drone":
        return (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Battery className="w-3 h-3" />
            {device.metadata?.batteryLevel}%
            <Signal className="w-3 h-3" />
            {device.metadata?.signalStrength}%
          </div>
        )
      case "iot-sensor":
        return <div className="text-xs text-muted-foreground">{device.metadata?.sensorType}</div>
      case "mobile-camera":
        return (
          <div className="text-xs text-muted-foreground">
            {device.metadata?.resolution} • {device.metadata?.photoCount} photos
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {getDeviceIcon()}
        <div>
          <p className="text-sm font-medium">{device.name}</p>
          {getDeviceDetails()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
          Connected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
