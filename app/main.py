from fastapi import FastAPI
from app.auth.routes import router as auth_router
from app.registry.routes import router as registry_router
from app.core.routes import router as core_router
from app.admin.routes import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.db_models import test
from fastapi.security import HTTPBearer

from app.db_models import system_log  # 👈 IMPORTANT: import the model

security = HTTPBearer()

from app.core.test_routes import router as test_router



app = FastAPI(
    title="National Core Platform",
    description="National Core Platform with JWT Authentication",
)
app.openapi_schema = None
from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="National Core Platform",
        version="1.0.0",
        description="JWT secured National Core Platform",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    openapi_schema["security"] = [
        {
            "BearerAuth": []
        }
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/auth")
app.include_router(registry_router, prefix="/registry")
app.include_router(core_router, prefix="/core")
app.include_router(admin_router, prefix="/admin")
app.include_router(test_router, prefix="/core")
@app.get("/")
def root():
    return {
        "message": "National Core Platform is running",
        "status": "OK"
    }
