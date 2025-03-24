
import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';
import { getLivePortfolioPerformanceData } from '../data/livePortfolioData';
import { calculateLivePortfolioMetrics } from '../data/livePortfolioData';

type TimeRange = '1W' | '1M' | '3M' | '1Y' | 'ALL';

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [chartData, setChartData] = useState<{date: string, value: number}[]>([]);
  const [metrics, setMetrics] = useState({
    lastValue: 0,
    changePercent: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch live performance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get performance data
        const performanceData = await getLivePortfolioPerformanceData();
        
        // Get metrics for display
        const portfolioMetrics = await calculateLivePortfolioMetrics();
        
        // Transform the data for the chart
        const formattedData = performanceData.map((value, index) => ({
          date: new Date(Date.now() - (performanceData.length - 1 - index) * 24 * 60 * 60 * 1000)
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value
        }));
        
        // Filter based on selected time range
        const filteredData = getFilteredData(formattedData, timeRange);
        
        setChartData(filteredData);
        
        // Calculate the performance metrics
        if (filteredData.length > 0) {
          const firstValue = filteredData[0]?.value || 0;
          const lastValue = filteredData[filteredData.length - 1]?.value || 0;
          const changeValue = lastValue - firstValue;
          const changePercent = (changeValue / firstValue) * 100;
          
          setMetrics({
            lastValue,
            changePercent
          });
        } else {
          setMetrics({
            lastValue: portfolioMetrics.totalValue,
            changePercent: portfolioMetrics.dailyChangePercent
          });
        }
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [timeRange]);
  
  const getFilteredData = (data: {date: string, value: number}[], range: TimeRange) => {
    switch (range) {
      case '1W':
        return data.slice(-7);
      case '1M':
        return data.slice(-30);
      case '3M':
        return data.slice(-90);
      case '1Y':
        return data.slice(-365);
      case 'ALL':
        return data;
      default:
        return data;
    }
  };
  
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
          {loading ? (
            <div className="flex items-center mt-1">
              <div className="h-7 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="ml-3 h-5 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          ) : (
            <div className="flex items-center mt-1">
              <span className="text-2xl font-medium">${metrics.lastValue.toLocaleString()}</span>
              <span 
                className={`ml-3 px-2 py-0.5 rounded text-sm ${
                  metrics.changePercent >= 0 
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {metrics.changePercent >= 0 ? '+' : ''}
                {metrics.changePercent.toFixed(2)}%
              </span>
            </div>
          )}
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
              disabled={loading}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-72">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={metrics.changePercent >= 0 ? '#3B82F6' : '#EF4444'} 
                    stopOpacity={0.8}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={metrics.changePercent >= 0 ? '#3B82F6' : '#EF4444'} 
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
                stroke={metrics.changePercent >= 0 ? '#3B82F6' : '#EF4444'}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={750}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
