
import PortfolioMetrics from './PortfolioMetrics';
import PerformanceChart from './PerformanceChart';
import AssetAllocation from './AssetAllocation';
import AssetList from './AssetList';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-medium mb-4">Overview</h2>
        <PortfolioMetrics />
      </section>
      
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <AssetAllocation />
        </div>
      </section>
      
      <section>
        <AssetList />
      </section>
    </div>
  );
};

export default Dashboard;
