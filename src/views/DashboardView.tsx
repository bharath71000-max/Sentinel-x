import React from 'react';
import { CameraGrid } from '../components/surveillance/CameraGrid';
import { AlertPanel } from '../components/surveillance/AlertPanel';
import { BorderMap } from '../components/surveillance/BorderMap';
import { DetectionSummary } from '../components/surveillance/DetectionSummary';
import { AIAnalyticsPanel } from '../components/surveillance/AIAnalyticsPanel';

export const DashboardView: React.FC = () => {
  return (
    <div className="flex-1 p-3 overflow-y-auto space-y-3 max-w-[1920px] mx-auto w-full">
      {/* Top Main Section: Live CCTV Grid (left) + Real-Time Alerts (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 min-h-[460px]">
        {/* Left 8 columns: 2x3 CCTV Camera Grid */}
        <div className="xl:col-span-8 flex flex-col">
          <CameraGrid />
        </div>

        {/* Right 4 columns: Real-Time Alerts Panel & Floating Critical Card */}
        <div className="xl:col-span-4 flex flex-col">
          <AlertPanel />
        </div>
      </div>

      {/* Bottom Telemetry Section: 3 Equal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-[300px]">
        {/* Column 1: Border Activity Map */}
        <div className="flex flex-col">
          <BorderMap />
        </div>

        {/* Column 2: Detection Summary (6 metric cards) */}
        <div className="flex flex-col">
          <DetectionSummary />
        </div>

        {/* Column 3: AI Analytics Bar Chart + Recent Events */}
        <div className="flex flex-col">
          <AIAnalyticsPanel />
        </div>
      </div>
    </div>
  );
};
