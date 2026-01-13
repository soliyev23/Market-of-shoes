from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from pathlib import Path

app = FastAPI(title="Stylish Shoes Store API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # productionda domain qo‘yiladi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes (define before static files mounting)
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/languages")
async def get_languages():
    """Get available languages"""
    return {
        "languages": [
            {"code": "en", "name": "English", "nativeName": "English"},
            {"code": "ru", "name": "Russian", "nativeName": "Русский"},
            {"code": "uz", "name": "Uzbek", "nativeName": "Ўзбек"}
        ]
    }

# Products endpoints
@app.get("/api/products")
async def get_products():
    """Get all products"""
    products = [
        {
            "id": 1,
            "name": "Classic Sneaker",
            "price": 79.99,
            "image": "/images/shoe1.jpg",
            "description": "Comfortable classic sneaker for everyday wear"
        },
        {
            "id": 2,
            "name": "Athletic Runner",
            "price": 99.99,
            "image": "/images/shoe2.jpg",
            "description": "Performance athletic running shoe"
        },
        {
            "id": 3,
            "name": "Casual Loafer",
            "price": 89.99,
            "image": "/images/shoe3.jpg",
            "description": "Stylish casual loafer for modern look"
        }
    ]
    return {"products": products}

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    """Get a specific product by ID"""
    return {
        "id": product_id,
        "name": "Product",
        "price": 99.99,
        "description": "A stylish shoe",
        "in_stock": True
    }

@app.post("/api/cart")
async def add_to_cart(product_id: int, quantity: int = 1):
    """Add item to cart"""
    return {
        "success": True,
        "message": f"Added {quantity} item(s) to cart",
        "product_id": product_id,
        "quantity": quantity
    }

@app.post("/api/orders")
async def create_order(items: list):
    """Create a new order"""
    return {
        "order_id": 12345,
        "status": "pending",
        "total": 0.0,
        "items": items
    }

# Serve static files
frontend_path = Path(__file__).parent.parent

# Mount static files with directory listing disabled
# This will serve files from the parent directory but won't list directory contents
app.mount("/css", StaticFiles(directory=str(frontend_path / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(frontend_path / "js")), name="js")
app.mount("/images", StaticFiles(directory=str(frontend_path / "images")), name="images")

# Serve index.html for root and any other paths (SPA fallback)
@app.get("/{full_path:path}")
async def serve_file(full_path: str):
    """Serve static files or index.html as fallback"""
    file_path = frontend_path / full_path
    
    # If it's a file that exists, serve it
    if file_path.is_file():
        return FileResponse(file_path)
    
    # If it's a request for a file type, try to serve it
    if '.' in full_path:
        # Check if JSON file exists
        if full_path.endswith('.json'):
            if file_path.exists():
                return FileResponse(file_path)
        return {"error": "File not found"}, 404
    
    # For routes without extension (like /shop, /about), serve index.html
    index_path = frontend_path / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    
    return {"error": "Not found"}, 404

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
