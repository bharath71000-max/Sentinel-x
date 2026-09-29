import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Camera,
  Alert,
  Zone,
  DetectionMetrics,
  SystemStatusData,
  UserRole,
  DetectionClass,
  Severity,
  BoundingBox
} from '../types/surveillance';

interface SurveillanceContextType {
  // Navigation & Page State
  activePage: string;
  setActivePage: (page: string) => void;
  
  // Real-time clock & date
  currentTime: string;
  currentDate: string;
  
  // User profile
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  
  // Cameras
  cameras: Camera[];
  selectedCamera: Camera | null;
  setSelectedCamera: (cam: Camera | null) => void;
  updateCameraStatus: (id: string, status: 'LIVE' | 'OFFLINE' | 'DEGRADED') => void;
  
  // Alerts & Events
  alerts: Alert[];
  criticalPopupAlert: Alert | null;
  setCriticalPopupAlert: (alert: Alert | null) => void;
  selectedAlert: Alert | null;
  setSelectedAlert: (alert: Alert | null) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, note?: string) => void;
  markFalsePositive: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  
  // Zones
  zones: Zone[];
  selectedZone: Zone | null;
  setSelectedZone: (zone: Zone | null) => void;
  updateZoneStatus: (zoneId: string, status: Zone['status']) => void;
  saveZoneRule: (zoneId: string, rule: any) => void;
  
  // Analytics & Summary Metrics
  metrics: DetectionMetrics;
  
  // System Health
  systemStatus: SystemStatusData;
  setSystemStatus: React.Dispatch<React.SetStateAction<SystemStatusData>>;
  
  // Demo Mode & Simulation
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  isSimulatingScenario: boolean;
  simulationStepText: string | null;
  triggerDemoIntrusion: () => void;
  
  // Sound effects
  isAudioMuted: boolean;
  setIsAudioMuted: (val: boolean) => void;
}

const SurveillanceContext = createContext<SurveillanceContextType | undefined>(undefined);

// Initial realistic camera configurations matching the reference screenshot
const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'CAM-01',
    name: 'North Border (Sector A)',
    location: 'North Border',
    sector: 'Sector A',
    status: 'LIVE',
    fps: 30,
    resolution: '1920×1080',
    latencyMs: 42,
    zoneId: 'ZONE-A',
    protocol: 'RTSP',
    lastSeen: '22:31:08',
    feedType: 'desert',
    detections: [
      {
        id: 'det-01-1',
        label: 'PERIMETER SECURE',
        confidence: 99,
        x: 10,
        y: 12,
        width: 80,
        height: 75,
        color: '#10b981'
      }
    ]
  },
  {
    id: 'CAM-02',
    name: 'River Side (Sector B)',
    location: 'River Side',
    sector: 'Sector B',
    status: 'LIVE',
    fps: 30,
    resolution: '1920×1080',
    latencyMs: 38,
    zoneId: 'ZONE-B',
    protocol: 'RTSP',
    lastSeen: '22:30:52',
    feedType: 'river',
    detections: [
      {
        id: 'det-02-1',
        label: 'PERSON 94%',
        confidence: 94,
        x: 44,
        y: 28,
        width: 14,
        height: 48,
        color: '#ef4444',
        trackId: 'TRK-1024'
      }
    ]
  },
  {
    id: 'CAM-03',
    name: 'Forest Path (Sector C)',
    location: 'Forest Path',
    sector: 'Sector C',
    status: 'LIVE',
    fps: 30,
    resolution: '1920×1080',
    latencyMs: 45,
    zoneId: 'ZONE-C',
    protocol: 'RTSP',
    lastSeen: '22:30:41',
    feedType: 'forest',
    detections: [
      {
        id: 'det-03-1',
        label: 'VEHICLE 87%',
        confidence: 87,
        x: 42,
        y: 35,
        width: 24,
        height: 38,
        color: '#f59e0b',
        trackId: 'TRK-0891'
      }
    ]
  },
  {
    id: 'CAM-04',
    name: 'Check Post (Sector D)',
    location: 'Check Post',
    sector: 'Sector D',
    status: 'LIVE',
    fps: 30,
    resolution: '1920×1080',
    latencyMs: 35,
    zoneId: 'ZONE-D',
    protocol: 'RTSP',
    lastSeen: '22:30:28',
    feedType: 'checkpoint',
    hasVirtualFence: true,
    detections: [
      {
        id: 'det-04-1',
        label: 'TAMPERING 91%',
        confidence: 91,
        x: 35,
        y: 30,
        width: 26,
        height: 52,
        color: '#ef4444',
        trackId: 'TRK-1042'
      }
    ]
  },
  {
    id: 'CAM-05',
    name: 'Hillside (Sector E)',
    location: 'Hillside',
    sector: 'Sector E',
    status: 'LIVE',
    fps: 30,
    resolution: '1920×1080',
    latencyMs: 50,
    zoneId: 'ZONE-E',
    protocol: 'RTSP',
    lastSeen: '22:30:17',
    feedType: 'hillside',
    detections: [
      {
        id: 'det-05-1',
        label: 'PERSONS 78%',
        confidence: 78,
        x: 48,
        y: 42,
        width: 32,
        height: 36,
        color: '#06b6d4',
        trackId: 'TRK-0677'
      }
    ]
  },
  {
    id: 'CAM-06',
    name: 'Border Fence (Sector F)',
    location: 'Border Fence',
    sector: 'Sector F',
    status: 'OFFLINE',
    fps: 0,
    resolution: '1920×1080',
    latencyMs: 0,
    zoneId: 'ZONE-F',
    protocol: 'RTSP',
    lastSeen: '--:--:--',
    feedType: 'fence',
    detections: []
  }
];

