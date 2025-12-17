import React from 'react';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';

const Header = ({ isSimulating, onToggleSimulation, onReset, onExport }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Heatmap Analysis System
          </h1>
          <p className="text-gray-400">Store & City Placement Intelligence Platform</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isSimulating 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isSimulating ? 'Pause' : 'Start'} Simulation
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;