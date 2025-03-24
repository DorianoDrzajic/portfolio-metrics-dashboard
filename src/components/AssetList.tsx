
import { useState } from 'react';
import AssetCard from './AssetCard';
import { assets, Asset } from '../data/portfolioData';

type SortField = 'name' | 'value' | 'allocation' | 'dailyChange' | 'yield';
type SortOrder = 'asc' | 'desc';
type AssetType = 'all' | 'equity' | 'fixed-income' | 'cash' | 'alternative';

const AssetList = () => {
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('all');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  const filteredAssets = assets.filter((asset) => 
    assetTypeFilter === 'all' || asset.type === assetTypeFilter
  );
  
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let aValue: any = a[sortField as keyof Asset];
    let bValue: any = b[sortField as keyof Asset];
    
    // Handle special cases
    if (sortField === 'yield') {
      aValue = a.yield || 0;
      bValue = b.yield || 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  const assetTypes: { value: AssetType, label: string }[] = [
    { value: 'all', label: 'All Assets' },
    { value: 'equity', label: 'Equities' },
    { value: 'fixed-income', label: 'Fixed Income' },
    { value: 'cash', label: 'Cash' },
    { value: 'alternative', label: 'Alternatives' },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-card p-6 animate-scale-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Portfolio Assets</h3>
        
        <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
          {assetTypes.map((type) => (
            <button
              key={type.value}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                assetTypeFilter === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setAssetTypeFilter(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default AssetList;