const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-1094',
    title: 'Intrusion Detected',
    severity: 'CRITICAL',
    status: 'NEW',
    cameraId: 'CAM-04',
    cameraName: 'Check Post (Sector D)',
    zoneId: 'ZONE-A',
    zoneName: 'Border Zone A',
    location: 'Border Zone A · CAM-04',
    timestamp: '22:31:08',
    confidence: 94,
    detectionType: 'PERSON',
    trackId: 'TRK-1024',
    description: 'Person detected crossing virtual tripwire fence toward restricted military compound.',
    auditTrail: [
      { id: 'aud-1', timestamp: '22:31:08', action: 'Alert generated by YOLO-v11 / ByteTrack engine', user: 'SYSTEM' },
      { id: 'aud-2', timestamp: '22:31:15', action: 'Visual notification rendered on Operator console', user: 'SYSTEM' }
    ]
  },
  {
    id: 'ALT-1093',
    title: 'Camera Tampering',
    severity: 'WARNING',
    status: 'NEW',
    cameraId: 'CAM-04',
    cameraName: 'Check Post (Sector D)',
    zoneId: 'ZONE-D',
    zoneName: 'Border Zone D',
    location: 'Border Zone D · CAM-04',
    timestamp: '22:29:42',
    confidence: 91,
    detectionType: 'TAMPERING',
    trackId: 'TRK-1042',
    description: 'Optical occlusion or sudden lens angle displacement detected.',
    auditTrail: [
      { id: 'aud-3', timestamp: '22:29:42', action: 'Tampering anomaly flagged', user: 'SYSTEM' }
    ]
  },
  {
    id: 'ALT-1092',
    title: 'Unattended Object',
    severity: 'WARNING',
    status: 'NEW',
    cameraId: 'CAM-07',
    cameraName: 'West Perimeter (Sector G)',
    zoneId: 'ZONE-C',
    zoneName: 'Border Zone C',
    location: 'Border Zone C · CAM-07',
    timestamp: '22:27:15',
    confidence: 88,
    detectionType: 'UNATTENDED_OBJECT',
    trackId: 'OBJ-049',
    description: 'Suspicious backpack/container stationary for over 7 minutes without owner in proximity.',
    auditTrail: [
      { id: 'aud-4', timestamp: '22:27:15', action: 'Static object timer exceeded 420 seconds', user: 'SYSTEM' }
    ]
  },
  {
    id: 'ALT-1091',
    title: 'Vehicle Anomaly',
    severity: 'WARNING',
    status: 'ACKNOWLEDGED',
    cameraId: 'CAM-03',
    cameraName: 'Forest Path (Sector C)',
    zoneId: 'ZONE-B',
    zoneName: 'Border Zone B',
    location: 'Border Zone B · CAM-03',
    timestamp: '22:24:36',
    confidence: 87,
    detectionType: 'VEHICLE',
    trackId: 'TRK-0891',
    description: 'Unregistered 4x4 vehicle traveling without transponder on restricted patrol route.',
    acknowledgedAt: '22:25:10',
    acknowledgedBy: 'Operator',
    auditTrail: [
      { id: 'aud-5', timestamp: '22:24:36', action: 'Anomaly flagged', user: 'SYSTEM' },
      { id: 'aud-6', timestamp: '22:25:10', action: 'Acknowledged and radioed Sector B patrol unit', user: 'Operator' }
    ]
  },
  {
    id: 'ALT-1090',
    title: 'Human Detection',
    severity: 'INFO',
    status: 'ACKNOWLEDGED',
    cameraId: 'CAM-05',
    cameraName: 'Hillside (Sector E)',
    zoneId: 'ZONE-E',
    zoneName: 'Border Zone E',
    location: 'Border Zone E · CAM-05',
    timestamp: '22:20:11',
    confidence: 78,
    detectionType: 'PERSON',
    trackId: 'TRK-0677',
    description: 'Multiple figures traversing high ridgeline in Sector E.',
    acknowledgedAt: '22:21:05',
    acknowledgedBy: 'Operator',
    auditTrail: [
      { id: 'aud-7', timestamp: '22:20:11', action: 'Human cluster detected', user: 'SYSTEM' }
    ]
  },
  {
    id: 'ALT-1089',
    title: 'System Health Alert',
    severity: 'NORMAL',
    status: 'ACKNOWLEDGED',
    cameraId: 'CAM-06',
    cameraName: 'Border Fence (Sector F)',
    zoneId: 'ZONE-F',
    zoneName: 'Border Zone F',
    location: 'CAM-06 (Offline)',
    timestamp: '22:18:03',
    confidence: 100,
    detectionType: 'TAMPERING',
    description: 'RTSP video stream lost connection with edge media gateway.',
    acknowledgedAt: '22:19:00',
    acknowledgedBy: 'Operator',
    auditTrail: [
      { id: 'aud-8', timestamp: '22:18:03', action: 'Heartbeat ping timeout (3 retries)', user: 'SYSTEM' }
    ]
  }
];

