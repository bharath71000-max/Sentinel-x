import React from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import {
  LayoutDashboard,
  Video,
  Bell,
  MapPin,
  BarChart3,
  FileText,
  Settings,
  Radio,
  TowerControl
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, alerts } = useSurveillance();

  const newAlertsCount = alerts.filter(a => a.status === 'NEW').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-feeds', label: 'Live Feeds', icon: Video },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: newAlertsCount > 0 ? newAlertsCount : null },
    { id: 'map', label: 'Map View', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 bg-[#070f1e] border-r border-[#14284b] flex flex-col justify-between select-none z-20">
      {/* Top Nav links */}
      <div className="py-4 px-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#12427a] text-white shadow-[0_0_15px_rgba(14,116,220,0.35)] border border-[#2368b8]'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c1a32] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono-num font-bold bg-rose-600 text-white shadow-[0_0_8px_rgba(225,29,72,0.6)]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Branding & Tactical Watchtower Graphic */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-b from-[#0b172a] to-[#070e1c] border border-[#142d54] text-center relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:8px_8px]" />

        {/* Watchtower Tactical Vector Graphic */}
        <div className="relative mb-2.5 flex justify-center">
          <div className="relative p-2.5 rounded-full bg-[#0e213d] border border-[#1c437a] shadow-inner">
            <TowerControl className="w-8 h-8 text-cyan-400/90" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-xs font-bold text-cyan-300 tracking-wider font-tech">
            ULTRON
          </div>
          <div className="text-[11px] font-semibold text-slate-200 tracking-wide font-tech">
            Border Security
          </div>
          <div className="text-[10px] text-cyan-400/90 font-medium">
            Reimagined with AI
          </div>
        </div>
      </div>
    </aside>
  );
};
