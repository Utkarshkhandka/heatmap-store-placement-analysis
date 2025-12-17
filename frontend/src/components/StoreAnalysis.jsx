import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import RealisticStoreHeatmap from './RealisticStoreHeatmap';

const StoreAnalysis = ({ storeData, analytics, clusters }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RealisticStoreHeatmap 
        data={storeData} 
        width={50} 
        height={30} 
        title="Store Traffic Heatmap - Floor Plan View" 
      />
      
      <div className="space-y-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Peak Hours Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="visitors" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Zone Recommendations
          </h3>
          <div className="space-y-3">
            {clusters.map((cluster, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-400">{cluster.zone}</span>
                  <span className="text-sm text-gray-400">{cluster.avgTraffic} visitors/hr</span>
                </div>
                <p className="text-sm text-gray-300">{cluster.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalysis;