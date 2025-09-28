from fastapi import FastAPI

app = FastAPI()

# Health check
@app.get("/health")
def health():
    return {"status": "UP"}

# Sample API for goods tracking
@app.get("/track/{order_id}")
def track_order(order_id: int):
    return {
        "order_id": order_id,
        "status": "In Transit",
        "location": "Pune Warehouse"
    }
