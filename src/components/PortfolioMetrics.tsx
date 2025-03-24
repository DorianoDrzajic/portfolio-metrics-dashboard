
import { useState, useEffect } from 'react';
import { PortfolioMetrics as PortfolioMetricsType } from '../data/portfolioData';
import { calculateLivePortfolioMetrics } from '../data/livePortfolioData';

const MetricCard = ({ 
  title, 
  value, 
  subValue,
  isPercentage = false,
  isCurrency = false,
  isPositiveGood = true,
  loading = false
}: { 
  title: string; 
  value?: number;
  subValue?: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  isPositiveGood?: boolean;
  loading?: boolean;
}) => {
  const isPositive = subValue ? subValue > 0 : value ? value > 0 : false;
  const displayColor = isPositive === isPositiveGood ? 'text-green-600' : 'text-red-600';
  
  const formatValue = (val?: number) => {
    if (val === undefined) return '—';
    if (isCurrency) {
      return `$${val.toLocaleString()}`;
    }
    if (isPercentage) {
      return `${val.toFixed(2)}%`;
    }
    return val.toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-subtle p-4 transition-all hover:shadow-card">
      <h4 className="text-sm text-muted-foreground mb-1">{title}</h4>
      {loading ? (
        <div className="flex items-baseline space-x-2">
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
          {subValue !== undefined && <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>}
        </div>
      ) : (
        <div className="flex items-baseline">
          <span className="text-lg font-medium">
            {formatValue(value)}
          </span>
          {subValue !== undefined && (
            <span className={`ml-2 text-sm ${displayColor}`}>
              {subValue > 0 ? '+' : ''}
              {formatValue(subValue)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const PortfolioMetrics = () => {
  const [metrics, setMetrics] = useState<PortfolioMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const liveMetrics = await calculateLivePortfolioMetrics();
        setMetrics(liveMetrics);
      } catch (error) {
        console.error("Failed to fetch portfolio metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Refresh every 5 seconds
    const intervalId = setInterval(fetchMetrics, 5 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      <MetricCard
        title="Total Value"
        value={metrics?.totalValue}
        isCurrency
        loading={loading}
      />
      <MetricCard
        title="Daily Change"
        value={metrics?.dailyChange}
        subValue={metrics?.dailyChangePercent}
        isCurrency
        isPercentage={false}
        loading={loading}
      />
      <MetricCard
        title="Volatility (Annualized)"
        value={metrics?.volatility}
        isPercentage
        isPositiveGood={false}
        loading={loading}
      />
      <MetricCard
        title="Sharpe Ratio"
        value={metrics?.sharpeRatio}
        isPositiveGood={true}
        loading={loading}
      />
      <MetricCard
        title="Average Yield"
        value={metrics?.averageYield}
        isPercentage
        isPositiveGood={true}
        loading={loading}
      />
      <MetricCard
        title="Duration"
        value={metrics?.duration || 0}
        isPositiveGood={true}
        loading={loading}
      />
      <MetricCard
        title="YTD Return"
        value={metrics?.yearlyChangePercent}
        isPercentage
        isPositiveGood={true}
        loading={loading}
      />
      <MetricCard
        title="All Time Return"
        value={metrics?.allTimeChangePercent}
        isPercentage
        isPositiveGood={true}
        loading={loading}
      />
    </div>
  );
};

export default PortfolioMetrics;
