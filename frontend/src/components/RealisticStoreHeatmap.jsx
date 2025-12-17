// File: src/components/RealisticStoreHeatmap.jsx
import React, { useRef, useEffect } from 'react';
import { Activity, Store } from 'lucide-react';

const RealisticStoreHeatmap = ({ data, width = 50, height = 30, title }) => {
  const canvasRef = useRef(null);
  
  // Store layout sections
  const storeLayout = {
    entrance: { x: 5, y: 5, w: 8, h: 5, label: 'Entrance', color: '#3B82F6' },
    electronics: { x: 35, y: 5, w: 12, h: 10, label: 'Electronics', color: '#8B5CF6' },
    clothing: { x: 10, y: 12, w: 15, h: 8, label: 'Clothing', color: '#EC4899' },
    groceries: { x: 28, y: 17, w: 18, h: 10, label: 'Groceries', color: '#10B981' },
    checkout: { x: 8, y: 22, w: 10, h: 6, label: 'Checkout', color: '#F59E0B' },
    furniture: { x: 5, y: 12, w: 4, h: 8, label: 'Home', color: '#6366F1' }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const scale = 12;
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Background - darker store floor for better contrast
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw store sections with stronger borders
    ctx.lineWidth = 3;
    Object.entries(storeLayout).forEach(([key, section]) => {
      // Section background - semi-transparent
      ctx.fillStyle = section.color + '20';
      ctx.fillRect(
        section.x * scale,
        section.y * scale,
        section.w * scale,
        section.h * scale
      );
      
      // Section border - bright and visible
      ctx.strokeStyle = section.color;
      ctx.strokeRect(
        section.x * scale,
        section.y * scale,
        section.w * scale,
        section.h * scale
      );
      
      // Section label with background
      ctx.fillStyle = section.color + '40';
      const labelWidth = ctx.measureText(section.label).width;
      ctx.fillRect(
        (section.x + section.w / 2 - labelWidth / 2 - 8) * scale / scale,
        (section.y + section.h / 2 - 10),
        labelWidth + 16,
        20
      );
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        section.label,
        (section.x + section.w / 2) * scale,
        (section.y + section.h / 2 + 4) * scale / scale
      );
    });
    
    // Draw aisles (walkways) with better visibility
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    
    // Horizontal aisles
    for (let y = 10; y < height; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(width * scale, y * scale);
      ctx.stroke();
    }
    
    // Vertical aisles
    for (let x = 15; x < width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, height * scale);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Create heat grid from data points
    const grid = Array(height).fill().map(() => Array(width).fill(0));
    
    data.forEach(point => {
      const gx = Math.floor(point.x);
      const gy = Math.floor(point.y);
      if (gx >= 0 && gx < width && gy >= 0 && gy < height) {
        grid[gy][gx] += point.intensity;
      }
    });
    
    const maxVal = Math.max(...grid.flat(), 0.1);
    
    // Draw heatmap overlay with MUCH better visibility
    ctx.globalCompositeOperation = 'screen'; // Changed for better blending
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = grid[y][x] / maxVal;
        if (val > 0.05) {
          // Create radial gradient for each hot spot
          const gradient = ctx.createRadialGradient(
            (x + 0.5) * scale,
            (y + 0.5) * scale,
            0,
            (x + 0.5) * scale,
            (y + 0.5) * scale,
            scale * 2.5
          );
          
          const intensity = Math.min(val, 1);
          
          // Much brighter and more visible colors
          if (intensity > 0.7) {
            // HOT - Bright Red/Orange
            gradient.addColorStop(0, `rgba(255, 50, 50, ${intensity})`);
            gradient.addColorStop(0.5, `rgba(255, 100, 50, ${intensity * 0.7})`);
            gradient.addColorStop(1, `rgba(255, 50, 50, 0)`);
          } else if (intensity > 0.4) {
            // WARM - Bright Yellow/Orange
            gradient.addColorStop(0, `rgba(255, 200, 50, ${intensity * 0.9})`);
            gradient.addColorStop(0.5, `rgba(255, 150, 50, ${intensity * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 200, 50, 0)`);
          } else {
            // COOL - Bright Cyan/Blue
            gradient.addColorStop(0, `rgba(50, 200, 255, ${intensity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(50, 150, 255, ${intensity * 0.5})`);
            gradient.addColorStop(1, `rgba(50, 200, 255, 0)`);
          }
          
          ctx.fillStyle = gradient;
          ctx.fillRect((x - 2) * scale, (y - 2) * scale, scale * 5, scale * 5);
        }
      }
    }
    
    // Add glow effect for hot spots
    data.forEach(point => {
      if (point.intensity > 0.7) {
        const gradient = ctx.createRadialGradient(
          point.x * scale,
          point.y * scale,
          0,
          point.x * scale,
          point.y * scale,
          scale * 3
        );
        
        gradient.addColorStop(0, `rgba(255, 80, 80, ${point.intensity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(255, 120, 80, ${point.intensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 80, 80, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          (point.x - 2) * scale,
          (point.y - 2) * scale,
          scale * 4,
          scale * 4
        );
      }
    });
    
    ctx.globalCompositeOperation = 'source-over';
    
    // Redraw section borders on top for clarity
    ctx.lineWidth = 3;
    Object.entries(storeLayout).forEach(([key, section]) => {
      ctx.strokeStyle = section.color;
      ctx.strokeRect(
        section.x * scale,
        section.y * scale,
        section.w * scale,
        section.h * scale
      );
    });
    
    // Draw entrance marker with glow
    ctx.shadowColor = '#3B82F6';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(5 * scale, 5 * scale, 8 * scale, 3);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px Arial';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 5;
    ctx.fillText('⬇ ENTRANCE', 9 * scale, 3.5 * scale);
    ctx.shadowBlur = 0;
    
    // Draw shopping cart icons at checkout with glow
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFD700';
    ctx.font = '18px Arial';
    ctx.fillText('🛒', 10 * scale, 26 * scale);
    ctx.fillText('🛒', 14 * scale, 26 * scale);
    ctx.shadowBlur = 0;
    
    // Draw exit marker with glow
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('EXIT ⬆', 40 * scale, 29 * scale);
    ctx.shadowBlur = 0;
    
    // Add subtle grid for reference
    ctx.strokeStyle = '#ffffff12';
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += 5) {
      ctx.beginPath();
      ctx.moveTo(i * scale, 0);
      ctx.lineTo(i * scale, height * scale);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 5) {
      ctx.beginPath();
      ctx.moveTo(0, i * scale);
      ctx.lineTo(width * scale, i * scale);
      ctx.stroke();
    }
    
  }, [data, width, height]);
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-400" />
          {title}
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
            <span className="text-gray-300 font-medium">High Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
            <span className="text-gray-300 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
            <span className="text-gray-300 font-medium">Low</span>
          </div>
        </div>
      </div>
      
      <div className="relative bg-gray-950 rounded-lg p-2">
        <canvas ref={canvasRef} className="w-full border-2 border-gray-700 rounded shadow-2xl" />
      </div>
      
      {/* Store Legend */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2 bg-gray-800 rounded p-2 border border-gray-700">
          <div className="w-4 h-4 rounded shadow-lg" style={{ backgroundColor: '#3B82F6', boxShadow: '0 0 10px #3B82F6' }}></div>
          <span className="text-gray-200 font-medium">Entrance</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded p-2 border border-gray-700">
          <div className="w-4 h-4 rounded shadow-lg" style={{ backgroundColor: '#8B5CF6', boxShadow: '0 0 10px #8B5CF6' }}></div>
          <span className="text-gray-200 font-medium">Electronics</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded p-2 border border-gray-700">
          <div className="w-4 h-4 rounded shadow-lg" style={{ backgroundColor: '#EC4899', boxShadow: '0 0 10px #EC4899' }}></div>
          <span className="text-gray-200 font-medium">Clothing</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded p-2 border border-gray-700">
          <div className="w-4 h-4 rounded shadow-lg" style={{ backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }}></div>
          <span className="text-gray-200 font-medium">Groceries</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded p-2 border border-gray-700">
          <div className="w-4 h-4 rounded shadow-lg" style={{ backgroundColor: '#F59E0B', boxShadow: '0 0 10px #F59E0B' }}></div>
          <span className="text-gray-200 font-medium">Checkout</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded p-2 border border-gray-700">
          <div className="w-4 h-4 rounded shadow-lg" style={{ backgroundColor: '#6366F1', boxShadow: '0 0 10px #6366F1' }}></div>
          <span className="text-gray-200 font-medium">Home & Furniture</span>
        </div>
      </div>
      
      {/* Traffic Stats */}
      <div className="mt-3 bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Live Traffic Analysis</div>
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-red-400 font-bold">{data.filter(d => d.intensity > 0.7).length}</span>
            <span className="text-gray-400 ml-1">Hot Spots</span>
          </div>
          <div>
            <span className="text-yellow-400 font-bold">{data.filter(d => d.intensity > 0.4 && d.intensity <= 0.7).length}</span>
            <span className="text-gray-400 ml-1">Medium</span>
          </div>
          <div>
            <span className="text-cyan-400 font-bold">{data.filter(d => d.intensity <= 0.4).length}</span>
            <span className="text-gray-400 ml-1">Low Traffic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealisticStoreHeatmap;