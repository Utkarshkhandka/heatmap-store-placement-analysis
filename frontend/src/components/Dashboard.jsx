import React from 'react';
import { Activity, Zap, TrendingUp, Store } from 'lucide-react';

const Dashboard = ({ analytics, clusters }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Total Visitors</p>
            <p className="text-3xl font-bold mt-1">{analytics.totalVisitors}</p>
          </div>
          <Activity className="w-10 h-10 text-blue-300" />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm">Avg Dwell Time</p>
            <p className="text-3xl font-bold mt-1">{analytics.avgDwellTime}m</p>
          </div>
          <Zap className="w-10 h-10 text-purple-300" />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200 text-sm">Conversion Rate</p>
            <p className="text-3xl font-bold mt-1">{analytics.conversionRate}%</p>
          </div>
          <TrendingUp className="w-10 h-10 text-green-300" />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-200 text-sm">Active Zones</p>
            <p className="text-3xl font-bold mt-1">{clusters.length}</p>
          </div>
          <Store className="w-10 h-10 text-orange-300" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;