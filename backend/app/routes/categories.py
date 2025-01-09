from fastapi import APIRouter
from app.database.db import execute_query

router = APIRouter()

@router.get("/categories")
def list_categories():
    query = "SELECT * FROM categories"
    return {"categories": execute_query(query)}

@router.post("/categories")
def create_category(name: str):
    query = "INSERT INTO categories (name) VALUES (%s)"
    execute_query(query, (name,))
    return {"status": "Category created"}

@router.get("/categories/{category_id}")
def get_category(category_id: int):
    query = "SELECT * FROM categories WHERE id=%s"
    return {"category": execute_query(query, (category_id,))}

@router.put("/categories/{category_id}")
def update_category(category_id: int, name: str):
    query = "UPDATE categories SET name=%s WHERE id=%s"
    execute_query(query, (name, category_id))
    return {"status": "Category updated"}

@router.delete("/categories/{category_id}")
def delete_category(category_id: int):
    query = "DELETE FROM categories WHERE id=%s"
    execute_query(query, (category_id,))
    return {"status": "Category deleted"}