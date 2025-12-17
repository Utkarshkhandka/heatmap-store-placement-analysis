from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Heatmap Analysis System"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database (Optional for future)
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/heatmap_db"
    REDIS_URL: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"

settings = Settings()