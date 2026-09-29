import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  Settings,
  Cpu,
  Shield,
  Video,
  Users,
  Bell,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Wifi
} from 'lucide-react';
import { UserRole } from '../types/surveillance';

export const SettingsView: React.FC = () => {
  const {
    currentUserRole,
    setCurrentUserRole,
    isDemoMode,
    setIsDemoMode,
    isAudioMuted,
    setIsAudioMuted,
    cameras,
    updateCameraStatus
  } = useSurveillance();

  const [activeTab, setActiveTab] = useState<'ai' | 'cameras' | 'rules' | 'roles' | 'system'>('ai');
  const [personConfidence, setPersonConfidence] = useState(70);
  const [vehicleConfidence, setVehicleConfidence] = useState(75);
  const [tamperingSensitivity, setTamperingSensitivity] = useState(85);
  const [byteTrackBuffer, setByteTrackBuffer] = useState(30);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const roles: { role: UserRole; title: string; desc: string }[] = [
    {
      role: 'Administrator',
      title: 'Administrator',
      desc: 'Full system privileges: Configure AI weights, edit RTSP pipelines, manage users, acknowledge & clear threats.'
    },
    {
      role: 'Operator',
      title: 'Operator',
      desc: 'Standard surveillance privileges: Monitor feeds, triage alerts, dispatch patrol teams, acknowledge threats.'
    },
    {
      role: 'Viewer',
      title: 'Viewer (Read-Only)',
      desc: 'Restricted view-only mode: Monitor live maps and CCTV feeds without dispatch or rule editing privileges.'
    }
  ];

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-w-[1920px] mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-tech text-base font-bold text-white tracking-wider">
              Ultron System Configuration
            </h2>
            <p className="text-xs text-slate-400">
              Manage AI computer vision inference parameters, virtual tripwire rules, and SOC operator roles
            </p>
          </div>
        </div>

        {/* Save feedback toast */}
        {showSavedToast && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-lg animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved & Applied to Edge</span>
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#081222] border border-[#14294d] text-xs">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'ai' ? 'bg-[#123e75] text-cyan-300 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI & Computer Vision</span>
        </button>

        <button
          onClick={() => setActiveTab('cameras')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'cameras' ? 'bg-[#123e75] text-cyan-300 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Camera Stream Service</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'roles' ? 'bg-[#123e75] text-cyan-300 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Role & RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'system' ? 'bg-[#123e75] text-cyan-300 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>General & Notifications</span>
        </button>
      </div>

      {/* Tab 1: AI & Computer Vision */}
      {activeTab === 'ai' && (
        <div className="p-5 rounded-xl bg-[#081222] border border-[#14294d] space-y-5 text-xs">
          <div className="border-b border-[#14294d] pb-3">
            <h3 className="font-tech text-sm font-bold text-white tracking-wider">
              YOLO-v11 Object Detection & ByteTrack Kalman Filter
            </h3>
            <p className="text-slate-400 mt-0.5">
              Tune confidence gates to minimize false alarms from wildlife or weather conditions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-[#060c18] border border-[#142749] space-y-3">
              <div>
                <div className="flex justify-between font-bold text-slate-200 mb-1">
                  <span>Person Detection Confidence Threshold</span>
                  <span className="font-mono text-cyan-400">{personConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={personConfidence}
                  onChange={e => setPersonConfidence(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500">
                  Detections below {personConfidence}% will be filtered out before rule engine processing.
                </span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-200 mb-1">
                  <span>Vehicle & Anomaly Threshold</span>
                  <span className="font-mono text-emerald-400">{vehicleConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={vehicleConfidence}
                  onChange={e => setVehicleConfidence(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <span className="text-[10px] text-slate-500">
                  Requires higher confidence for vehicle classification and ANPR transponder tagging.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#060c18] border border-[#142749] space-y-3">
              <div>
                <div className="flex justify-between font-bold text-slate-200 mb-1">
                  <span>Camera Tampering / Occlusion Sensitivity</span>
                  <span className="font-mono text-amber-400">{tamperingSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="99"
                  value={tamperingSensitivity}
                  onChange={e => setTamperingSensitivity(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <span className="text-[10px] text-slate-500">
                  Triggers warning when visual pixel deviation exceeds threshold between consecutive keyframes.
                </span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-200 mb-1">
                  <span>ByteTrack Trajectory Lookahead Buffer</span>
                  <span className="font-mono text-cyan-300">{byteTrackBuffer} frames</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={byteTrackBuffer}
                  onChange={e => setByteTrackBuffer(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500">
                  Number of frames to maintain Track ID persistence during temporary line-of-sight occlusion.
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#14294d]">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply AI Weights</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Cameras */}
      {activeTab === 'cameras' && (
        <div className="p-5 rounded-xl bg-[#081222] border border-[#14294d] space-y-4 text-xs">
          <div className="border-b border-[#14294d] pb-3">
            <h3 className="font-tech text-sm font-bold text-white tracking-wider">
              Camera Stream Service & RTSP Protocol Handlers
            </h3>
            <p className="text-slate-400 mt-0.5">
              Inspect video codecs, network bitrate, and hardware stream health
            </p>
          </div>

          <div className="space-y-2">
            {cameras.map(cam => (
              <div
                key={cam.id}
                className="p-3 rounded-lg bg-[#060c18] border border-[#142749] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        cam.status === 'LIVE' ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                    <span className="font-tech font-bold text-slate-100">{cam.id}</span>
                    <span className="text-slate-400">· {cam.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    rtsp://edge-gateway.ultron.local:554/live/{cam.id.toLowerCase()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-300">{cam.resolution}</span>
                  <span className="font-mono text-slate-400">{cam.fps} FPS</span>
                  <button
                    onClick={() =>
                      updateCameraStatus(cam.id, cam.status === 'LIVE' ? 'OFFLINE' : 'LIVE')
                    }
                    className="px-2.5 py-1 rounded bg-[#0e2447] hover:bg-cyan-600 text-cyan-300 hover:text-white font-medium transition-colors"
                  >
                    {cam.status === 'LIVE' ? 'Test Disconnect' : 'Reconnect Feed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Roles */}
      {activeTab === 'roles' && (
        <div className="p-5 rounded-xl bg-[#081222] border border-[#14294d] space-y-4 text-xs">
          <div className="border-b border-[#14294d] pb-3">
            <h3 className="font-tech text-sm font-bold text-white tracking-wider">
              Role-Based Access Control (RBAC)
            </h3>
            <p className="text-slate-400 mt-0.5">
              Select active operator profile for security clearance testing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {roles.map(r => {
              const isSelected = currentUserRole === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => setCurrentUserRole(r.role)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#102b4d] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-[#060c18] border-[#142749] hover:border-[#1c4178]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-tech text-sm font-bold text-white">{r.title}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{r.desc}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#163866] text-[10px] text-cyan-400 font-bold uppercase">
                    {isSelected ? '● CURRENT ACTIVE ROLE' : 'Click to Switch'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: System */}
      {activeTab === 'system' && (
        <div className="p-5 rounded-xl bg-[#081222] border border-[#14294d] space-y-4 text-xs">
          <div className="border-b border-[#14294d] pb-3">
            <h3 className="font-tech text-sm font-bold text-white tracking-wider">
              General System & Acoustic Notification Settings
            </h3>
          </div>

          <div className="space-y-3 max-w-xl">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#060c18] border border-[#142749]">
              <div>
                <div className="font-bold text-slate-200">Acoustic Intrusion Siren</div>
                <div className="text-[11px] text-slate-400">
                  Play audible synthesizer chime when critical severity alerts are dispatched
                </div>
              </div>
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`px-3 py-1 rounded font-bold transition-colors ${
                  !isAudioMuted
                    ? 'bg-cyan-600 text-white'
                    : 'bg-[#10274c] text-slate-400'
                }`}
              >
                {!isAudioMuted ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#060c18] border border-[#142749]">
              <div>
                <div className="font-bold text-slate-200">Simulation Engine Mode</div>
                <div className="text-[11px] text-slate-400">
                  Generate autonomous realistic target movement and detection events for demonstration
                </div>
              </div>
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`px-3 py-1 rounded font-bold transition-colors ${
                  isDemoMode
                    ? 'bg-cyan-600 text-white'
                    : 'bg-[#10274c] text-slate-400'
                }`}
              >
                {isDemoMode ? 'DEMO ACTIVE' : 'LIVE EDGE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
