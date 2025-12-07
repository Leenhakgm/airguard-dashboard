import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import { useSensors } from '@/context/SensorContext';
import { AlertBanner } from '@/components/AlertPopup';

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { alerts } = useSensors();
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const criticalAlert = alerts.find(
    a => a.severity === 'hazardous' && !a.acknowledged
  );

  return (
    <div className="min-h-screen bg-background">
      {criticalAlert && !dismissedBanner && (
        <AlertBanner
          message={criticalAlert.title}
          severity={criticalAlert.severity}
          onDismiss={() => setDismissedBanner(true)}
        />
      )}
      
      <Navbar />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main
        className={cn(
          'transition-all duration-300 pt-4 px-4 pb-8',
          sidebarCollapsed ? 'ml-16' : 'ml-60',
          criticalAlert && !dismissedBanner && 'pt-20'
        )}
      >
        <div className="container mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
