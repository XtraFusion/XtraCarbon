"use client"
import { Badge } from "@/components/ui/badge"
import type { AnyDevice } from "@/types/device-types"
import { CheckCircle, Loader2, AlertCircle, WifiOff } from "lucide-react"

interface DeviceStatusIndicatorProps {
  device: AnyDevice
  showDetails?: boolean
  size?: "sm" | "md" | "lg"
}

/**
 * Reusable component for displaying device connection status
 * Can be used throughout the application to show device states
 */
export function DeviceStatusIndicator({ device, showDetails = false, size = "md" }: DeviceStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (device.status) {
      case "connected":
        return {
          icon: CheckCircle,
          color: "bg-green-500 text-white border-green-500",
          text: "Connected",
          description: "Device is active and responding",
        }
      case "connecting":
        return {
          icon: Loader2,
          color: "bg-yellow-500 text-white border-yellow-500",
          text: "Connecting",
          description: "Establishing connection...",
        }
      case "error":
        return {
          icon: AlertCircle,
          color: "bg-red-500 text-white border-red-500",
          text: "Error",
          description: "Connection failed or device error",
        }
      default:
        return {
          icon: WifiOff,
          color: "bg-gray-500 text-white border-gray-500",
          text: "Disconnected",
          description: "Device is not connected",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size]

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size]

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={`${config.color} ${textSize}`}>
        <Icon className={`${iconSize} mr-1 ${device.status === "connecting" ? "animate-spin" : ""}`} />
        {config.text}
      </Badge>

      {showDetails && (
        <div className="text-xs text-muted-foreground">
          {config.description}
          {device.lastConnected && device.status === "connected" && (
            <span className="ml-2">• Last seen {formatTimeAgo(device.lastConnected)}</span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Helper function to format time ago
 */
function formatTimeAgo(date: Date): string {
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
