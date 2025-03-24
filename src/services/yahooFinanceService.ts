
import { Asset } from "../data/portfolioData";

const YF_BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart/";

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
        chartPreviousClose: number;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          close: (number | null)[];
        }>;
      };
    }>;
    error: any;
  };
}

export const fetchCurrentPrice = async (ticker: string): Promise<{
  currentPrice: number;
  previousClose: number;
  dailyChange: number;
}> => {
  try {
    const response = await fetch(`${YF_BASE_URL}${ticker}?interval=1d`, {
      cache: 'no-store', // Prevent caching to get fresh data each time
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioApp/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.statusText}`);
    }
    
    const data: YahooFinanceResponse = await response.json();
    
    if (data.chart.error) {
      throw new Error(`Yahoo Finance data error: ${data.chart.error}`);
    }
    
    const result = data.chart.result[0];
    const currentPrice = result.meta.regularMarketPrice;
    const previousClose = result.meta.previousClose;
    const dailyChange = ((currentPrice - previousClose) / previousClose) * 100;
    
    return {
      currentPrice,
      previousClose,
      dailyChange
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
};

export const fetchHistoricalPrices = async (ticker: string, days: number = 30): Promise<number[]> => {
  try {
    // Calculate date range
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - (days * 24 * 60 * 60);
    
    const response = await fetch(
      `${YF_BASE_URL}${ticker}?period1=${startDate}&period2=${endDate}&interval=1d`,
      {
        cache: 'no-store', // Prevent caching to get fresh data each time
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; PortfolioApp/1.0)'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.statusText}`);
    }
    
    const data: YahooFinanceResponse = await response.json();
    
    if (data.chart.error) {
      throw new Error(`Yahoo Finance data error: ${data.chart.error}`);
    }
    
    const result = data.chart.result[0];
    const closes = result.indicators.quote[0].close;
    
    // Filter out null values and return the array of closing prices
    return closes.filter((price): price is number => price !== null);
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    throw error;
  }
};

export const updateAssetWithLiveData = async (asset: Asset): Promise<Asset> => {
  try {
    // Skip updating cash type assets as they don't have market prices
    if (asset.type === 'cash') {
      return asset;
    }
    
    const { currentPrice, dailyChange } = await fetchCurrentPrice(asset.ticker);
    const historicalPrices = await fetchHistoricalPrices(asset.ticker);
    
    // Calculate new value based on current price
    const shares = asset.value / asset.currentPrice;
    const newValue = shares * currentPrice;
    
    return {
      ...asset,
      currentPrice,
      dailyChange,
      historicalPrices,
      value: newValue
    };
  } catch (error) {
    console.error(`Failed to update asset ${asset.ticker}:`, error);
    // Return the original asset if we can't update it
    return asset;
  }
};
