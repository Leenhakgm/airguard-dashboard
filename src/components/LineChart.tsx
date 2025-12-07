import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { HistoricalData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface LineChartProps {
  data: HistoricalData[];
  dataKeys: string[];
  isLoading?: boolean;
}

const colors: Record<string, string> = {
  nh3: 'hsl(280, 85%, 65%)',
  co2: 'hsl(200, 85%, 55%)',
  ch4: 'hsl(120, 65%, 50%)',
  so2: 'hsl(40, 95%, 55%)',
  pm25: 'hsl(340, 75%, 55%)',
  temperature: 'hsl(15, 85%, 55%)',
  humidity: 'hsl(200, 75%, 55%)',
};

const labels: Record<string, string> = {
  nh3: 'NH₃ (ppm)',
  co2: 'CO₂ (ppm)',
  ch4: 'CH₄ (ppm)',
  so2: 'SO₂ (ppb)',
  pm25: 'PM2.5 (µg/m³)',
  temperature: 'Temperature (°C)',
  humidity: 'Humidity (%)',
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const LineChartComponent: React.FC<LineChartProps> = ({ data, dataKeys, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-medium mb-2">
            {formatTime(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{labels[entry.dataKey] || entry.dataKey}:</span>
              <span className="font-mono font-medium">{entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {dataKeys.map(key => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[key]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[key]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" strokeOpacity={0.3} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            stroke="hsl(215, 20%, 65%)"
            tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
          />
          <YAxis
            stroke="hsl(215, 20%, 65%)"
            tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => labels[value] || value}
            wrapperStyle={{ paddingTop: 20 }}
          />
          {dataKeys.map(key => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[key]}
              strokeWidth={2}
              fill={`url(#gradient-${key})`}
              dot={false}
              activeDot={{ r: 4, fill: colors[key] }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MultiLineChartProps {
  data: HistoricalData[];
  isLoading?: boolean;
}

export const PollutantChart: React.FC<MultiLineChartProps> = ({ data, isLoading }) => (
  <LineChartComponent
    data={data}
    dataKeys={['nh3', 'co2', 'ch4', 'so2', 'pm25']}
    isLoading={isLoading}
  />
);

export const EnvironmentalChart: React.FC<MultiLineChartProps> = ({ data, isLoading }) => (
  <LineChartComponent
    data={data}
    dataKeys={['temperature', 'humidity']}
    isLoading={isLoading}
  />
);
