
import { Asset } from '../data/portfolioData';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard = ({ asset }: AssetCardProps) => {
  const priceChange = asset.currentPrice - asset.purchasePrice;
  const priceChangePercentage = (priceChange / asset.purchasePrice) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-base">{asset.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">{asset.ticker}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-base font-medium">${asset.currentPrice.toFixed(2)}</div>
          <div
            className={`text-sm ${
              asset.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {asset.dailyChange >= 0 ? '+' : ''}
            {asset.dailyChange.toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-3 mt-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Value</div>
            <div className="font-medium">${asset.value.toLocaleString()}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground">Allocation</div>
            <div className="font-medium">{asset.allocation.toFixed(1)}%</div>
          </div>
          
          {asset.sector && (
            <div>
              <div className="text-muted-foreground">Sector</div>
              <div className="font-medium">{asset.sector}</div>
            </div>
          )}
          
          {asset.yield && (
            <div>
              <div className="text-muted-foreground">Yield</div>
              <div className="font-medium">{asset.yield.toFixed(2)}%</div>
            </div>
          )}
          
          {asset.maturity && (
            <div>
              <div className="text-muted-foreground">Maturity</div>
              <div className="font-medium">{asset.maturity}</div>
            </div>
          )}
          
          {asset.rating && (
            <div>
              <div className="text-muted-foreground">Rating</div>
              <div className="font-medium">{asset.rating}</div>
            </div>
          )}
          
          <div>
            <div className="text-muted-foreground">Purchase Price</div>
            <div className="font-medium">${asset.purchasePrice.toFixed(2)}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground">Return</div>
            <div className={`font-medium ${priceChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChangePercentage >= 0 ? '+' : ''}
              {priceChangePercentage.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
