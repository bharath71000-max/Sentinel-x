import React, { useState } from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { X, ShieldAlert, Plus, Check, Trash2, Sliders } from 'lucide-react';
import { ZoneRule, DetectionClass } from '../../types/surveillance';

export const ZoneDetailModal: React.FC = () => {
  const { selectedZone, setSelectedZone, updateZoneStatus, saveZoneRule } = useSurveillance();

  const [ruleName, setRuleName] = useState('');
  const [targetClass, setTargetClass] = useState<DetectionClass>('PERSON');
  const [minConfidence, setMinConfidence] = useState(75);
  const [triggerCondition, setTriggerCondition] = useState<ZoneRule['triggerCondition']>('ZONE_ENTRY');
  const [action, setAction] = useState<ZoneRule['action']>('GENERATE_CRITICAL_ALERT');
  const [isAddingRule, setIsAddingRule] = useState(false);

  if (!selectedZone) return null;

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const newRule: ZoneRule = {
      id: `rule-${Date.now()}`,
      name: ruleName,
      targetClass,
      minConfidence,
      triggerCondition,
      action,
      enabled: true
    };

    saveZoneRule(selectedZone.id, newRule);
    setRuleName('');
    setIsAddingRule(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#081224] border border-[#1e467d] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="h-12 px-4 bg-[#0a1832] border-b border-[#183966] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="font-tech text-sm font-bold text-white tracking-wider">
              {selectedZone.name} Configuration & Rules
            </span>
          </div>

          <button
            onClick={() => setSelectedZone(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Status & Camera Assignment Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#060c18] border border-[#142749]">
              <span className="text-slate-400 block text-[10px]">Security Status</span>
              <select
                value={selectedZone.status}
                onChange={e => updateZoneStatus(selectedZone.id, e.target.value as any)}
                className="mt-1 w-full bg-[#0a1830] border border-[#1c4178] rounded px-2 py-1 text-xs font-bold text-slate-200"
              >
                <option value="Normal">Normal</option>
                <option value="Suspicious">Suspicious</option>
                <option value="High Alert">High Alert</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#060c18] border border-[#142749]">
              <span className="text-slate-400 block text-[10px]">Active Incidents</span>
              <span className="font-mono-num text-lg font-bold text-rose-400 mt-1 block">
                {selectedZone.activeAlertCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#060c18] border border-[#142749]">
              <span className="text-slate-400 block text-[10px]">Assigned Cameras</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedZone.cameraIds.map(camId => (
                  <span
                    key={camId}
                    className="px-1.5 py-0.5 rounded bg-[#0e2447] text-cyan-300 font-mono text-[10px]"
                  >
                    {camId}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rules List */}
          <div className="rounded-xl bg-[#060c18] border border-[#142749] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-tech text-xs font-bold text-slate-200 tracking-wider">
                Configured Edge Analytics Rules ({selectedZone.rules.length})
              </span>

              <button
                onClick={() => setIsAddingRule(!isAddingRule)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>Add Detection Rule</span>
              </button>
            </div>

            {/* Existing Rules */}
            <div className="space-y-2">
              {selectedZone.rules.length === 0 ? (
                <div className="p-3 text-center text-slate-500 italic bg-[#081222] rounded-lg">
                  No active rules configured for this zone. Default perimeter detection applies.
                </div>
              ) : (
                selectedZone.rules.map(rule => (
                  <div
                    key={rule.id}
                    className="p-2.5 rounded-lg bg-[#0a1830] border border-[#163866] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{rule.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        IF <span className="text-cyan-400 font-semibold">{rule.targetClass}</span> trigger condition{' '}
                        <span className="text-amber-300 font-mono">{rule.triggerCondition}</span> with confidence &gt;{' '}
                        <span className="text-emerald-400 font-mono">{rule.minConfidence}%</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {rule.action}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Rule Form */}
          {isAddingRule && (
            <form onSubmit={handleAddRule} className="rounded-xl bg-[#0a1830] border border-cyan-500/40 p-3 space-y-3">
              <div className="font-tech text-xs font-bold text-cyan-300">New Detection Rule</div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Night Patrol Virtual Fence Cross"
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  className="w-full bg-[#060c18] border border-[#183966] rounded px-2.5 py-1 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Target Object Class</label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value as any)}
                    className="w-full bg-[#060c18] border border-[#183966] rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="PERSON">PERSON</option>
                    <option value="VEHICLE">VEHICLE</option>
                    <option value="TAMPERING">TAMPERING</option>
                    <option value="UNATTENDED_OBJECT">UNATTENDED OBJECT</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Trigger Condition</label>
                  <select
                    value={triggerCondition}
                    onChange={e => setTriggerCondition(e.target.value as any)}
                    className="w-full bg-[#060c18] border border-[#183966] rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="VIRTUAL_FENCE_CROSS">Virtual Fence Crossing</option>
                    <option value="ZONE_ENTRY">Restricted Zone Entry</option>
                    <option value="LOITERING">Loitering &gt; 30s</option>
                    <option value="TAMPERING">Camera Occlusion / Movement</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Minimum AI Confidence Threshold</span>
                  <span className="font-mono text-cyan-300 font-bold">{minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={minConfidence}
                  onChange={e => setMinConfidence(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#183966]">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-3 py-1 rounded bg-[#060c18] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Rule</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
