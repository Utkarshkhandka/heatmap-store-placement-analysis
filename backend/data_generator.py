import numpy as np
import random
from typing import List, Dict
from datetime import datetime, timedelta

class DataGenerator:
    @staticmethod
    def generate_store_heatmap(width: int = 50, height: int = 30, num_points: int = 500) -> List[Dict]:
        """Generate simulated store traffic data"""
        hotspots = [
            {"x": 10, "y": 8, "intensity": 0.9, "name": "Entrance"},
            {"x": 40, "y": 12, "intensity": 0.8, "name": "Electronics"},
            {"x": 25, "y": 20, "intensity": 0.7, "name": "Groceries"},
            {"x": 15, "y": 25, "intensity": 0.6, "name": "Checkout"}
        ]
        
        data = []
        for i in range(num_points):
            hotspot = random.choice(hotspots)
            spread = random.random() * 5
            angle = random.random() * 2 * np.pi
            
            x = max(0, min(width, hotspot["x"] + np.cos(angle) * spread))
            y = max(0, min(height, hotspot["y"] + np.sin(angle) * spread))
            
            data.append({
                "id": i,
                "x": float(x),
                "y": float(y),
                "intensity": float(hotspot["intensity"] * (0.5 + random.random() * 0.5)),
                "timestamp": (datetime.now() - timedelta(seconds=random.randint(0, 3600))).isoformat(),
                "zone": hotspot["name"]
            })
        
        return data
    
    @staticmethod
    def generate_city_data() -> List[Dict]:
        """Generate simulated city placement data"""
        cities = [
            {"name": "Downtown", "lat": 28.6139, "lon": 77.2090, "demand": 850, "population": 125000},
            {"name": "North District", "lat": 28.7041, "lon": 77.1025, "demand": 620, "population": 89000},
            {"name": "South Hub", "lat": 28.5355, "lon": 77.3910, "demand": 780, "population": 105000},
            {"name": "East Market", "lat": 28.6328, "lon": 77.2773, "demand": 540, "population": 72000},
            {"name": "West Plaza", "lat": 28.6692, "lon": 77.1178, "demand": 690, "population": 95000},
            {"name": "Central Square", "lat": 28.6289, "lon": 77.2065, "demand": 920, "population": 140000},
            {"name": "Tech Park", "lat": 28.5672, "lon": 77.3250, "demand": 450, "population": 58000},
            {"name": "Old Town", "lat": 28.6562, "lon": 77.2410, "demand": 380, "population": 45000}
        ]
        
        for city in cities:
            # Calculate score: 60% demand + 40% population density
            city["score"] = round(city["demand"] * 0.6 + city["population"] / 1000 * 0.4, 2)
            city["traffic_density"] = round(city["demand"] / (city["population"] / 1000), 2)
        
        return sorted(cities, key=lambda x: x["score"], reverse=True)
    
    @staticmethod
    def generate_analytics() -> Dict:
        """Generate analytics summary"""
        return {
            "total_visitors": random.randint(1000, 1500),
            "avg_dwell_time": round(random.uniform(15, 25), 1),
            "conversion_rate": round(random.uniform(30, 40), 1),
            "peak_hours": [
                {"hour": "10-11 AM", "visitors": random.randint(120, 160)},
                {"hour": "12-1 PM", "visitors": random.randint(180, 220)},
                {"hour": "2-3 PM", "visitors": random.randint(150, 180)},
                {"hour": "5-6 PM", "visitors": random.randint(200, 240)},
                {"hour": "7-8 PM", "visitors": random.randint(170, 200)}
            ]
        }