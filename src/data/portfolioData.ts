
export interface Asset {
  id: string;
  name: string;
  ticker: string;
  type: 'equity' | 'fixed-income' | 'cash' | 'alternative';
  allocation: number;
  value: number;
  purchasePrice: number;
  currentPrice: number;
  dailyChange: number;
  historicalPrices: number[];
  sector?: string;
  maturity?: string;
  yield?: number;
  rating?: string;
}

export interface PortfolioMetrics {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChange: number;
  weeklyChangePercent: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  yearlyChange: number;
  yearlyChangePercent: number;
  allTimeChange: number;
  allTimeChangePercent: number;
  volatility: number;
  sharpeRatio: number;
  averageYield: number;
  duration?: number;
}

export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export const generateHistoricalPrices = (
  startPrice: number,
  volatility: number,
  dataPoints: number
): number[] => {
  const prices: number[] = [startPrice];
  
  for (let i = 1; i < dataPoints; i++) {
    const randomChange = (Math.random() - 0.5) * volatility;
    const newPrice = prices[i - 1] * (1 + randomChange);
    prices.push(Number(newPrice.toFixed(2)));
  }
  
  return prices;
};

export const assets: Asset[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    type: 'equity',
    allocation: 15,
    value: 56250,
    purchasePrice: 150.25,
    currentPrice: 187.50,
    dailyChange: 1.2,
    sector: 'Technology',
    historicalPrices: generateHistoricalPrices(150.25, 0.02, 30),
  },
  {
    id: '2',
    name: 'Microsoft Corporation',
    ticker: 'MSFT',
    type: 'equity',
    allocation: 12,
    value: 45000,
    purchasePrice: 310.75,
    currentPrice: 337.50,
    dailyChange: 0.5,
    sector: 'Technology',
    historicalPrices: generateHistoricalPrices(310.75, 0.015, 30),
  },
  {
    id: '3',
    name: 'Amazon.com Inc.',
    ticker: 'AMZN',
    type: 'equity',
    allocation: 10,
    value: 37500,
    purchasePrice: 140.50,
    currentPrice: 153.75,
    dailyChange: -0.7,
    sector: 'Consumer Discretionary',
    historicalPrices: generateHistoricalPrices(140.50, 0.025, 30),
  },
  {
    id: '4',
    name: 'US Treasury Bond',
    ticker: 'USTB',
    type: 'fixed-income',
    allocation: 20,
    value: 75000,
    purchasePrice: 995.50,
    currentPrice: 997.25,
    dailyChange: 0.1,
    maturity: '10Y',
    yield: 4.25,
    rating: 'AAA',
    historicalPrices: generateHistoricalPrices(995.50, 0.005, 30),
  },
  {
    id: '5',
    name: 'Corporate Bond ETF',
    ticker: 'CORP',
    type: 'fixed-income',
    allocation: 15,
    value: 56250,
    purchasePrice: 52.25,
    currentPrice: 51.75,
    dailyChange: -0.3,
    maturity: 'Various',
    yield: 5.75,
    rating: 'BBB',
    historicalPrices: generateHistoricalPrices(52.25, 0.01, 30),
  },
  {
    id: '6',
    name: 'Municipal Bond Fund',
    ticker: 'MUNI',
    type: 'fixed-income',
    allocation: 8,
    value: 30000,
    purchasePrice: 108.75,
    currentPrice: 109.50,
    dailyChange: 0.2,
    maturity: 'Various',
    yield: 3.85,
    rating: 'AA',
    historicalPrices: generateHistoricalPrices(108.75, 0.007, 30),
  },
  {
    id: '7',
    name: 'S&P 500 ETF',
    ticker: 'SPY',
    type: 'equity',
    allocation: 10,
    value: 37500,
    purchasePrice: 420.50,
    currentPrice: 445.25,
    dailyChange: 0.8,
    sector: 'Various',
    historicalPrices: generateHistoricalPrices(420.50, 0.018, 30),
  },
  {
    id: '8',
    name: 'Cash Reserve',
    ticker: 'CASH',
    type: 'cash',
    allocation: 5,
    value: 18750,
    purchasePrice: 1,
    currentPrice: 1,
    dailyChange: 0,
    yield: 1.5,
    historicalPrices: Array(30).fill(1),
  },
  {
    id: '9',
    name: 'Real Estate Investment Trust',
    ticker: 'REIT',
    type: 'alternative',
    allocation: 5,
    value: 18750,
    purchasePrice: 85.25,
    currentPrice: 87.50,
    dailyChange: 0.6,
    yield: 4.2,
    historicalPrices: generateHistoricalPrices(85.25, 0.02, 30),
  },
];

export const calculatePortfolioMetrics = (): PortfolioMetrics => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  const dailyChange = assets.reduce(
    (sum, asset) => sum + (asset.value * asset.dailyChange) / 100,
    0
  );
  
  const dailyChangePercent = (dailyChange / totalValue) * 100;
  
  // Simulate other metrics for the demo
  return {
    totalValue,
    dailyChange,
    dailyChangePercent,
    weeklyChange: dailyChange * 4.2,
    weeklyChangePercent: dailyChangePercent * 4.2,
    monthlyChange: dailyChange * 15.5,
    monthlyChangePercent: dailyChangePercent * 15.5,
    yearlyChange: dailyChange * 180,
    yearlyChangePercent: dailyChangePercent * 180,
    allTimeChange: totalValue * 0.35,
    allTimeChangePercent: 35,
    volatility: 12.8,
    sharpeRatio: 1.45,
    averageYield: 3.2,
    duration: 5.4,
  };
};

export const calculateAssetAllocation = (): AssetAllocation[] => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  const allocationByType: { [key: string]: number } = {};
  
  assets.forEach((asset) => {
    if (!allocationByType[asset.type]) {
      allocationByType[asset.type] = 0;
    }
    allocationByType[asset.type] += asset.value;
  });
  
  return Object.keys(allocationByType).map((type) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
    value: allocationByType[type],
    percentage: (allocationByType[type] / totalValue) * 100,
  }));
};

export const calculateSectorAllocation = (): SectorAllocation[] => {
  const equities = assets.filter((asset) => asset.type === 'equity');
  const totalEquityValue = equities.reduce((sum, asset) => sum + asset.value, 0);
  
  const allocationBySector: { [key: string]: number } = {};
  
  equities.forEach((asset) => {
    if (asset.sector) {
      if (!allocationBySector[asset.sector]) {
        allocationBySector[asset.sector] = 0;
      }
      allocationBySector[asset.sector] += asset.value;
    }
  });
  
  return Object.keys(allocationBySector).map((sector) => ({
    sector,
    value: allocationBySector[sector],
    percentage: (allocationBySector[sector] / totalEquityValue) * 100,
  }));
};

export const getPortfolioPerformanceData = () => {
  // Simulate portfolio performance over 30 days
  const startValue = calculatePortfolioMetrics().totalValue * 0.85;
  return generateHistoricalPrices(startValue, 0.01, 30);
};

export const portfolioMetrics = calculatePortfolioMetrics();
export const assetAllocation = calculateAssetAllocation();
export const sectorAllocation = calculateSectorAllocation();
export const performanceData = getPortfolioPerformanceData();
