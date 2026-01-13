# Stylish Shoes Store - Python Backend

A FastAPI backend for the Stylish Shoes e-commerce store.

## Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

### Running the Server

Start the development server with Uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or run directly:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health status
- `GET /api/products` - Get all products
- `GET /api/products/{product_id}` - Get product by ID
- `POST /api/cart` - Add item to cart
- `POST /api/orders` - Create order

## Project Structure

```
backend/
├── main.py              # Main application file
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Development

For development, the server runs with auto-reload enabled. Any changes to `main.py` will automatically restart the server.

## Deployment

For production deployment:
1. Set `DEBUG=False` in `.env`
2. Use a production ASGI server like Gunicorn with Uvicorn workers
3. Configure appropriate CORS origins in `main.py`
4. Use environment variables for sensitive data

Example production command:
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
