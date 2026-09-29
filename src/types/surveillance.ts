export type Severity = 'CRITICAL' | 'WARNING' | 'NORMAL' | 'INFO';

export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';

export type DetectionClass = 'PERSON' | 'VEHICLE' | 'TAMPERING' | 'UNATTENDED_OBJECT' | 'ANIMAL' | 'DRONE' | 'WEAPON';

export type ZoneSecurityStatus = 'Normal' | 'Intrusion' | 'Suspicious' | 'High Alert';

export type UserRole = 'Administrator' | 'Operator' | 'Viewer';

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  color?: string;
  trackId?: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  sector: string;
  status: 'LIVE' | 'OFFLINE' | 'DEGRADED';
  fps: number;
  resolution: string;
  latencyMs: number;
  zoneId: string;
  protocol: 'RTSP' | 'WEBRTC' | 'HLS' | 'DEMO';
  lastSeen: string;
  detections: BoundingBox[];
  feedType: 'desert' | 'river' | 'forest' | 'checkpoint' | 'hillside' | 'fence';
  hasVirtualFence?: boolean;
}

export interface Detection {
  id: string;
  cameraId: string;
  cameraName: string;
  type: DetectionClass;
  confidence: number;
  trackId: string;
  timestamp: string;
  location: string;
  zoneId: string;
  bbox: BoundingBox;
}

export interface AuditItem {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  note?: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  status: AlertStatus;
  cameraId: string;
  cameraName: string;
  zoneId: string;
  zoneName: string;
  location: string;
  timestamp: string;
  confidence: number;
  detectionType: DetectionClass;
  trackId?: string;
  thumbnailUrl?: string;
  description: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  assignedPatrol?: string;
  auditTrail: AuditItem[];
}

export interface Zone {
  id: string;
  name: string;
  status: ZoneSecurityStatus;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  cameraIds: string[];
  activeAlertCount: number;
  rules: ZoneRule[];
  coordinates: { x: number; y: number }[];
}

export interface ZoneRule {
  id: string;
  name: string;
  targetClass: DetectionClass;
  minConfidence: number;
  triggerCondition: 'ZONE_ENTRY' | 'VIRTUAL_FENCE_CROSS' | 'LOITERING' | 'TAMPERING';
  dwellSeconds?: number;
  action: 'GENERATE_CRITICAL_ALERT' | 'GENERATE_WARNING' | 'NOTIFY_PATROL';
  enabled: boolean;
}

export interface DetectionMetrics {
  humansDetected: number;
  humansTrend: number;
  humansSparkline: number[];
  
  vehiclesDetected: number;
  vehiclesTrend: number;
  vehiclesSparkline: number[];
  
  intrusions: number;
  intrusionsTrend: number;
  intrusionsSparkline: number[];
  
  tampering: number;
  tamperingTrend: number;
  tamperingSparkline: number[];
  
  unattendedObjects: number;
  unattendedTrend: number;
  unattendedSparkline: number[];
  
  systemHealth: string;
  systemHealthPercent: number;
  systemSparkline: number[];
}

export interface SystemStatusData {
  yoloEngine: boolean;
  byteTrack: boolean;
  eventEngine: boolean;
  database: boolean;
  webSocket: boolean;
  cameraStream: boolean;
  gpuUsage: number;
  cpuUsage: number;
  memoryUsage: number;
  fps: number;
  latencyMs: number;
  aiMode: 'DEMO' | 'LIVE';
}
