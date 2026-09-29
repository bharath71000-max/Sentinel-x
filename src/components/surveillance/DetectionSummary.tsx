import React from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import {
  User,
  Car,
  AlertOctagon,
  Camera as CamIcon,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const DetectionSummary: React.FC = () => {
  const { metrics } = useSurveillance();

  // Helper to render mini SVG sparkline
  const renderSparkline = (data: number[], color: string) => {
    if (!data || data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data) || 1;
    const height = 24;
    const width = 64;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / (max - min || 1)) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const cards = [
    {
      id: 'humans',
      title: 'Humans Detected',
      value: metrics.humansDetected,
      trend: `↑ ${metrics.humansTrend}%`,
      trendPositive: true,
      trendColor: '#10b981',
      sparklineColor: '#06b6d4',
      sparklineData: metrics.humansSparkline,
      icon: User,
      iconBg: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-400'
    },
    {
      id: 'vehicles',
      title: 'Vehicles Detected',
      value: metrics.vehiclesDetected,
      trend: `↑ ${metrics.vehiclesTrend}%`,
      trendPositive: true,
      trendColor: '#10b981',
      sparklineColor: '#10b981',
      sparklineData: metrics.vehiclesSparkline,
      icon: Car,
      iconBg: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400'
    },
    {
      id: 'intrusions',
      title: 'Intrusions',
      value: metrics.intrusions,
      trend: `↑ ${metrics.intrusionsTrend}%`,
      trendPositive: false, // intrusions going up is high threat
      trendColor: '#f43f5e',
      sparklineColor: '#f43f5e',
      sparklineData: metrics.intrusionsSparkline,
      icon: AlertOctagon,
      iconBg: 'bg-rose-500/15 border-rose-400/30 text-rose-400'
    },
    {
      id: 'tampering',
      title: 'Tampering',
      value: metrics.tampering,
      trend: `↓ ${Math.abs(metrics.tamperingTrend)}%`,
      trendPositive: true,
      trendColor: '#10b981',
      sparklineColor: '#f59e0b',
      sparklineData: metrics.tamperingSparkline,
      icon: CamIcon,
      iconBg: 'bg-amber-500/15 border-amber-400/30 text-amber-400'
    },
    {
      id: 'unattended',
      title: 'Unattended Objects',
      value: metrics.unattendedObjects,
      trend: `↑ ${metrics.unattendedTrend}%`,
      trendPositive: false,
      trendColor: '#f59e0b',
      sparklineColor: '#a855f7',
      sparklineData: metrics.unattendedSparkline,
      icon: Package,
      iconBg: 'bg-purple-500/15 border-purple-400/30 text-purple-400'
    },
    {
      id: 'health',
      title: 'System Health',
      value: metrics.systemHealth,
      trend: `${metrics.systemHealthPercent}%`,
      trendPositive: true,
      trendColor: '#10b981',
      sparklineColor: '#10b981',
      sparklineData: metrics.systemSparkline,
      icon: Activity,
      iconBg: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#081222] border border-[#14294d] rounded-xl p-3 shadow-xl">
      {/* Header */}
      <div className="pb-2 mb-2 border-b border-[#14294d]">
        <h3 className="font-tech text-sm font-bold text-white tracking-wider">
          Detection Summary
        </h3>
      </div>

      {/* 2 x 3 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="p-2.5 rounded-lg bg-[#060c18] border border-[#142749] hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              {/* Top row: Icon + Title */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 leading-tight">
                  {card.title}
                </span>
              </div>

              {/* Middle row: Big Value + Trend */}
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-mono-num text-xl font-bold text-white tracking-tight">
                  {card.value}
                </span>

                <div
                  className="flex items-center text-[11px] font-mono-num font-semibold"
                  style={{ color: card.trendColor }}
                >
                  <span>{card.trend}</span>
                </div>
              </div>

              {/* Bottom row: Sparkline */}
              <div className="flex justify-end pt-1">
                {renderSparkline(card.sparklineData, card.sparklineColor)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
