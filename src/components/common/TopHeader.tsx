import React, { useState } from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { Shield, Eye, Video, AlertCircle, ChevronDown, User, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { UserRole } from '../../types/surveillance';

export const TopHeader: React.FC = () => {
  const {
    currentTime,
    currentDate,
    currentUserRole,
    setCurrentUserRole,
    cameras,
    isDemoMode,
    setIsDemoMode,
    triggerDemoIntrusion,
    isSimulatingScenario,
    simulationStepText,
    isAudioMuted,
    setIsAudioMuted
  } = useSurveillance();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const onlineCamerasCount = cameras.filter(c => c.status === 'LIVE').length;
  const offlineCamerasCount = cameras.filter(c => c.status === 'OFFLINE').length;

  const roles: UserRole[] = ['Administrator', 'Operator', 'Viewer'];

  return (
    <header className="h-16 bg-[#081120] border-b border-[#14284b] px-4 flex items-center justify-between select-none relative z-30">
      {/* Left: Brand & Tagline */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          {/* Stylized Sentinel Eye Logo */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Eye className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-xl font-bold tracking-wider text-white">
                ULTRON<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <div className="text-[11px] font-medium tracking-tight text-slate-400">
              AI-Powered Border Observation & Monitoring System
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-7 w-px bg-[#183158]" />

        {/* Tagline */}
        <div className="hidden xl:block">
          <div className="text-xs font-semibold tracking-wide text-cyan-400/95 font-tech">
            Smarter Surveillance.
          </div>
          <div className="text-xs font-semibold tracking-wide text-cyan-400/95 font-tech">
            Safer Borders.
          </div>
        </div>
      </div>

      {/* Center: System Telemetry Badges */}
      <div className="hidden md:flex items-center gap-2.5">
        {/* System Operational */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1a33] border border-[#163866] text-xs font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>System Operational</span>
        </div>

        {/* Cameras Online */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1a33] border border-[#163866] text-xs font-medium text-slate-300">
          <Video className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono-num text-white font-semibold">{onlineCamerasCount + 41}</span>
          <span className="text-slate-400">Cameras Online</span>
        </div>

        {/* Cameras Offline */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1a33] border border-[#163866] text-xs font-medium text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span className="font-mono-num text-white font-semibold">{offlineCamerasCount + 1}</span>
          <span className="text-slate-400">Cameras Offline</span>
        </div>

        {/* Simulation step prompt if running */}
        {isSimulatingScenario && simulationStepText && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{simulationStepText}</span>
          </div>
        )}
      </div>

      {/* Right: Date, Clock, Operator Controls */}
      <div className="flex items-center gap-3">
        {/* Trigger Demo Simulation Button */}
        <button
          onClick={triggerDemoIntrusion}
          disabled={isSimulatingScenario}
          title="Trigger a realistic border intrusion detection sequence"
          className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all flex items-center gap-1.5 ${
            isSimulatingScenario
              ? 'bg-amber-600/20 border-amber-500/50 text-amber-300 cursor-not-allowed'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Simulate Intrusion</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="p-1.5 text-slate-400 hover:text-white rounded-md bg-[#0a1a33] border border-[#163866] transition-colors"
          title={isAudioMuted ? 'Unmute Audio Alarms' : 'Mute Audio Alarms'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Date */}
        <div className="hidden sm:block text-xs font-medium text-slate-300 px-2 py-1">
          {currentDate}
        </div>

        {/* Live Clock */}
        <div className="px-2.5 py-1 rounded bg-[#071326] border border-[#163866] font-mono-num text-sm font-semibold tracking-wider text-cyan-300 shadow-inner">
          {currentTime}
        </div>

        {/* Operator Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded bg-[#0a1a33] hover:bg-[#0f2447] border border-[#163866] text-xs font-medium text-slate-200 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center">
              <User className="w-3 h-3 text-cyan-300" />
            </div>
            <span>{currentUserRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-[#0a1830] border border-[#1a3d6e] shadow-2xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 tracking-wider border-b border-[#142d54]">
                Switch Operator Role
              </div>
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentUserRole(role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#122b54] transition-colors ${
                    currentUserRole === role ? 'text-cyan-400 font-semibold bg-[#0f2344]' : 'text-slate-300'
                  }`}
                >
                  <span>{role}</span>
                  {currentUserRole === role && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
