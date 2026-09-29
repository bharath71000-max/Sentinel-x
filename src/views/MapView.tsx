import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { BorderMap } from '../components/surveillance/BorderMap';
import {
  MapPin,
  Layers,
  Compass,
  Radio,
  Crosshair,
  ShieldAlert,
  Send,
  Navigation2
} from 'lucide-react';

export const MapView: React.FC = () => {
  const { zones, cameras, alerts, setSelectedZone } = useSurveillance();
  const [mapLayer, setMapLayer] = useState<'vector' | 'satellite' | 'thermal'>('vector');
  const [showDrones, setShowDrones] = useState(true);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-w-[1920px] mx-auto w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-tech text-base font-bold text-white tracking-wider">
              Border GIS Tactical Operations Map
            </h2>
            <p className="text-xs text-slate-400">
              Integrated geospatial positioning with virtual tripwire telemetry and camera coverage fields
            </p>
          </div>
        </div>

        {/* Map Layers */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#060c18] border border-[#142749]">
            {(['vector', 'satellite', 'thermal'] as const).map(layer => (
              <button
                key={layer}
                onClick={() => setMapLayer(layer)}
                className={`px-3 py-1 rounded capitalize font-semibold transition-colors ${
                  mapLayer === layer
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDrones(!showDrones)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
              showDrones
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                : 'bg-[#060c18] text-slate-400 border-[#142749]'
            }`}
          >
            <Navigation2 className="w-3.5 h-3.5" />
            <span>UAV Drone Trajectory</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport & Sidebars */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 min-h-[640px]">
        {/* Large Tactical Map (3 Cols) */}
        <div className="xl:col-span-3 flex flex-col h-[640px]">
          <BorderMap />
        </div>

        {/* Right Tactical Sidebar (1 Col) */}
        <div className="flex flex-col gap-3">
          {/* Quick Zone Response Dispatch */}
          <div className="p-3.5 rounded-xl bg-[#081222] border border-[#14294d] shadow flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-tech flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Patrol Units In Field</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#0a1830] border border-[#163866] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">QRF Alpha (Sector D)</div>
                    <div className="text-[10px] text-slate-400">Position: Check Post Perimeter</div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    ENGAGED
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#0a1830] border border-[#163866] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Bravo Patrol (Sector B)</div>
                    <div className="text-[10px] text-slate-400">Position: River Bank North</div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ON PATROL
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#0a1830] border border-[#163866] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">UAV Ultron-02 Drone</div>
                    <div className="text-[10px] text-slate-400">Altitude: 120m · Battery: 84%</div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    AIRBORNE
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Dispatched nearest mobile Quick Reaction Force to coordinates.')}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Emergency Vector</span>
            </button>
          </div>

          {/* Virtual Tripwire Specifications */}
          <div className="flex-1 p-3.5 rounded-xl bg-[#081222] border border-[#14294d] shadow text-xs space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-tech">
              Active Virtual Tripwires
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-[#060c18] border border-[#142749]">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Tripwire TW-01</span>
                  <span className="text-rose-400">BREACHED</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Sector D Checkpost barrier line (Crossing event at 22:31:08)
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#060c18] border border-[#142749]">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Tripwire TW-02</span>
                  <span className="text-emerald-400">ARMED</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  North Border Watchtower secondary fence
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#060c18] border border-[#142749]">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Tripwire TW-03</span>
                  <span className="text-emerald-400">ARMED</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  River Side Sector B shoreline line
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
