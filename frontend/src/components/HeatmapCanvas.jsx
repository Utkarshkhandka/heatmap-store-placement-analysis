import React, { useRef, useEffect } from 'react';
import { Activity } from 'lucide-react';

const HeatmapCanvas = ({ data, width, height, title }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const scale = 10;
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const grid = Array(height).fill().map(() => Array(width).fill(0));
    
    data.forEach(point => {
      const gx = Math.floor(point.x);
      const gy = Math.floor(point.y);
      if (gx >= 0 && gx < width && gy >= 0 && gy < height) {
        grid[gy][gx] += point.intensity;
      }
    });
    
    const maxVal = Math.max(...grid.flat());
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = grid[y][x] / maxVal;
        if (val > 0) {
          const r = Math.floor(255 * val);
          const g = Math.floor(255 * (1 - val) * 0.5);
          const b = Math.floor(100 * (1 - val));
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + val * 0.7})`;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    
    ctx.strokeStyle = '#ffffff33';
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
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-400" />
        {title}
      </h3>
      <canvas ref={canvasRef} className="w-full border border-gray-700 rounded" />
    </div>
  );
};

export default HeatmapCanvas;