import { 
  Asset, 
  PortfolioMetrics, 
  AssetAllocation, 
  SectorAllocation, 
  assets as mockAssets
} from './portfolioData';
import { updateAssetWithLiveData } from '../services/yahooFinanceService';

// Cache for live assets to avoid too many API calls
let liveAssetsCache: Asset[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchLiveAssets = async (): Promise<Asset[]> => {
  const currentTime = Date.now();
  
  // Return cached data if it's still fresh
  if (liveAssetsCache && (currentTime - lastFetchTime < CACHE_DURATION)) {
    return liveAssetsCache;
  }
  
  try {
    // Use Promise.all to fetch all assets in parallel
    const updatedAssets = await Promise.all(
      mockAssets.map(asset => updateAssetWithLiveData(asset))
    );
    
    // Update cache
    liveAssetsCache = updatedAssets;
    lastFetchTime = currentTime;
    
    return updatedAssets;
  } catch (error) {
    console.error("Error fetching live assets:", error);
    // If we have cached data, return it even if expired
    if (liveAssetsCache) return liveAssetsCache;
    // Otherwise, fall back to mock data
    return mockAssets;
  }
};

export const calculateLivePortfolioMetrics = async (): Promise<PortfolioMetrics> => {
  const liveAssets = await fetchLiveAssets();
  
  const totalValue = liveAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const dailyChange = liveAssets.reduce(
    (sum, asset) => sum + (asset.value * asset.dailyChange) / 100,
    0
  );
  
  const dailyChangePercent = (dailyChange / totalValue) * 100;
  
  // For simplicity, we'll calculate other metrics based on daily metrics
  // In a real app, you would fetch more historical data for more accurate metrics
  return {
    totalValue,
    dailyChange,
    dailyChangePercent,
    weeklyChange: dailyChange * 5,
    weeklyChangePercent: dailyChangePercent * 5,
    monthlyChange: dailyChange * 22,
    monthlyChangePercent: dailyChangePercent * 22,
    yearlyChange: dailyChange * 252,
    yearlyChangePercent: dailyChangePercent * 252,
    allTimeChange: totalValue * 0.35, // Simplified
    allTimeChangePercent: 35, // Simplified
    volatility: 15, // Simplified
    sharpeRatio: 1.2, // Simplified
    averageYield: liveAssets.reduce((sum, asset) => sum + (asset.yield || 0) * (asset.allocation / 100), 0),
    duration: 5.4, // Simplified for fixed-income
  };
};

export const calculateLiveAssetAllocation = async (): Promise<AssetAllocation[]> => {
  const liveAssets = await fetchLiveAssets();
  const totalValue = liveAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const allocationByType: { [key: string]: number } = {};
  
  liveAssets.forEach((asset) => {
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

export const calculateLiveSectorAllocation = async (): Promise<SectorAllocation[]> => {
  const liveAssets = await fetchLiveAssets();
  const equities = liveAssets.filter((asset) => asset.type === 'equity');
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

export const getLivePortfolioPerformanceData = async (): Promise<number[]> => {
  const liveAssets = await fetchLiveAssets();
  const totalByDay: number[] = [];
  
  // If we have assets with historical data
  if (liveAssets.length > 0 && liveAssets[0].historicalPrices.length > 0) {
    const daysCount = liveAssets[0].historicalPrices.length;
    
    // Calculate portfolio total for each day
    for (let day = 0; day < daysCount; day++) {
      let dayTotal = 0;
      
      for (const asset of liveAssets) {
        // For assets with potentially mismatched historical data length
        if (day < asset.historicalPrices.length) {
          const ratio = asset.currentPrice / asset.historicalPrices[asset.historicalPrices.length - 1];
          dayTotal += (asset.historicalPrices[day] * ratio * asset.value) / asset.currentPrice;
        }
      }
      
      totalByDay.push(dayTotal);
    }
    
    return totalByDay;
  }
  
  // Fallback to a simple trend based on current total
  const totalValue = liveAssets.reduce((sum, asset) => sum + asset.value, 0);
  return Array(30).fill(0).map((_, i) => totalValue * (0.9 + i * 0.01));
};
