import React from 'react';
import { SurveillanceProvider, useSurveillance } from './context/SurveillanceContext';
import { TopHeader } from './components/common/TopHeader';
import { Sidebar } from './components/common/Sidebar';
import { BottomBar } from './components/common/BottomBar';

// Views
import { DashboardView } from './views/DashboardView';
import { LiveFeedsView } from './views/LiveFeedsView';
import { AlertsView } from './views/AlertsView';
import { MapView } from './views/MapView';
import { AnalyticsView } from './views/AnalyticsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

// Modals
import { CameraDetailModal } from './components/modals/CameraDetailModal';
import { EventDetailModal } from './components/modals/EventDetailModal';
import { ZoneDetailModal } from './components/modals/ZoneDetailModal';

const AppContent: React.FC = () => {
  const { activePage } = useSurveillance();

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'live-feeds':
        return <LiveFeedsView />;
      case 'alerts':
        return <AlertsView />;
      case 'map':
        return <MapView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#060c18] text-slate-100 select-none">
      {/* Top Header */}
      <TopHeader />

      {/* Center Body: Sidebar + Active Viewport */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-[#060d19]">
          {renderActiveView()}
        </main>
      </div>

      {/* Bottom Bar */}
      <BottomBar />

      {/* Global Interactive Modals */}
      <CameraDetailModal />
      <EventDetailModal />
      <ZoneDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <SurveillanceProvider>
      <AppContent />
    </SurveillanceProvider>
  );
}
