
import { portfolioMetrics } from '../data/portfolioData';

const MetricCard = ({ 
  title, 
  value, 
  subValue,
  isPercentage = false,
  isCurrency = false,
  isPositiveGood = true
}: { 
  title: string; 
  value: number;
  subValue?: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  isPositiveGood?: boolean;
}) => {
  const isPositive = subValue ? subValue > 0 : value > 0;
  const displayColor = isPositive === isPositiveGood ? 'text-green-600' : 'text-red-600';
  
  const formatValue = (val: number) => {
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
    </div>
  );
};

const PortfolioMetrics = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      <MetricCard
        title="Total Value"
        value={portfolioMetrics.totalValue}
        isCurrency
      />
      <MetricCard
        title="Daily Change"
        value={portfolioMetrics.dailyChange}
        subValue={portfolioMetrics.dailyChangePercent}
        isCurrency
        isPercentage={false}
      />
      <MetricCard
        title="Volatility (Annualized)"
        value={portfolioMetrics.volatility}
        isPercentage
        isPositiveGood={false}
      />
      <MetricCard
        title="Sharpe Ratio"
        value={portfolioMetrics.sharpeRatio}
        isPositiveGood={true}
      />
      <MetricCard
        title="Average Yield"
        value={portfolioMetrics.averageYield}
        isPercentage
        isPositiveGood={true}
      />
      <MetricCard
        title="Duration"
        value={portfolioMetrics.duration || 0}
        isPositiveGood={true}
      />
      <MetricCard
        title="YTD Return"
        value={portfolioMetrics.yearlyChangePercent}
        isPercentage
        isPositiveGood={true}
      />
      <MetricCard
        title="All Time Return"
        value={portfolioMetrics.allTimeChangePercent}
        isPercentage
        isPositiveGood={true}
      />
    </div>
  );
};

export default PortfolioMetrics;
