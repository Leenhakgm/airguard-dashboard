import React, { useState } from 'react';
import { Alert, SeverityLevel } from '@/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronRight, Check } from 'lucide-react';
import { AlertPopup } from './AlertPopup';
import { Skeleton } from '@/components/ui/skeleton';

interface AlertListProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  isLoading?: boolean;
}

const severityConfig: Record<SeverityLevel, { 
  bg: string; 
  border: string; 
  icon: React.ReactNode;
  dot: string;
}> = {
  hazardous: {
    bg: 'bg-hazardous/10',
    border: 'border-hazardous/30',
    icon: <AlertTriangle className="w-5 h-5 text-hazardous" />,
    dot: 'bg-hazardous',
  },
  unhealthy: {
    bg: 'bg-unhealthy/10',
    border: 'border-unhealthy/30',
    icon: <AlertCircle className="w-5 h-5 text-unhealthy" />,
    dot: 'bg-unhealthy',
  },
  moderate: {
    bg: 'bg-moderate/10',
    border: 'border-moderate/30',
    icon: <Info className="w-5 h-5 text-moderate" />,
    dot: 'bg-moderate',
  },
  safe: {
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    icon: <CheckCircle className="w-5 h-5 text-safe" />,
    dot: 'bg-safe',
  },
};

const AlertListSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="glass-card p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const AlertList: React.FC<AlertListProps> = ({ alerts, onAcknowledge, isLoading = false }) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <AlertListSkeleton />;
  }

  if (alerts.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <CheckCircle className="w-12 h-12 text-safe mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">All Clear</h3>
        <p className="text-muted-foreground">No alerts at this time</p>
      </div>
    );
  }

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (!a.acknowledged && b.acknowledged) return -1;
    if (a.acknowledged && !b.acknowledged) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <>
      <div className="space-y-3">
        {sortedAlerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          
          return (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={cn(
                'glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] border animate-slide-up',
                config.bg,
                config.border,
                alert.acknowledged && 'opacity-60'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg', config.bg)}>
                  {config.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{alert.title}</h4>
                    {!alert.acknowledged && (
                      <span className={cn('w-2 h-2 rounded-full animate-pulse', config.dot)} />
                    )}
                    {alert.acknowledged && (
                      <Check className="w-4 h-4 text-safe" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                    {alert.sensorId && (
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                        {alert.sensorId}
                      </span>
                    )}
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded capitalize',
                      config.bg,
                      `text-${alert.severity}`
                    )}>
                      {alert.type}
                    </span>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>

      {selectedAlert && (
        <AlertPopup
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAcknowledge={() => {
            onAcknowledge(selectedAlert.id);
            setSelectedAlert(null);
          }}
        />
      )}
    </>
  );
};
