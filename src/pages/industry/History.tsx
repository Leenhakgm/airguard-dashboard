import React, { useState } from 'react';
import { useSensors } from '@/context/SensorContext';
import { PollutantChart, EnvironmentalChart } from '@/components/LineChart';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = '6h' | '12h' | '24h' | '7d';

const History: React.FC = () => {
  const { historicalData, isLoading } = useSensors();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const [selectedChart, setSelectedChart] = useState<'pollutants' | 'environmental'>('pollutants');

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '6h', label: '6 Hours' },
    { value: '12h', label: '12 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
  ];

  // Filter data based on selected range (mock implementation)
  const getFilteredData = () => {
    const hoursMap: Record<TimeRange, number> = {
      '6h': 6,
      '12h': 12,
      '24h': 24,
      '7d': 168,
    };
    const hours = hoursMap[selectedRange];
    return historicalData.slice(-Math.min(hours, historicalData.length));
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Historical Data</h1>
          <p className="text-muted-foreground">Analyze pollutant trends over time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Range:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2">
        <Button
          variant={selectedChart === 'pollutants' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('pollutants')}
        >
          Pollutants
        </Button>
        <Button
          variant={selectedChart === 'environmental' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('environmental')}
        >
          Environmental
        </Button>
      </div>

      {/* Charts */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          {selectedChart === 'pollutants' ? 'Pollutant Levels Over Time' : 'Environmental Conditions'}
        </h2>
        {selectedChart === 'pollutants' ? (
          <PollutantChart data={filteredData} isLoading={isLoading} />
        ) : (
          <EnvironmentalChart data={filteredData} isLoading={isLoading} />
        )}
      </section>

      {/* Statistics Summary */}
      <section className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['NH₃', 'CO₂', 'CH₄', 'SO₂', 'PM2.5'].map((gas, index) => {
            const key = ['nh3', 'co2', 'ch4', 'so2', 'pm25'][index] as keyof typeof filteredData[0];
            const values = filteredData.map(d => d[key] as number);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);

            return (
              <div key={gas} className="p-4 rounded-lg bg-secondary/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{gas}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg:</span>
                    <span className="font-mono">{avg.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max:</span>
                    <span className="font-mono text-unhealthy">{max.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min:</span>
                    <span className="font-mono text-safe">{min.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default History;
