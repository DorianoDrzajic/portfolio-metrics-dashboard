
import { useState } from 'react';
import { portfolioMetrics } from '../data/portfolioData';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add scroll event listener
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

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
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="font-medium">${portfolioMetrics.totalValue.toLocaleString()}</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Today</span>
            <div className="flex items-center">
              <span className={`font-medium ${portfolioMetrics.dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioMetrics.dailyChangePercent >= 0 ? '+' : ''}
                {portfolioMetrics.dailyChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
