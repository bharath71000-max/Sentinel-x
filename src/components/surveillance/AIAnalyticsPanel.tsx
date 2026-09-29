import React, { useState } from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { BarChart3, ChevronRight, AlertTriangle, Camera as CamIcon, Package, Car, User } from 'lucide-react';

export const AIAnalyticsPanel: React.FC = () => {
  const { metrics, alerts, setSelectedAlert, setActivePage } = useSurveillance();
  const [activeTab, setActiveTab] = useState<'Events' | 'Trends' | 'Reports'>('Events');

  // Chart data matching the screenshot values and colors:
  const chartItems = [
    { label: 'Intrusion', value: metrics.intrusions, color: '#ef4444' },
    { label: 'Tampering', value: metrics.tampering, color: '#f59e0b' },
    { label: 'Object', value: metrics.unattendedObjects, color: '#a855f7' },
    { label: 'Vehicle', value: metrics.vehiclesDetected, color: '#10b981' },
    { label: 'Human', value: metrics.humansDetected, color: '#06b6d4' }
  ];

  const maxVal = 50;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PERSON':
        return <User className="w-3 h-3 text-cyan-400" />;
      case 'TAMPERING':
        return <CamIcon className="w-3 h-3 text-amber-400" />;
      case 'UNATTENDED_OBJECT':
        return <Package className="w-3 h-3 text-purple-400" />;
      case 'VEHICLE':
        return <Car className="w-3 h-3 text-emerald-400" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-rose-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#081222] border border-[#14294d] rounded-xl p-3 shadow-xl">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#14294d]">
        <h3 className="font-tech text-sm font-bold text-white tracking-wider">
          AI. Analytics
        </h3>

        {/* Tabs: Events, Trends, Reports */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#060c18] border border-[#142749] text-xs">
          {(['Events', 'Trends', 'Reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Reports') {
                  setActivePage('reports');
                } else if (tab === 'Trends') {
                  setActivePage('analytics');
                }
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#123e75] text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between min-h-[220px]">
        {/* Clean Bar Chart */}
        <div className="h-32 pt-2 px-2 flex flex-col justify-between">
          <div className="flex-1 flex items-end justify-between gap-3 relative pb-5">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 bottom-5 top-0 flex flex-col justify-between pointer-events-none opacity-15">
              <div className="border-b border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
            </div>

            {/* Scale numbers on left */}
            <div className="absolute -left-2 top-0 bottom-5 flex flex-col justify-between text-[9px] font-mono-num text-slate-500">
              <span>50</span>
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end justify-around pl-4 h-full">
              {chartItems.map(item => {
                const heightPercent = Math.min((item.value / maxVal) * 100, 100);
                return (
                  <div key={item.label} className="flex flex-col items-center gap-1 group relative">
                    {/* Tooltip / value */}
                    <span className="text-[10px] font-mono-num font-bold text-slate-300">
                      {item.value}
                    </span>

                    {/* Bar rectangle */}
                    <div
                      className="w-7 rounded-t transition-all duration-500 group-hover:brightness-125"
                      style={{
                        height: `${Math.max(heightPercent, 6)}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}44`
                      }}
                    />

                    {/* Bar Label below */}
                    <span className="absolute -bottom-5 text-[10px] font-tech text-slate-400 tracking-wider">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Events Mini Feed */}
        <div className="pt-2 border-t border-[#14294d] mt-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-tech flex items-center justify-between">
            <span>Recent Events</span>
          </div>

          <div className="space-y-1 text-xs">
            {alerts.slice(0, 5).map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedAlert(event)}
                className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#0c1a32] cursor-pointer transition-colors text-[11px]"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono-num text-[10px] text-slate-400">
                    {event.timestamp}
                  </span>
                  <div className="p-0.5 rounded bg-[#0f213b]">
                    {getEventIcon(event.detectionType)}
                  </div>
                  <span className="text-slate-200 font-medium truncate">
                    {event.title}
                  </span>
                </div>
                <span className="font-mono text-cyan-400 font-semibold text-[10px]">
                  {event.cameraId}
                </span>
              </div>
            ))}
          </div>

          {/* View All Events Link */}
          <button
            onClick={() => setActivePage('alerts')}
            className="w-full mt-2 pt-1.5 border-t border-[#14294d] text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 transition-colors"
          >
            <span>View All Events</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
