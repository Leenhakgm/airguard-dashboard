import React from 'react';
import { Alert, SeverityLevel } from '@/types';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertPopupProps {
  alert: Alert;
  onClose: () => void;
  onAcknowledge: () => void;
}

const severityConfig: Record<SeverityLevel, { 
  bg: string; 
  border: string; 
  icon: React.ReactNode;
  title: string;
}> = {
  hazardous: {
    bg: 'bg-hazardous/20',
    border: 'border-hazardous',
    icon: <AlertTriangle className="w-6 h-6 text-hazardous" />,
    title: 'CRITICAL ALERT',
  },
  unhealthy: {
    bg: 'bg-unhealthy/20',
    border: 'border-unhealthy',
    icon: <AlertCircle className="w-6 h-6 text-unhealthy" />,
    title: 'WARNING',
  },
  moderate: {
    bg: 'bg-moderate/20',
    border: 'border-moderate',
    icon: <Info className="w-6 h-6 text-moderate" />,
    title: 'NOTICE',
  },
  safe: {
    bg: 'bg-safe/20',
    border: 'border-safe',
    icon: <CheckCircle className="w-6 h-6 text-safe" />,
    title: 'RESOLVED',
  },
};

export const AlertPopup: React.FC<AlertPopupProps> = ({ alert, onClose, onAcknowledge }) => {
  const config = severityConfig[alert.severity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div
        className={cn(
          'w-full max-w-md glass-card border-2 p-6 animate-slide-up',
          config.bg,
          config.border,
          alert.severity === 'hazardous' && 'animate-alert-pulse'
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground">
                {config.title}
              </p>
              <h3 className="text-lg font-bold">{alert.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{alert.message}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>
            {new Date(alert.timestamp).toLocaleString()}
          </span>
          {alert.sensorId && (
            <span className="font-mono bg-muted px-2 py-1 rounded">
              {alert.sensorId}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {!alert.acknowledged && (
            <Button
              onClick={onAcknowledge}
              className="flex-1"
              variant="default"
            >
              Acknowledge
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};

interface AlertBannerProps {
  message: string;
  severity: SeverityLevel;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ message, severity, onDismiss }) => {
  const config = severityConfig[severity];

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-40 p-4 border-b-2 animate-slide-up',
        config.bg,
        config.border,
        severity === 'hazardous' && 'animate-alert-pulse'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {config.icon}
          <p className="font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
