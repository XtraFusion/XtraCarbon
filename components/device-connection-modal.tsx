"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type {
  DeviceModalProps,
  AnyDevice,
  DroneDevice,
  IoTSensorDevice,
  MobileCameraDevice,
  ConnectionResult,
} from "@/types/device-types"
import {
  Bone as Drone,
  SunSnow as Sensor,
  Camera,
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Battery,
  Signal,
} from "lucide-react"

export function DeviceConnectionModal({ isOpen, onClose, onDeviceConnected, connectedDevices = [] }: DeviceModalProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("drone")
  const [connectionStates, setConnectionStates] = useState<
    Record<string, "idle" | "connecting" | "connected" | "error">
  >({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  // Mock drone models for demonstration
  const droneModels = ["DJI Mini 3 Pro", "DJI Air 2S", "Autel EVO Lite+", "Parrot Anafi", "Skydio 2+"]

  // Mock IoT sensor types
  const sensorTypes = [
    "Temperature Sensor",
    "Humidity Sensor",
    "Air Quality Monitor",
    "Motion Detector",
    "Light Sensor",
  ]

  /**
   * Simulates drone connection with mock API call
   */
  const connectDrone = async (model: string, deviceName: string): Promise<ConnectionResult> => {
    const deviceId = `drone-${Date.now()}`
    setConnectionStates((prev) => ({ ...prev, [deviceId]: "connecting" }))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock connection success/failure (90% success rate)
      const success = Math.random() > 0.1

      if (success) {
        const droneDevice: DroneDevice = {
          id: deviceId,
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

        setConnectionStates((prev) => ({ ...prev, [deviceId]: "connected" }))
        return { success: true, device: droneDevice }
      } else {
        setConnectionStates((prev) => ({ ...prev, [deviceId]: "error" }))
        return { success: false, error: "Failed to establish connection with drone" }
      }
    } catch (error) {
      setConnectionStates((prev) => ({ ...prev, [deviceId]: "error" }))
      return { success: false, error: "Connection timeout" }
    }
  }

  /**
   * Simulates IoT sensor detection and connection
   */
  const connectIoTSensor = async (sensorType: string, deviceName: string): Promise<ConnectionResult> => {
    const deviceId = `sensor-${Date.now()}`
    setConnectionStates((prev) => ({ ...prev, [deviceId]: "connecting" }))

    try {
      // Simulate sensor detection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const success = Math.random() > 0.15 // 85% success rate

      if (success) {
        // Generate mock sensor readings based on type
        const generateReadings = (type: string) => {
          switch (type.toLowerCase()) {
            case "temperature sensor":
              return { temperature: Math.round((Math.random() * 40 + 10) * 10) / 10 }
            case "humidity sensor":
              return { humidity: Math.round(Math.random() * 100) }
            case "air quality monitor":
              return {
                pm25: Math.round(Math.random() * 50),
                co2: Math.round(Math.random() * 1000 + 400),
              }
            case "motion detector":
              return { motion: Math.random() > 0.5 ? 1 : 0 }
            case "light sensor":
              return { lux: Math.round(Math.random() * 1000) }
            default:
              return { value: Math.round(Math.random() * 100) }
          }
        }

        const sensorDevice: IoTSensorDevice = {
          id: deviceId,
          name: deviceName || `${sensorType}`,
          type: "iot-sensor",
          status: "connected",
          lastConnected: new Date(),
          metadata: {
            sensorType,
            readings: generateReadings(sensorType),
            units: sensorType.includes("Temperature")
              ? { temperature: "°C" }
              : sensorType.includes("Humidity")
                ? { humidity: "%" }
                : {},
            calibrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          },
        }

        setConnectionStates((prev) => ({ ...prev, [deviceId]: "connected" }))
        return { success: true, device: sensorDevice }
      } else {
        setConnectionStates((prev) => ({ ...prev, [deviceId]: "error" }))
        return { success: false, error: "Sensor not detected or connection failed" }
      }
    } catch (error) {
      setConnectionStates((prev) => ({ ...prev, [deviceId]: "error" }))
      return { success: false, error: "Sensor connection error" }
    }
  }

  /**
   * Handles mobile camera connection using browser Camera API
   */
  const connectMobileCamera = async (): Promise<ConnectionResult> => {
    const deviceId = `camera-${Date.now()}`
    setConnectionStates((prev) => ({ ...prev, [deviceId]: "connecting" }))

    try {
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      setCameraStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const cameraDevice: MobileCameraDevice = {
        id: deviceId,
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

      setConnectionStates((prev) => ({ ...prev, [deviceId]: "connected" }))
      return { success: true, device: cameraDevice }
    } catch (error) {
      setConnectionStates((prev) => ({ ...prev, [deviceId]: "error" }))
      return {
        success: false,
        error: error instanceof Error ? error.message : "Camera access denied or not available",
      }
    }
  }

  /**
   * Captures photo from connected camera
   */
  const capturePhoto = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    return canvas.toDataURL("image/jpeg", 0.8)
  }

  /**
   * Handles device connection based on type
   */
  const handleConnect = async (deviceType: "drone" | "iot-sensor" | "mobile-camera", formData: any) => {
    let result: ConnectionResult

    switch (deviceType) {
      case "drone":
        result = await connectDrone(formData.model, formData.name)
        break
      case "iot-sensor":
        result = await connectIoTSensor(formData.sensorType, formData.name)
        break
      case "mobile-camera":
        result = await connectMobileCamera()
        break
      default:
        result = { success: false, error: "Unknown device type" }
    }

    if (result.success && result.device) {
      onDeviceConnected(result.device)
      toast({
        title: "Device Connected",
        description: `${result.device.name} has been successfully connected.`,
      })
    } else {
      toast({
        title: "Connection Failed",
        description: result.error || "Failed to connect device",
        variant: "destructive",
      })
    }
  }

  /**
   * Cleanup camera stream when modal closes
   */
  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    onClose()
  }

  /**
   * Renders connection status badge
   */
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      connecting: { icon: Loader2, color: "bg-yellow-500", text: "Connecting..." },
      connected: { icon: CheckCircle, color: "bg-green-500", text: "Connected" },
      error: { icon: AlertCircle, color: "bg-red-500", text: "Error" },
      idle: { icon: WifiOff, color: "bg-gray-500", text: "Disconnected" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle
    const Icon = config.icon

    return (
      <Badge variant="outline" className={`${config.color} text-white border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Connect Device
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="drone" className="flex items-center gap-2">
              <Drone className="w-4 h-4" />
              Drone
            </TabsTrigger>
            <TabsTrigger value="iot-sensor" className="flex items-center gap-2">
              <Sensor className="w-4 h-4" />
              IoT Sensor
            </TabsTrigger>
            <TabsTrigger value="mobile-camera" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Mobile Camera
            </TabsTrigger>
          </TabsList>

          {/* Drone Connection Tab */}
          <TabsContent value="drone" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Drone className="w-5 h-5" />
                  Connect Drone
                </CardTitle>
                <CardDescription>
                  Connect to your drone via API endpoint or select from available devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DroneConnectionForm
                  onConnect={(formData) => handleConnect("drone", formData)}
                  connectionStates={connectionStates}
                  connectedDevices={connectedDevices.filter((d) => d.type === "drone")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* IoT Sensor Connection Tab */}
          <TabsContent value="iot-sensor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sensor className="w-5 h-5" />
                  Connect IoT Sensor
                </CardTitle>
                <CardDescription>Detect and connect to IoT sensors or add manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <IoTSensorConnectionForm
                  onConnect={(formData) => handleConnect("iot-sensor", formData)}
                  connectionStates={connectionStates}
                  connectedDevices={connectedDevices.filter((d) => d.type === "iot-sensor")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile Camera Connection Tab */}
          <TabsContent value="mobile-camera" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Connect Mobile Camera
                </CardTitle>
                <CardDescription>Access device camera for photo capture and data collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MobileCameraConnectionForm
                  onConnect={() => handleConnect("mobile-camera", {})}
                  connectionStates={connectionStates}
                  connectedDevices={connectedDevices.filter((d) => d.type === "mobile-camera")}
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  capturePhoto={capturePhoto}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Connected Devices Summary */}
        {connectedDevices.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Currently Connected Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {connectedDevices.map((device) => (
                  <Badge key={device.id} variant="secondary" className="flex items-center gap-1">
                    {device.type === "drone" && <Drone className="w-3 h-3" />}
                    {device.type === "iot-sensor" && <Sensor className="w-3 h-3" />}
                    {device.type === "mobile-camera" && <Camera className="w-3 h-3" />}
                    {device.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Individual connection form components
function DroneConnectionForm({
  onConnect,
  connectionStates,
  connectedDevices,
}: {
  onConnect: (data: any) => void
  connectionStates: Record<string, string>
  connectedDevices: AnyDevice[]
}) {
  const [selectedModel, setSelectedModel] = useState("")
  const [deviceName, setDeviceName] = useState("")

  const droneModels = ["DJI Mini 3 Pro", "DJI Air 2S", "Autel EVO Lite+", "Parrot Anafi", "Skydio 2+"]

  const isConnecting = Object.values(connectionStates).includes("connecting")
  const hasConnectedDrone = connectedDevices.length > 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="drone-model">Drone Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select drone model" />
            </SelectTrigger>
            <SelectContent>
              {droneModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="drone-name">Device Name (Optional)</Label>
          <Input
            id="drone-name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="My Drone"
          />
        </div>
      </div>

      {connectedDevices.map((device) => (
        <Card key={device.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Drone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-muted-foreground">
                  {device.metadata?.model} • Battery: {device.metadata?.batteryLevel}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4" />
              <span className="text-sm">{device.metadata?.batteryLevel}%</span>
              <Signal className="w-4 h-4" />
              <span className="text-sm">{device.metadata?.signalStrength}%</span>
            </div>
          </div>
        </Card>
      ))}

      <Button
        onClick={() => onConnect({ model: selectedModel, name: deviceName })}
        disabled={!selectedModel || isConnecting || hasConnectedDrone}
        className="w-full"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : hasConnectedDrone ? (
          "Drone Already Connected"
        ) : (
          "Connect Drone"
        )}
      </Button>
    </div>
  )
}

function IoTSensorConnectionForm({
  onConnect,
  connectionStates,
  connectedDevices,
}: {
  onConnect: (data: any) => void
  connectionStates: Record<string, string>
  connectedDevices: AnyDevice[]
}) {
  const [selectedSensorType, setSelectedSensorType] = useState("")
  const [deviceName, setDeviceName] = useState("")

  const sensorTypes = [
    "Temperature Sensor",
    "Humidity Sensor",
    "Air Quality Monitor",
    "Motion Detector",
    "Light Sensor",
  ]

  const isConnecting = Object.values(connectionStates).includes("connecting")

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sensor-type">Sensor Type</Label>
          <Select value={selectedSensorType} onValueChange={setSelectedSensorType}>
            <SelectTrigger>
              <SelectValue placeholder="Select sensor type" />
            </SelectTrigger>
            <SelectContent>
              {sensorTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sensor-name">Device Name (Optional)</Label>
          <Input
            id="sensor-name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Living Room Sensor"
          />
        </div>
      </div>

      {connectedDevices.map((device) => (
        <Card key={device.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sensor className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-muted-foreground">{device.metadata?.sensorType}</p>
              </div>
            </div>
            <div className="text-right">
              {device.metadata?.readings &&
                Object.entries(device.metadata.readings).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    {key}: {value}
                    {device.metadata?.units?.[key] || ""}
                  </p>
                ))}
            </div>
          </div>
        </Card>
      ))}

      <Button
        onClick={() => onConnect({ sensorType: selectedSensorType, name: deviceName })}
        disabled={!selectedSensorType || isConnecting}
        className="w-full"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Detecting Sensor...
          </>
        ) : (
          "Connect Sensor"
        )}
      </Button>
    </div>
  )
}

function MobileCameraConnectionForm({
  onConnect,
  connectionStates,
  connectedDevices,
  videoRef,
  canvasRef,
  capturePhoto,
}: {
  onConnect: () => void
  connectionStates: Record<string, string>
  connectedDevices: AnyDevice[]
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  capturePhoto: () => string | null
}) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const { toast } = useToast()

  const isConnecting = Object.values(connectionStates).includes("connecting")
  const hasConnectedCamera = connectedDevices.length > 0

  const handleCapturePhoto = () => {
    const photoData = capturePhoto()
    if (photoData) {
      setCapturedPhoto(photoData)
      toast({
        title: "Photo Captured",
        description: "Photo has been successfully captured from camera.",
      })
    }
  }

  return (
    <div className="space-y-4">
      {connectedDevices.map((device) => (
        <Card key={device.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-muted-foreground">
                  {device.metadata?.resolution} • Photos: {device.metadata?.photoCount}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500 text-white border-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 bg-black rounded-lg object-cover"
              />
              <Button onClick={handleCapturePhoto} className="absolute bottom-2 right-2" size="sm">
                <Camera className="w-4 h-4 mr-1" />
                Capture
              </Button>
            </div>

            {capturedPhoto && (
              <div className="space-y-2">
                <Label>Last Captured Photo</Label>
                <img
                  src={capturedPhoto || "/placeholder.svg"}
                  alt="Captured"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </Card>
      ))}

      <canvas ref={canvasRef} className="hidden" />

      <Button onClick={onConnect} disabled={isConnecting || hasConnectedCamera} className="w-full">
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Requesting Camera Access...
          </>
        ) : hasConnectedCamera ? (
          "Camera Already Connected"
        ) : (
          "Connect Camera"
        )}
      </Button>
    </div>
  )
}
