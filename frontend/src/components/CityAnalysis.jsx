import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, Store } from 'lucide-react';

const CityAnalysis = ({ cityData }) => {
  const topCities = [...cityData].sort((a, b) => b.score - a.score).slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-400" />
          City Demand Distribution
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="lon" name="Longitude" stroke="#9CA3AF" />
            <YAxis dataKey="lat" name="Latitude" stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F3F4F6' }}
              formatter={(value, name) => {
                if (name === 'demand') return [value, 'Demand Score'];
                return [value, name];
              }}
            />
            <Scatter name="Locations" data={cityData} fill="#8B5CF6">
              {cityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score > 800 ? '#10B981' : entry.score > 600 ? '#F59E0B' : '#EF4444'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-green-400" />
            Top Recommended Locations
          </h3>
          <div className="space-y-3">
            {topCities.map((city, idx) => (
              <div key={idx} className="bg-gradient-to-r from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">{idx + 1}. {city.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    idx === 0 ? 'bg-green-600' : idx === 1 ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    Score: {city.score}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Demand:</span>
                    <span className="ml-2 text-white font-medium">{city.demand}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Population:</span>
                    <span className="ml-2 text-white font-medium">{(city.population / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">All City Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr className="text-gray-400">
                  <th className="text-left py-2">Location</th>
                  <th className="text-right py-2">Demand</th>
                  <th className="text-right py-2">Population</th>
                  <th className="text-right py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {cityData.map((city, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-2">{city.name}</td>
                    <td className="text-right">{city.demand}</td>
                    <td className="text-right">{(city.population / 1000).toFixed(0)}K</td>
                    <td className="text-right font-medium text-blue-400">{city.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityAnalysis;