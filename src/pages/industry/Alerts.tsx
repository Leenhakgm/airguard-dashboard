import React, { useState } from 'react';
import { useSensors } from '@/context/SensorContext';
import { AlertList } from '@/components/AlertList';
import { Button } from '@/components/ui/button';
import { Bell, Filter, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeverityLevel } from '@/types';

type FilterType = 'all' | SeverityLevel;

const IndustryAlerts: React.FC = () => {
  const { alerts, acknowledgeAlert, isLoading } = useSensors();
  const [filter, setFilter] = useState<FilterType>('all');

  const filterOptions: { value: FilterType; label: string; color?: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'hazardous', label: 'Hazardous', color: 'text-hazardous' },
    { value: 'unhealthy', label: 'Unhealthy', color: 'text-unhealthy' },
    { value: 'moderate', label: 'Moderate', color: 'text-moderate' },
    { value: 'safe', label: 'Safe', color: 'text-safe' },
  ];

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            Alert Center
          </h1>
          <p className="text-muted-foreground">
            Manage sensor and prediction alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unacknowledgedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-hazardous/10 border border-hazardous/30">
              <span className="w-2 h-2 rounded-full bg-hazardous animate-pulse" />
              <span className="text-sm font-medium text-hazardous">
                {unacknowledgedCount} unread
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by severity:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(option.value)}
                className={cn(
                  filter !== option.value && option.color
                )}
              >
                {option.label}
                {option.value !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({alerts.filter(a => a.severity === option.value).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold">{alerts.length}</p>
          <p className="text-sm text-muted-foreground">Total Alerts</p>
        </div>
        <div className="glass-card p-4 text-center border border-hazardous/30 bg-hazardous/5">
          <p className="text-3xl font-bold text-hazardous">
            {alerts.filter(a => a.severity === 'hazardous').length}
          </p>
          <p className="text-sm text-muted-foreground">Critical</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-unhealthy">
            {unacknowledgedCount}
          </p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card p-4 text-center border border-safe/30 bg-safe/5">
          <p className="text-3xl font-bold text-safe">
            {alerts.filter(a => a.acknowledged).length}
          </p>
          <p className="text-sm text-muted-foreground">Acknowledged</p>
        </div>
      </div>

      {/* Alert List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {filter === 'all' ? 'All Alerts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Alerts`}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <AlertList
          alerts={filteredAlerts}
          onAcknowledge={acknowledgeAlert}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export default IndustryAlerts;
