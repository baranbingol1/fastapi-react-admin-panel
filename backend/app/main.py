from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, categories, customers, orders
from app import auth
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # cors middleware for react port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(products.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(orders.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Merhaba!"}
