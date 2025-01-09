from fastapi import APIRouter
from app.database.db import execute_query
from pydantic import BaseModel

class Product(BaseModel):
    name: str
    price: float
    category_id: int

router = APIRouter()

@router.get("/products")
def list_products():
    query = "SELECT product_id AS id, name, price, category_id FROM products"
    return {"products": execute_query(query)}

@router.post("/products")
def create_product(product: Product):
    query = "INSERT INTO products (name, price, category_id) VALUES (%s, %s, %s)"
    execute_query(query, (product.name, product.price, product.category_id))
    return {"status": "Product created"}

@router.get("/products/{product_id}")
def get_product(product_id: int):
    query = "SELECT product_id AS id, name, price, category_id FROM products WHERE product_id=%s"
    return {"product": execute_query(query, (product_id,))}

@router.put("/products/{product_id}")
def update_product(product_id: int, name: str, price: float, category_id: int):
    query = "UPDATE products SET name=%s, price=%s, category_id=%s WHERE product_id=%s"
    execute_query(query, (name, price, category_id, product_id))
    return {"status": "Product updated"}

@router.delete("/products/{product_id}")
def delete_product(product_id: int):
    query = "DELETE FROM products WHERE product_id=%s"
    execute_query(query, (product_id,))
    return {"status": "Product deleted"}