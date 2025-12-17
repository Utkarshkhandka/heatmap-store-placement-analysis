// Normal distribution helper (Box-Muller transform)
const normalRandom = () => {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const generateStoreHeatmapData = (width = 50, height = 30, numPoints = 800) => {
  const data = [];
  
  // Define realistic store zones matching the layout
  const zones = [
    // Entrance - High traffic
    { x: 9, y: 7, spread: 3, intensity: 0.95, weight: 0.20, name: 'Entrance' },
    
    // Electronics - Medium-high traffic, longer dwell time
    { x: 41, y: 10, spread: 4, intensity: 0.85, weight: 0.15, name: 'Electronics' },
    
    // Clothing - High traffic, browsing behavior
    { x: 17, y: 16, spread: 5, intensity: 0.80, weight: 0.18, name: 'Clothing' },
    
    // Groceries - Highest traffic, quick movement
    { x: 37, y: 22, spread: 6, intensity: 0.90, weight: 0.22, name: 'Groceries' },
    
    // Checkout - Very high traffic, queue formation
    { x: 13, y: 25, spread: 3, intensity: 0.93, weight: 0.20, name: 'Checkout' },
    
    // Furniture/Home - Lower traffic, longer dwell
    { x: 7, y: 16, spread: 2, intensity: 0.65, weight: 0.05, name: 'Furniture' }
  ];
  
  // Calculate points per zone based on weights
  zones.forEach(zone => {
    const pointsForZone = Math.floor(numPoints * zone.weight);
    
    for (let i = 0; i < pointsForZone; i++) {
      // Use normal distribution for more realistic clustering
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.abs(normalRandom()) * zone.spread;
      
      const x = Math.max(0, Math.min(width, zone.x + Math.cos(angle) * radius));
      const y = Math.max(0, Math.min(height, zone.y + Math.sin(angle) * radius));
      
      // Add some randomness to intensity
      const intensityVariation = 0.8 + Math.random() * 0.4;
      
      data.push({
        x: x,
        y: y,
        intensity: zone.intensity * intensityVariation,
        zone: zone.name,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Add some random movement paths (people walking through aisles)
  const pathPoints = Math.floor(numPoints * 0.05);
  for (let i = 0; i < pathPoints; i++) {
    // Horizontal paths
    if (Math.random() > 0.5) {
      data.push({
        x: Math.random() * width,
        y: 10 + Math.floor(Math.random() * 2) * 10,
        intensity: 0.3 + Math.random() * 0.3,
        zone: 'Aisle',
        timestamp: new Date().toISOString()
      });
    } else {
      // Vertical paths
      data.push({
        x: 15 + Math.floor(Math.random() * 2) * 15,
        y: Math.random() * height,
        intensity: 0.3 + Math.random() * 0.3,
        zone: 'Aisle',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return data;
};

export const generateCityHeatmapData = () => {
  const cities = [
    { name: 'Downtown Central', lat: 28.6139, lon: 77.2090, demand: 850, population: 125000 },
    { name: 'North District Mall', lat: 28.7041, lon: 77.1025, demand: 620, population: 89000 },
    { name: 'South Hub Plaza', lat: 28.5355, lon: 77.3910, demand: 780, population: 105000 },
    { name: 'East Market Square', lat: 28.6328, lon: 77.2773, demand: 540, population: 72000 },
    { name: 'West Plaza Center', lat: 28.6692, lon: 77.1178, demand: 690, population: 95000 },
    { name: 'Central Square Mall', lat: 28.6289, lon: 77.2065, demand: 920, population: 140000 },
    { name: 'Tech Park Complex', lat: 28.5672, lon: 77.3250, demand: 450, population: 58000 },
    { name: 'Old Town Bazaar', lat: 28.6562, lon: 77.2410, demand: 380, population: 45000 },
    { name: 'Metro Station Hub', lat: 28.6430, lon: 77.2194, demand: 810, population: 118000 },
    { name: 'Airport Road Mall', lat: 28.5562, lon: 77.0999, demand: 720, population: 102000 }
  ];
  
  return cities.map(city => ({
    ...city,
    score: (city.demand * 0.6 + city.population / 1000 * 0.4).toFixed(2),
    footfall: Math.floor(city.demand * 100 + Math.random() * 5000),
    competition: Math.floor(Math.random() * 5) + 1,
    accessibility: (Math.random() * 3 + 7).toFixed(1)
  }));
};