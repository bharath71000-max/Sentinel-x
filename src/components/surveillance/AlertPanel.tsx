import React from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { CriticalAlertPopup } from './CriticalAlertPopup';
import {
  Bell,
  AlertTriangle,
  Camera as CamIcon,
  Package,
  Car,
  User,
  ShieldCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Alert } from '../../types/surveillance';

export const AlertPanel: React.FC = () => {
  const { alerts, setSelectedAlert, setActivePage } = useSurveillance();

  const getAlertIcon = (alert: Alert) => {
    switch (alert.detectionType) {
      case 'PERSON':
        if (alert.severity === 'CRITICAL') {
          return <AlertTriangle className="w-4 h-4 text-rose-400" />;
        }
        return <User className="w-4 h-4 text-cyan-400" />;
      case 'TAMPERING':
        if (alert.title.includes('System Health')) {
          return <ShieldCheck className="w-4 h-4 text-teal-400" />;
        }
        return <CamIcon className="w-4 h-4 text-amber-400" />;
      case 'UNATTENDED_OBJECT':
        return <Package className="w-4 h-4 text-purple-400" />;
      case 'VEHICLE':
        return <Car className="w-4 h-4 text-emerald-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
  };

  const getIconContainerBg = (alert: Alert) => {
    switch (alert.detectionType) {
      case 'PERSON':
        return alert.severity === 'CRITICAL'
          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
          : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400';
      case 'TAMPERING':
        return alert.title.includes('System Health')
          ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
          : 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      case 'UNATTENDED_OBJECT':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-400';
      case 'VEHICLE':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      default:
        return 'bg-rose-500/15 border-rose-500/30 text-rose-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#081222] border border-[#14294d] rounded-xl p-3 shadow-xl space-y-3 overflow-hidden">
      {/* Critical floating / top popup */}
      <CriticalAlertPopup />

      {/* Real-Time Alerts Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#14294d]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="font-tech text-sm font-bold text-white tracking-wider">
            Real-Time Alerts
          </h3>
        </div>

        <button
          onClick={() => setActivePage('alerts')}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-0.5 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {alerts.slice(0, 7).map(alert => {
          const isNew = alert.status === 'NEW';
          return (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className="p-2.5 rounded-lg bg-[#0a162b] hover:bg-[#0e213d] border border-[#142d54] hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Icon Container */}
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getIconContainerBg(
                    alert
                  )}`}
                >
                  {getAlertIcon(alert)}
                </div>

                {/* Text Metadata */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                      {alert.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {alert.location}
                  </div>
                </div>
              </div>

              {/* Right Side: Timestamp & Status Badge */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-mono-num text-[10px] text-slate-400">
                  {alert.timestamp}
                </span>
                {isNew && (
                  <span
                    className={`mt-1 px-1.5 py-0.2 rounded text-[9px] font-tech font-bold uppercase tracking-wider ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50'
                        : alert.detectionType === 'UNATTENDED_OBJECT'
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                        : 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                    }`}
                  >
                    NEW
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
