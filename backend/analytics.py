import numpy as np
from sklearn.cluster import KMeans, DBSCAN
from typing import List, Dict
import pandas as pd

class AnalyticsEngine:
    @staticmethod
    def perform_clustering(data: List[Dict], n_clusters: int = 4) -> List[Dict]:
        """Perform KMeans clustering on store data"""
        if not data:
            return []
        
        points = np.array([[d['x'], d['y']] for d in data])
        
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        labels = kmeans.fit_predict(points)
        
        clusters = []
        zone_names = ["Entrance Zone", "Electronics Section", "Grocery Aisle", "Checkout Area"]
        recommendations = [
            "Place promotional items and seasonal products",
            "High-value items with security measures",
            "Essential items with high turnover rate",
            "Impulse purchase items and small goods"
        ]
        
        for i in range(n_clusters):
            cluster_points = points[labels == i]
            avg_traffic = len(cluster_points)
            
            clusters.append({
                "zone": zone_names[i] if i < len(zone_names) else f"Zone {i+1}",
                "center_x": float(kmeans.cluster_centers_[i][0]),
                "center_y": float(kmeans.cluster_centers_[i][1]),
                "avg_traffic": avg_traffic,
                "recommendation": recommendations[i] if i < len(recommendations) else "Optimize layout"
            })
        
        return sorted(clusters, key=lambda x: x['avg_traffic'], reverse=True)
    
    @staticmethod
    def calculate_heat_grid(data: List[Dict], width: int, height: int) -> np.ndarray:
        """Calculate heat grid from point data"""
        grid = np.zeros((height, width))
        
        for point in data:
            x, y = int(point['x']), int(point['y'])
            if 0 <= x < width and 0 <= y < height:
                grid[y][x] += point.get('intensity', 1.0)
        
        return grid
    
    @staticmethod
    def get_recommendations(city_data: List[Dict], top_n: int = 3) -> List[Dict]:
        """Get top N city recommendations"""
        sorted_cities = sorted(city_data, key=lambda x: x['score'], reverse=True)
        return sorted_cities[:top_n]
    
    @staticmethod
    def calculate_roi_projection(location: Dict) -> Dict:
        """Calculate ROI projection for a location"""
        base_investment = 5000000  # 50 Lakhs
        monthly_revenue = location['demand'] * 1000 * 0.3  # Simplified calculation
        
        return {
            "location": location['name'],
            "investment": base_investment,
            "projected_monthly_revenue": round(monthly_revenue, 2),
            "break_even_months": round(base_investment / monthly_revenue, 1),
            "yearly_roi": round((monthly_revenue * 12 - base_investment) / base_investment * 100, 1)
        }