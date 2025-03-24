
import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';
import { performanceData } from '../data/portfolioData';

type TimeRange = '1W' | '1M' | '3M' | '1Y' | 'ALL';

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  
  // Prepare data based on selected time range
  const getChartData = () => {
    // In a real app, you would filter data based on the selected range
    // For this demo, we'll just use different subsets of our sample data
    
    const data = performanceData.map((value, index) => ({
      date: new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      value
    }));
    
    switch (timeRange) {
      case '1W':
        return data.slice(-7);
      case '1M':
        return data;
      case '3M':
        return [...data, ...data, ...data].slice(0, 90);
      case '1Y':
        return [...data, ...data, ...data, ...data].slice(0, 365);
      case 'ALL':
        return [...data, ...data, ...data, ...data].slice(0, 365);
      default:
        return data;
    }
  };
  
  const chartData = getChartData();
  
  // Calculate performance values for display
  const firstValue = chartData[0]?.value || 0;
  const lastValue = chartData[chartData.length - 1]?.value || 0;
  const changeValue = lastValue - firstValue;
  const changePercent = (changeValue / firstValue) * 100;
  
  const timeRangeOptions: TimeRange[] = ['1W', '1M', '3M', '1Y', 'ALL'];
  
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };
  
  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-sm font-medium">{formatTooltipValue(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 transition-all animate-scale-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium">Portfolio Performance</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-medium">${lastValue.toLocaleString()}</span>
            <span 
              className={`ml-3 px-2 py-0.5 rounded text-sm ${
                changePercent >= 0 
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {changePercent >= 0 ? '+' : ''}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-1 rounded-lg bg-secondary p-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === option
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setTimeRange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={changePercent >= 0 ? '#3B82F6' : '#EF4444'} 
                  stopOpacity={0.8}
                />
                <stop 
                  offset="95%" 
                  stopColor={changePercent >= 0 ? '#3B82F6' : '#EF4444'} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxisTick}
              tick={{ fontSize: 12, fill: '#64748b' }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={changePercent >= 0 ? '#3B82F6' : '#EF4444'}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={750}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
