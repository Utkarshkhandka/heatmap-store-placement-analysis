from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import asyncio
import json
from datetime import datetime

from data_generator import DataGenerator
from analytics import AnalyticsEngine
from config import settings

app = FastAPI(title=settings.APP_NAME, version=settings.VERSION)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize generators
data_gen = DataGenerator()
analytics = AnalyticsEngine()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.get("/")
async def root():
    return {
        "message": "Heatmap Analysis System API",
        "version": settings.VERSION,
        "status": "running"
    }

@app.get("/api/store/heatmap")
async def get_store_heatmap():
    """Get store heatmap data"""
    data = data_gen.generate_store_heatmap()
    clusters = analytics.perform_clustering(data)
    
    return JSONResponse({
        "data": data,
        "clusters": clusters,
        "timestamp": datetime.now().isoformat()
    })

@app.get("/api/city/locations")
async def get_city_locations():
    """Get city location data"""
    cities = data_gen.generate_city_data()
    recommendations = analytics.get_recommendations(cities, top_n=3)
    
    roi_projections = [analytics.calculate_roi_projection(city) for city in recommendations]
    
    return JSONResponse({
        "cities": cities,
        "recommendations": recommendations,
        "roi_projections": roi_projections,
        "timestamp": datetime.now().isoformat()
    })

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    """Get analytics summary"""
    store_data = data_gen.generate_store_heatmap()
    clusters = analytics.perform_clustering(store_data)
    analytics_data = data_gen.generate_analytics()
    
    return JSONResponse({
        "analytics": analytics_data,
        "clusters": clusters,
        "timestamp": datetime.now().isoformat()
    })

@app.websocket("/ws/realtime")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Generate and send real-time data every 2 seconds
            store_data = data_gen.generate_store_heatmap()
            analytics_data = data_gen.generate_analytics()
            
            await manager.broadcast({
                "type": "update",
                "store_data": store_data[:100],  # Limit data size
                "analytics": analytics_data,
                "timestamp": datetime.now().isoformat()
            })
            
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/export/report")
async def export_report():
    """Export complete analysis report"""
    store_data = data_gen.generate_store_heatmap()
    city_data = data_gen.generate_city_data()
    clusters = analytics.perform_clustering(store_data)
    analytics_data = data_gen.generate_analytics()
    
    report = {
        "generated_at": datetime.now().isoformat(),
        "store_analysis": {
            "total_points": len(store_data),
            "clusters": clusters
        },
        "city_analysis": {
            "locations": city_data,
            "top_recommendations": analytics.get_recommendations(city_data)
        },
        "analytics": analytics_data
    }
    
    return JSONResponse(report)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)