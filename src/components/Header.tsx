
import { useState, useEffect } from 'react';
import { calculateLivePortfolioMetrics } from '../data/livePortfolioData';
import { PortfolioMetrics } from '../data/portfolioData';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch live metrics
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-subtle py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium">P</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Portfolio Metrics</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          ) : metrics && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-medium" key={metrics.totalValue}>${metrics.totalValue.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">Today</span>
                <div className="flex items-center">
                  <span 
                    className={`font-medium ${metrics.dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    key={metrics.dailyChangePercent}
                  >
                    {metrics.dailyChangePercent >= 0 ? '+' : ''}
                    {metrics.dailyChangePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