const INITIAL_ZONES: Zone[] = [
  {
    id: 'ZONE-A',
    name: 'Zone A',
    status: 'High Alert',
    threatLevel: 'Critical',
    cameraIds: ['CAM-01', 'CAM-04'],
    activeAlertCount: 2,
    rules: [
      {
        id: 'rule-za-1',
        name: 'Zone A Perimeter Intrusion',
        targetClass: 'PERSON',
        minConfidence: 70,
        triggerCondition: 'VIRTUAL_FENCE_CROSS',
        action: 'GENERATE_CRITICAL_ALERT',
        enabled: true
      },
      {
        id: 'rule-za-2',
        name: 'Checkpost Tampering Guard',
        targetClass: 'TAMPERING',
        minConfidence: 80,
        triggerCondition: 'TAMPERING',
        action: 'GENERATE_CRITICAL_ALERT',
        enabled: true
      }
    ],
    coordinates: [{ x: 30, y: 15 }, { x: 55, y: 15 }, { x: 50, y: 40 }, { x: 25, y: 35 }]
  },
  {
    id: 'ZONE-B',
    name: 'Zone B',
    status: 'Normal',
    threatLevel: 'Low',
    cameraIds: ['CAM-02'],
    activeAlertCount: 0,
    rules: [],
    coordinates: [{ x: 55, y: 20 }, { x: 80, y: 25 }, { x: 75, y: 55 }, { x: 50, y: 45 }]
  },
  {
    id: 'ZONE-C',
    name: 'Zone C',
    status: 'Suspicious',
    threatLevel: 'Medium',
    cameraIds: ['CAM-03', 'CAM-07'],
    activeAlertCount: 1,
    rules: [],
    coordinates: [{ x: 45, y: 50 }, { x: 70, y: 55 }, { x: 65, y: 80 }, { x: 40, y: 75 }]
  },
  {
    id: 'ZONE-D',
    name: 'Zone D',
    status: 'Normal',
    threatLevel: 'Low',
    cameraIds: ['CAM-04'],
    activeAlertCount: 0,
    rules: [],
    coordinates: [{ x: 15, y: 45 }, { x: 40, y: 40 }, { x: 35, y: 75 }, { x: 10, y: 70 }]
  },
  {
    id: 'ZONE-E',
    name: 'Zone E',
    status: 'Normal',
    threatLevel: 'Low',
    cameraIds: ['CAM-05'],
    activeAlertCount: 0,
    rules: [],
    coordinates: [{ x: 5, y: 20 }, { x: 25, y: 20 }, { x: 20, y: 45 }, { x: 5, y: 40 }]
  },
  {
    id: 'ZONE-F',
    name: 'Zone F',
    status: 'Normal',
    threatLevel: 'Low',
    cameraIds: ['CAM-06'],
    activeAlertCount: 0,
    rules: [],
    coordinates: [{ x: 65, y: 75 }, { x: 90, y: 70 }, { x: 85, y: 95 }, { x: 60, y: 95 }]
  }
];

