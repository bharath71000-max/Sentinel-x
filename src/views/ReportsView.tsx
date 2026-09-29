import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Shield,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { alerts, cameras, metrics, currentDate, currentTime, currentUserRole } = useSurveillance();

  const [reportType, setReportType] = useState<string>('daily');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<boolean>(true);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(true);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Incident,Camera,Zone,Severity,Status,Operator,Evidence']
        .concat(
          alerts.map(
            a =>
              `"${a.timestamp}","${a.title}","${a.cameraId}","${a.zoneName}","${a.severity}","${a.status}","${a.acknowledgedBy || 'Pending'}","${a.trackId || 'None'}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ultron_report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-w-[1920px] mx-auto w-full">
      {/* Top Config Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-tech text-base font-bold text-white tracking-wider">
              Surveillance Incident & Audit Reporting
            </h2>
            <p className="text-xs text-slate-400">
              Generate certified compliance transcripts, incident chains-of-custody, and edge hardware uptime audits
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e2242] hover:bg-[#153460] border border-[#1c437a] text-cyan-300 font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Document</span>
          </button>
        </div>
      </div>

      {/* Report Parameter Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#081222] border border-[#14294d] text-xs">
        <div>
          <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="w-full bg-[#060c18] border border-[#142749] rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none"
          >
            <option value="daily">Daily Border Surveillance Brief</option>
            <option value="incident">Critical Incident Log (Intrusions)</option>
            <option value="hardware">Camera Stream & Health Audit</option>
            <option value="detections">AI Classification & ANPR Distribution</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
            Sector Filter
          </label>
          <select
            value={selectedZoneFilter}
            onChange={e => setSelectedZoneFilter(e.target.value)}
            className="w-full bg-[#060c18] border border-[#142749] rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none"
          >
            <option value="ALL">All Sectors (A through F)</option>
            <option value="ZONE-A">Border Zone A (Check Post)</option>
            <option value="ZONE-B">Border Zone B (River Side)</option>
            <option value="ZONE-C">Border Zone C (Forest Path)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
            Date Interval
          </label>
          <div className="px-2.5 py-1.5 rounded-lg bg-[#060c18] border border-[#142749] text-slate-300 font-mono flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentDate} (Full Day)</span>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2 rounded-lg bg-[#123e75] hover:bg-[#1a559e] text-cyan-300 hover:text-white font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isGenerating ? 'Compiling Telemetry...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* Formatted Formal Defense Report Sheet */}
      {generatedReport && (
        <div className="p-6 rounded-xl bg-[#060d1a] border border-[#1a3869] shadow-2xl text-slate-200 space-y-6">
          {/* Official Document Letterhead */}
          <div className="flex items-start justify-between border-b border-[#183966] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-tech text-lg font-bold text-white tracking-widest">
                  ULTRON DEFENSE INTELLIGENCE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  CLASSIFIED // SOC LEVEL-2
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                AI-Powered Border Observation & Monitoring Operations Center
              </div>
            </div>

            <div className="text-right text-xs space-y-0.5 font-mono-num">
              <div>DOC ID: <span className="text-cyan-300">ULT-RPT-2026-0927</span></div>
              <div>COMPILED: <span className="text-slate-400">{currentDate} · {currentTime}</span></div>
              <div>OFFICER: <span className="text-slate-300">{currentUserRole} (Station 04)</span></div>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div>
            <h3 className="font-tech text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              1. Executive Threat Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#09152b] border border-[#142d54]">
                <div className="text-slate-400">Total Detections</div>
                <div className="font-mono-num text-xl font-bold text-white mt-1">
                  {metrics.humansDetected + metrics.vehiclesDetected}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#09152b] border border-[#142d54]">
                <div className="text-rose-400">Virtual Tripwire Breaches</div>
                <div className="font-mono-num text-xl font-bold text-rose-400 mt-1">
                  {metrics.intrusions}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#09152b] border border-[#142d54]">
                <div className="text-amber-400">Optical Tampering Incidents</div>
                <div className="font-mono-num text-xl font-bold text-amber-400 mt-1">
                  {metrics.tampering}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#09152b] border border-[#142d54]">
                <div className="text-emerald-400">Perimeter Defense Status</div>
                <div className="font-mono-num text-xl font-bold text-emerald-400 mt-1">
                  NOMINAL (98.4%)
                </div>
              </div>
            </div>
          </div>

          {/* Chronological Incident Table */}
          <div>
            <h3 className="font-tech text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              2. Incident Chronology & Chain of Custody
            </h3>
            <div className="rounded-lg border border-[#142d54] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0a1832] text-slate-400 uppercase font-tech text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Incident Classification</th>
                    <th className="py-2.5 px-3">Camera / Sector</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Resolution Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#102444] bg-[#071122]">
                  {alerts.map(a => (
                    <tr key={a.id}>
                      <td className="py-2.5 px-3 font-mono-num text-cyan-300">{a.timestamp}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{a.title}</td>
                      <td className="py-2.5 px-3 text-slate-300">{a.location}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            a.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        >
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{a.confidence}%</td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {a.acknowledgedBy ? `Acknowledged by ${a.acknowledgedBy}` : 'Pending Operator Action'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sensor Hardware Health Table */}
          <div>
            <h3 className="font-tech text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              3. Sensor Grid Availability Audit
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed">
              46 of 48 border optical & infrared cameras maintained uninterrupted streaming status during this 24-hour cycle. CAM-06 (Sector F) experienced a signal drop at 22:18:03 and is scheduled for edge hardware technician diagnostic.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
