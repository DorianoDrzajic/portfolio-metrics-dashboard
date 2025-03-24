
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { assetAllocation } from '../data/portfolioData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A374DB'];

const AssetAllocation = () => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 transition-all animate-scale-in">
      <h3 className="text-lg font-medium mb-4">Asset Allocation</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={assetAllocation}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationDuration={750}
              animationBegin={100}
            >
              {assetAllocation.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              labelFormatter={(index) => assetAllocation[index].type}
              contentStyle={{
                borderRadius: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                border: 'none',
                padding: '8px 12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid gap-2">
        {assetAllocation.map((item, index) => (
          <div key={item.type} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.type}</span>
            </div>
            <div className="flex space-x-4">
              <span className="text-muted-foreground">{item.percentage.toFixed(1)}%</span>
              <span className="font-medium">${item.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetAllocation;
