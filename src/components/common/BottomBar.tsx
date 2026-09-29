import React from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { Video, MapPin, Bell, Settings, Activity, Cpu, Sparkles } from 'lucide-react';

export const BottomBar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    alerts,
    isDemoMode,
    setIsDemoMode,
    systemStatus,
    triggerDemoIntrusion,
    isSimulatingScenario
  } = useSurveillance();

  const newAlertsCount = alerts.filter(a => a.status === 'NEW').length;

  return (
    <footer className="h-9 bg-[#050c17] border-t border-[#122442] px-4 flex items-center justify-between text-xs select-none z-20">
      {/* Left: Branding & Subtitle */}
      <div className="flex items-center gap-3">
        <span className="font-tech font-bold text-slate-300 tracking-wider">
          Ultron
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 font-medium hidden sm:inline">
          AI Intelligence at the Border
        </span>

        {/* Demo Mode Toggle Badge */}
        <div className="ml-4 flex items-center gap-2 bg-[#09152a] px-2 py-0.5 rounded border border-[#16335e]">
          <span className="text-[10px] font-semibold text-slate-400">AI MODE:</span>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded transition-colors ${
              isDemoMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            }`}
          >
            {isDemoMode ? 'DEMO SIMULATION' : 'LIVE EDGE FEED'}
          </button>
        </div>
      </div>

      {/* Right: Quick shortcuts & hardware performance */}
      <div className="flex items-center gap-4">
        {/* Hardware telemetry */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 font-mono-num">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            GPU: <span className="text-slate-200">{systemStatus.gpuUsage}%</span>
          </span>
          <span>·</span>
          <span>
            FPS: <span className="text-slate-200">{systemStatus.fps}</span>
          </span>
          <span>·</span>
          <span>
            LATENCY: <span className="text-emerald-400">{systemStatus.latencyMs}ms</span>
          </span>
        </div>

        <div className="hidden sm:block h-3.5 w-px bg-[#183158]" />

        {/* Quick Nav Items */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActivePage('live-feeds')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePage === 'live-feeds' ? 'text-cyan-300 bg-[#0e2242]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Live Feed</span>
          </button>

          <button
            onClick={() => setActivePage('map')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePage === 'map' ? 'text-cyan-300 bg-[#0e2242]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Map</span>
          </button>

          <button
            onClick={() => setActivePage('alerts')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors relative ${
              activePage === 'alerts' ? 'text-cyan-300 bg-[#0e2242]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Alerts</span>
            {newAlertsCount > 0 && (
              <span className="px-1 py-0.2 rounded-full text-[9px] font-mono-num font-bold bg-rose-600 text-white ml-0.5">
                {newAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActivePage('settings')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePage === 'settings' ? 'text-cyan-300 bg-[#0e2242]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
