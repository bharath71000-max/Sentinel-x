import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Activity,
  Cpu,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { metrics, cameras } = useSurveillance();
  const [timeframe, setTimeframe] = useState<'today' | '7days' | '30days'>('today');

  // Hourly detection distribution mock data
  const hourlyData = [
    { hour: '16:00', humans: 3, vehicles: 2, alerts: 1 },
    { hour: '17:00', humans: 5, vehicles: 4, alerts: 1 },
    { hour: '18:00', humans: 6, vehicles: 3, alerts: 0 },
    { hour: '19:00', humans: 8, vehicles: 6, alerts: 2 },
    { hour: '20:00', humans: 10, vehicles: 5, alerts: 3 },
    { hour: '21:00', humans: 4, vehicles: 3, alerts: 2 },
    { hour: '22:00', humans: 5, vehicles: 5, alerts: 3 },
  ];

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-w-[1920px] mx-auto w-full">
      {/* Top Header & Range Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-tech text-base font-bold text-white tracking-wider">
              Surveillance & Threat Analytics
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated detection frequencies, false-alarm reduction metrics, and zone vulnerability insights
            </p>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#060c18] border border-[#142749] text-xs">
          {(['today', '7days', '30days'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded capitalize font-semibold transition-colors ${
                timeframe === t
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'today' ? 'Today (24h)' : t === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hourly Threat Density */}
        <div className="md:col-span-2 p-4 rounded-xl bg-[#081222] border border-[#14294d] shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-tech text-sm font-bold text-white tracking-wider">
                Hourly Activity & Threat Distribution
              </h3>
              <p className="text-[11px] text-slate-400">
                Peak movement observed along Sector D Check Post and Sector A North Border
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Humans
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Vehicles
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical Alerts
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2 border-b border-[#14294d]">
            {hourlyData.map(d => (
              <div key={d.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  {/* Humans Bar */}
                  <div
                    className="w-3 rounded-t bg-cyan-500"
                    style={{ height: `${(d.humans / 12) * 100}%` }}
                    title={`Humans: ${d.humans}`}
                  />
                  {/* Vehicles Bar */}
                  <div
                    className="w-3 rounded-t bg-emerald-500"
                    style={{ height: `${(d.vehicles / 12) * 100}%` }}
                    title={`Vehicles: ${d.vehicles}`}
                  />
                  {/* Critical Alerts Bar */}
                  <div
                    className="w-3 rounded-t bg-rose-500"
                    style={{ height: `${(d.alerts / 12) * 100}%` }}
                    title={`Alerts: ${d.alerts}`}
                  />
                </div>
                <span className="text-[10px] font-mono-num text-slate-400">{d.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Confidence & Precision Stats */}
        <div className="p-4 rounded-xl bg-[#081222] border border-[#14294d] shadow flex flex-col justify-between space-y-3">
          <h3 className="font-tech text-sm font-bold text-white tracking-wider">
            AI Engine Precision
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Person Classification Precision</span>
                <span className="font-mono text-cyan-400 font-bold">96.4%</span>
              </div>
              <div className="w-full bg-[#060c18] rounded-full h-2 overflow-hidden border border-[#142749]">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '96.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Vehicle ANPR OCR Accuracy</span>
                <span className="font-mono text-emerald-400 font-bold">98.1%</span>
              </div>
              <div className="w-full bg-[#060c18] rounded-full h-2 overflow-hidden border border-[#142749]">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Virtual Tripwire False Positive Rate</span>
                <span className="font-mono text-amber-400 font-bold">1.2%</span>
              </div>
              <div className="w-full bg-[#060c18] rounded-full h-2 overflow-hidden border border-[#142749]">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '1.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>ByteTrack Multi-Object Tracking (MOTA)</span>
                <span className="font-mono text-cyan-300 font-bold">91.8%</span>
              </div>
              <div className="w-full bg-[#060c18] rounded-full h-2 overflow-hidden border border-[#142749]">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '91.8%' }} />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#060c18] border border-[#142749] text-[11px] text-slate-400">
            Model weights: YOLO-v11 Edge TensorRT fp16. ByteTrack kalman filter lookahead 30 frames.
          </div>
        </div>
      </div>

      {/* Camera Health & Uptime Performance Matrix */}
      <div className="p-4 rounded-xl bg-[#081222] border border-[#14294d] shadow">
        <h3 className="font-tech text-sm font-bold text-white tracking-wider mb-3">
          Camera Infrastructure Reliability Index
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {cameras.map(cam => (
            <div
              key={cam.id}
              className="p-3 rounded-lg bg-[#060c18] border border-[#142749] flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cam.status === 'LIVE' ? 'bg-emerald-400' : 'bg-rose-500'
                    }`}
                  />
                  <span>{cam.id}</span>
                  <span className="text-slate-400 font-normal">({cam.sector})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Latency: <span className="font-mono text-cyan-300">{cam.latencyMs}ms</span> · FPS:{' '}
                  <span className="font-mono text-slate-200">{cam.fps}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {cam.status === 'LIVE' ? '99.8%' : '84.2%'}
                </span>
                <div className="text-[10px] text-slate-500">Uptime</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
