from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.routes.auth_routes import router as auth_router
from backend.routes.profile_routes import router as profile_router

app = FastAPI(
    title="AI Chartered Accountant Platform API",
    description="Backend API for authentication, user profile management, and OTP-based password reset.",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS - Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(profile_router)

# Health check endpoint
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "service": "AI CA Platform Backend",
        "version": "2.0.0"
    }

# Serve the entire project1 frontend directory as static files
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Mount static files (css, js, images etc.)
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# Serve index.html
@app.get("/", include_in_schema=False)
def serve_root():
    return FileResponse(os.path.join(FRONTEND_DIR, "signin.html"))

@app.get("/signin", include_in_schema=False)
def serve_signin():
    return FileResponse(os.path.join(FRONTEND_DIR, "signin.html"))

@app.get("/dashboard", include_in_schema=False)
def serve_dashboard():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.get("/admin", include_in_schema=False)
def serve_admin():
    return FileResponse(os.path.join(FRONTEND_DIR, "admin.html"))