export const SurveillanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [currentTime, setCurrentTime] = useState<string>('22:31:08');
  const [currentDate, setCurrentDate] = useState<string>('27 Sep 2026');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Operator');
  
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [criticalPopupAlert, setCriticalPopupAlert] = useState<Alert | null>(INITIAL_ALERTS[0]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isSimulatingScenario, setIsSimulatingScenario] = useState<boolean>(false);
  const [simulationStepText, setSimulationStepText] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  
  const [metrics, setMetrics] = useState<DetectionMetrics>({
    humansDetected: 41,
    humansTrend: 12,
    humansSparkline: [22, 28, 30, 35, 33, 38, 41],
    
    vehiclesDetected: 28,
    vehiclesTrend: 8,
    vehiclesSparkline: [18, 20, 24, 23, 26, 25, 28],
    
    intrusions: 12,
    intrusionsTrend: 50,
    intrusionsSparkline: [4, 6, 7, 9, 8, 10, 12],
    
    tampering: 3,
    tamperingTrend: -25,
    tamperingSparkline: [5, 4, 4, 3, 4, 3, 3],
    
    unattendedObjects: 5,
    unattendedTrend: 67,
    unattendedSparkline: [1, 2, 2, 3, 4, 4, 5],
    
    systemHealth: 'OK',
    systemHealthPercent: 100,
    systemSparkline: [98, 99, 100, 99, 100, 100, 100]
  });
  
  const [systemStatus, setSystemStatus] = useState<SystemStatusData>({
    yoloEngine: true,
    byteTrack: true,
    eventEngine: true,
    database: true,
    webSocket: true,
    cameraStream: true,
    gpuUsage: 78,
    cpuUsage: 32,
    memoryUsage: 64,
    fps: 28.4,
    latencyMs: 42,
    aiMode: 'DEMO'
  });

  // Keep live clock ticking smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Format as HH:mm:ss
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update a camera status (e.g. test connection, bring online/offline)
  const updateCameraStatus = useCallback((id: string, status: 'LIVE' | 'OFFLINE' | 'DEGRADED') => {
    setCameras(prev =>
      prev.map(cam => {
        if (cam.id === id) {
          return {
            ...cam,
            status,
            fps: status === 'LIVE' ? 30 : status === 'DEGRADED' ? 12 : 0,
            latencyMs: status === 'LIVE' ? 35 : status === 'DEGRADED' ? 120 : 0,
            lastSeen: status === 'OFFLINE' ? '--:--:--' : currentTime
          };
        }
        return cam;
      })
    );
  }, [currentTime]);

  // Acknowledge alert and update audit trail
  const acknowledgeAlert = useCallback((alertId: string) => {
    const timestamp = currentTime;
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          const newAuditItem = {
            id: `aud-${Date.now()}`,
            timestamp,
            action: `Alert acknowledged by ${currentUserRole}`,
            user: currentUserRole
          };
          return {
            ...a,
            status: 'ACKNOWLEDGED',
            acknowledgedAt: timestamp,
            acknowledgedBy: currentUserRole,
            auditTrail: [...a.auditTrail, newAuditItem]
          };
        }
        return a;
      })
    );

    // If critical popup was for this alert, mark it acknowledged as well
    setCriticalPopupAlert(prev => {
      if (prev && prev.id === alertId) {
        return {
          ...prev,
          status: 'ACKNOWLEDGED',
          acknowledgedAt: timestamp,
          acknowledgedBy: currentUserRole
        };
      }
      return prev;
    });

    // Also update selectedAlert if open
    setSelectedAlert(prev => {
      if (prev && prev.id === alertId) {
        return {
          ...prev,
          status: 'ACKNOWLEDGED',
          acknowledgedAt: timestamp,
          acknowledgedBy: currentUserRole,
          auditTrail: [
            ...prev.auditTrail,
            {
              id: `aud-${Date.now()}`,
              timestamp,
              action: `Alert acknowledged by ${currentUserRole}`,
              user: currentUserRole
            }
          ]
        };
      }
      return prev;
    });
  }, [currentTime, currentUserRole]);

  // Resolve alert
  const resolveAlert = useCallback((alertId: string, note = 'Threat neutralized. Perimeter confirmed secure.') => {
    const timestamp = currentTime;
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            status: 'RESOLVED',
            resolvedAt: timestamp,
            auditTrail: [
              ...a.auditTrail,
              {
                id: `aud-${Date.now()}`,
                timestamp,
                action: `Resolved: ${note}`,
                user: currentUserRole
              }
            ]
          };
        }
        return a;
      })
    );
    if (criticalPopupAlert?.id === alertId) {
      setCriticalPopupAlert(null);
    }
  }, [currentTime, currentUserRole, criticalPopupAlert]);

  // Mark False Positive
  const markFalsePositive = useCallback((alertId: string) => {
    const timestamp = currentTime;
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            status: 'FALSE_POSITIVE',
            auditTrail: [
              ...a.auditTrail,
              {
                id: `aud-${Date.now()}`,
                timestamp,
                action: 'Flagged as false positive by operator. AI model training feedback queued.',
                user: currentUserRole
              }
            ]
          };
        }
        return a;
      })
    );
    if (criticalPopupAlert?.id === alertId) {
      setCriticalPopupAlert(null);
    }
  }, [currentTime, currentUserRole, criticalPopupAlert]);

  // Escalate Alert
  const escalateAlert = useCallback((alertId: string) => {
    const timestamp = currentTime;
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            severity: 'CRITICAL',
            assignedPatrol: 'QRF Alpha Team (Sector D)',
            auditTrail: [
              ...a.auditTrail,
              {
                id: `aud-${Date.now()}`,
                timestamp,
                action: 'Escalated to High Priority. Dispatched Quick Reaction Force (QRF Alpha).',
                user: currentUserRole
              }
            ]
          };
        }
        return a;
      })
    );
  }, [currentTime, currentUserRole]);

  // Update Zone status
  const updateZoneStatus = useCallback((zoneId: string, status: Zone['status']) => {
    setZones(prev =>
      prev.map(z => {
        if (z.id === zoneId) {
          return { ...z, status };
        }
        return z;
      })
    );
  }, []);

  // Save Zone rule
  const saveZoneRule = useCallback((zoneId: string, rule: any) => {
    setZones(prev =>
      prev.map(z => {
        if (z.id === zoneId) {
          return {
            ...z,
            rules: [...z.rules.filter(r => r.id !== rule.id), rule]
          };
        }
        return z;
      })
    );
  }, []);

  // THE FULL 16-STEP DEMO INTRUSION SIMULATION FLOW
  const triggerDemoIntrusion = useCallback(() => {
    if (isSimulatingScenario) return;
    setIsSimulatingScenario(true);

    const newTrackId = `TRK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAlertId = `ALT-${Math.floor(2000 + Math.random() * 8000)}`;
    const stepTime = currentTime;

    // STEP 1 & 2: Person detected on CAM-04
    setSimulationStepText('1/5: CAM-04 YOLO-v11 detects person (94% confidence)...');
    
    setCameras(prev =>
      prev.map(cam => {
        if (cam.id === 'CAM-04') {
          return {
            ...cam,
            detections: [
              {
                id: `det-${Date.now()}`,
                label: 'PERSON 94%',
                confidence: 94,
                x: 48,
                y: 32,
                width: 18,
                height: 50,
                color: '#ef4444',
                trackId: newTrackId
              }
            ]
          };
        }
        return cam;
      })
    );

    // STEP 3: Tracking assigned
    setTimeout(() => {
      setSimulationStepText(`2/5: ByteTrack assigned ${newTrackId}. Moving toward Zone A virtual fence...`);
    }, 1200);

    // STEP 4: Virtual fence tripwire crossed -> INTRUSION DETECTED
    setTimeout(() => {
      setSimulationStepText('3/5: Virtual fence crossed! Rule triggered: INTRUSION DETECTED.');
      
      const newAlert: Alert = {
        id: newAlertId,
        title: 'Intrusion Detected',
        severity: 'CRITICAL',
        status: 'NEW',
        cameraId: 'CAM-04',
        cameraName: 'Check Post (Sector D)',
        zoneId: 'ZONE-A',
        zoneName: 'Border Zone A',
        location: 'Border Zone A · CAM-04',
        timestamp: stepTime,
        confidence: 94,
        detectionType: 'PERSON',
        trackId: newTrackId,
        description: `Unauthorized subject ${newTrackId} breached perimeter fence at Sector D Check Post.`,
        auditTrail: [
          { id: `aud-${Date.now()}-1`, timestamp: stepTime, action: `Target ${newTrackId} entered restricted zone`, user: 'SYSTEM' },
          { id: `aud-${Date.now()}-2`, timestamp: stepTime, action: 'Virtual fence rule breached -> Critical Intrusion generated', user: 'SYSTEM' },
          { id: `aud-${Date.now()}-3`, timestamp: stepTime, action: 'Visual & acoustic alarms dispatched to Operator console', user: 'SYSTEM' }
        ]
      };

      // Add to alerts list at top
      setAlerts(prev => [newAlert, ...prev]);

      // Pop up the critical modal
      setCriticalPopupAlert(newAlert);

      // Flash Zone A to High Alert
      setZones(prev =>
        prev.map(z => {
          if (z.id === 'ZONE-A') {
            return { ...z, status: 'High Alert', activeAlertCount: z.activeAlertCount + 1 };
          }
          return z;
        })
      );

      // Increment metrics
      setMetrics(prev => ({
        ...prev,
        humansDetected: prev.humansDetected + 1,
        humansSparkline: [...prev.humansSparkline.slice(1), prev.humansDetected + 1],
        intrusions: prev.intrusions + 1,
        intrusionsSparkline: [...prev.intrusionsSparkline.slice(1), prev.intrusions + 1]
      }));

      // Audio notification if not muted
      if (!isAudioMuted && typeof window !== 'undefined') {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        } catch (e) {
          // ignore audio restriction
        }
      }
    }, 2500);

    // STEP 5: Final state recorded
    setTimeout(() => {
      setSimulationStepText('4/5: Telemetry synced to Map, Alerts feed & AI Analytics.');
    }, 3800);

    setTimeout(() => {
      setSimulationStepText(null);
      setIsSimulatingScenario(false);
    }, 5000);
  }, [isSimulatingScenario, currentTime, isAudioMuted]);

  return (
    <SurveillanceContext.Provider
      value={{
        activePage,
        setActivePage,
        currentTime,
        currentDate,
        currentUserRole,
        setCurrentUserRole,
        cameras,
        selectedCamera,
        setSelectedCamera,
        updateCameraStatus,
        alerts,
        criticalPopupAlert,
        setCriticalPopupAlert,
        selectedAlert,
        setSelectedAlert,
        acknowledgeAlert,
        resolveAlert,
        markFalsePositive,
        escalateAlert,
        zones,
        selectedZone,
        setSelectedZone,
        updateZoneStatus,
        saveZoneRule,
        metrics,
        systemStatus,
        setSystemStatus,
        isDemoMode,
        setIsDemoMode,
        isSimulatingScenario,
        simulationStepText,
        triggerDemoIntrusion,
        isAudioMuted,
        setIsAudioMuted
      }}
    >
      {children}
    </SurveillanceContext.Provider>
  );
};

export const useSurveillance = () => {
  const context = useContext(SurveillanceContext);
  if (!context) {
    throw new Error('useSurveillance must be used within a SurveillanceProvider');
  }
  return context;
};
