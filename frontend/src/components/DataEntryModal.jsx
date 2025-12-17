import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

const DataEntryModal = ({ isOpen, onClose, onSubmit, type }) => {
  const [manualEntries, setManualEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(
    type === 'store' 
      ? { x: '', y: '', intensity: '' }
      : { name: '', lat: '', lon: '', demand: '', population: '' }
  );

  if (!isOpen) return null;

  const handleAddEntry = () => {
    if (type === 'store') {
      if (currentEntry.x && currentEntry.y && currentEntry.intensity) {
        setManualEntries([...manualEntries, {
          x: parseFloat(currentEntry.x),
          y: parseFloat(currentEntry.y),
          intensity: parseFloat(currentEntry.intensity)
        }]);
        setCurrentEntry({ x: '', y: '', intensity: '' });
      }
    } else {
      if (currentEntry.name && currentEntry.lat && currentEntry.lon && currentEntry.demand && currentEntry.population) {
        setManualEntries([...manualEntries, {
          name: currentEntry.name,
          lat: parseFloat(currentEntry.lat),
          lon: parseFloat(currentEntry.lon),
          demand: parseInt(currentEntry.demand),
          population: parseInt(currentEntry.population),
          score: (parseInt(currentEntry.demand) * 0.6 + parseInt(currentEntry.population) / 1000 * 0.4).toFixed(2)
        }]);
        setCurrentEntry({ name: '', lat: '', lon: '', demand: '', population: '' });
      }
    }
  };

  const handleRemoveEntry = (index) => {
    setManualEntries(manualEntries.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (manualEntries.length > 0) {
      onSubmit(manualEntries);
      setManualEntries([]);
      onClose();
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').slice(1); // Skip header
        const parsedData = rows
          .filter(row => row.trim())
          .map(row => {
            const cols = row.split(',');
            if (type === 'store') {
              return {
                x: parseFloat(cols[0]),
                y: parseFloat(cols[1]),
                intensity: parseFloat(cols[2] || 1.0)
              };
            } else {
              return {
                name: cols[0]?.trim(),
                lat: parseFloat(cols[1]),
                lon: parseFloat(cols[2]),
                demand: parseInt(cols[3]),
                population: parseInt(cols[4]),
                score: (parseInt(cols[3]) * 0.6 + parseInt(cols[4]) / 1000 * 0.4).toFixed(2)
              };
            }
          });
        setManualEntries(parsedData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {type === 'store' ? 'Add Store Data' : 'Add City Location Data'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CSV Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload CSV File
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </label>
            <span className="text-gray-400 text-sm">
              {type === 'store' ? 'Format: x,y,intensity' : 'Format: name,lat,lon,demand,population'}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Or Enter Manually</h3>
          
          {type === 'store' ? (
            // Store Entry Form
            <div className="grid grid-cols-4 gap-3 mb-4">
              <input
                type="number"
                placeholder="X coordinate"
                value={currentEntry.x}
                onChange={(e) => setCurrentEntry({...currentEntry, x: e.target.value})}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Y coordinate"
                value={currentEntry.y}
                onChange={(e) => setCurrentEntry({...currentEntry, y: e.target.value})}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Intensity (0-1)"
                value={currentEntry.intensity}
                onChange={(e) => setCurrentEntry({...currentEntry, intensity: e.target.value})}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddEntry}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          ) : (
            // City Entry Form
            <div className="grid grid-cols-6 gap-3 mb-4">
              <input
                type="text"
                placeholder="Location Name"
                value={currentEntry.name}
                onChange={(e) => setCurrentEntry({...currentEntry, name: e.target.value})}
                className="col-span-2 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Latitude"
                value={currentEntry.lat}
                onChange={(e) => setCurrentEntry({...currentEntry, lat: e.target.value})}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Longitude"
                value={currentEntry.lon}
                onChange={(e) => setCurrentEntry({...currentEntry, lon: e.target.value})}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Demand"
                value={currentEntry.demand}
                onChange={(e) => setCurrentEntry({...currentEntry, demand: e.target.value})}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Population"
                value={currentEntry.population}
                onChange={(e) => setCurrentEntry({...currentEntry, population: e.target.value})}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddEntry}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          )}

          {/* Entries List */}
          {manualEntries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">Added Entries ({manualEntries.length})</h4>
              <div className="bg-gray-900 rounded-lg p-3 max-h-60 overflow-y-auto">
                {manualEntries.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-800 rounded p-2 mb-2">
                    <span className="text-sm text-gray-300">
                      {type === 'store' 
                        ? `(${entry.x.toFixed(2)}, ${entry.y.toFixed(2)}) - Intensity: ${entry.intensity.toFixed(2)}`
                        : `${entry.name} - Lat: ${entry.lat}, Lon: ${entry.lon}, Demand: ${entry.demand}, Pop: ${entry.population}`
                      }
                    </span>
                    <button
                      onClick={() => handleRemoveEntry(idx)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={manualEntries.length === 0}
            className={`px-6 py-2 rounded-lg transition-all ${
              manualEntries.length > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Submit {manualEntries.length} Entries
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataEntryModal;