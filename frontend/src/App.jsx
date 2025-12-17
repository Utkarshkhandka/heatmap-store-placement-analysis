// File: src/App.jsx (UPDATED VERSION)
import React, { useState, useEffect } from 'react';
import { Store, MapPin, Database } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StoreAnalysis from './components/StoreAnalysis';
import CityAnalysis from './components/CityAnalysis';
import DataEntryModal from './components/DataEntryModal';
import { generateStoreHeatmapData, generateCityHeatmapData } from './utils/dataGenerator';
import { performClustering, generateAnalytics } from './utils/analytics';

const App = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [isSimulating, setIsSimulating] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    avgDwellTime: 0,
    conversionRate: 0,
    peakHours: []
  });
  
  // Modal states
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState('simulated'); // 'simulated' or 'manual'
  
  // Initialize data on mount
  useEffect(() => {
    resetData();
  }, []);
  
  // Simulation loop
  useEffect(() => {
    let interval;
    if (isSimulating && dataSource === 'simulated') {
      interval = setInterval(() => {
        setStoreData(generateStoreHeatmapData());
        setAnalytics(prev => ({
          ...prev,
          totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 10)
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, dataSource]);
  
  const resetData = () => {
    setStoreData(generateStoreHeatmapData());
    setCityData(generateCityHeatmapData());
    setClusters(performClustering());
    setAnalytics(generateAnalytics());
    setDataSource('simulated');
  };
  
  const handleToggleSimulation = () => {
    if (dataSource === 'manual') {
      alert('Simulation is disabled for manual data. Click "Use Simulated Data" to enable simulation.');
      return;
    }
    setIsSimulating(!isSimulating);
  };
  
  const handleReset = () => {
    setIsSimulating(false);
    resetData();
  };
  
  const handleExport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      dataSource: dataSource,
      analytics,
      clusters,
      cityRecommendations: cityData.slice(0, 3).map(c => c.name),
      storeHeatmapPoints: storeData.length,
      storeData: storeData,
      cityData: cityData
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-analysis-${dataSource}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Handle manual store data submission
  const handleStoreDataSubmit = (manualData) => {
    setIsSimulating(false);
    setStoreData(manualData);
    setClusters(performClustering());
    setDataSource('manual');
    
    // Update analytics based on manual data
    setAnalytics(prev => ({
      ...prev,
      totalVisitors: manualData.length
    }));
  };
  
  // Handle manual city data submission
  const handleCityDataSubmit = (manualData) => {
    setIsSimulating(false);
    setCityData(manualData);
    setDataSource('manual');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <Header 
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          onReset={handleReset}
          onExport={handleExport}
        />
        
        {/* Data Source Indicator */}
        <div className="mb-6 flex items-center justify-between bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">
              Current Data Source: 
              <span className={`ml-2 font-semibold ${dataSource === 'manual' ? 'text-green-400' : 'text-blue-400'}`}>
                {dataSource === 'manual' ? 'Manual/Practical Data' : 'Simulated Data'}
              </span>
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
            >
              <Store className="w-4 h-4" />
              Add Store Data
            </button>
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
            >
              <MapPin className="w-4 h-4" />
              Add City Data
            </button>
            {dataSource === 'manual' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-all"
              >
                Use Simulated Data
              </button>
            )}
          </div>
        </div>
        
        <Dashboard analytics={analytics} clusters={clusters} />
        
        <div className="bg-gray-800 rounded-lg mb-6 p-1">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('store')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'store' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Store className="w-5 h-5" />
              Store Analysis
            </button>
            <button
              onClick={() => setActiveTab('city')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'city' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <MapPin className="w-5 h-5" />
              City Placement
            </button>
          </div>
        </div>
        
        {activeTab === 'store' && (
          <StoreAnalysis 
            storeData={storeData}
            analytics={analytics}
            clusters={clusters}
          />
        )}
        
        {activeTab === 'city' && (
          <CityAnalysis cityData={cityData} />
        )}
        
        {isSimulating && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Live Simulation Active
          </div>
        )}
        
        {dataSource === 'manual' && (
          <div className="fixed bottom-6 left-6 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Database className="w-4 h-4" />
            Using Manual Data
          </div>
        )}
      </div>
      
      {/* Data Entry Modals */}
      <DataEntryModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onSubmit={handleStoreDataSubmit}
        type="store"
      />
      
      <DataEntryModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSubmit={handleCityDataSubmit}
        type="city"
      />
    </div>
  );
};

export default App;