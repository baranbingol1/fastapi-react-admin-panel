from fastapi import APIRouter
from app.database.db import execute_query

router = APIRouter()

@router.get("/customers")
def list_customers():
    query = "SELECT * FROM customers"
    return {"customers": execute_query(query)}

@router.post("/customers")
def create_customer(name: str, email: str):
    query = "INSERT INTO customers (name, email) VALUES (%s, %s)"
    execute_query(query, (name, email))
    return {"status": "Customer created"}

@router.get("/customers/{customer_id}")
def get_customer(customer_id: int):
    query = "SELECT * FROM customers WHERE id=%s"
    return {"customer": execute_query(query, (customer_id,))}

@router.put("/customers/{customer_id}")
def update_customer(customer_id: int, name: str, email: str):
    query = "UPDATE customers SET name=%s, email=%s WHERE id=%s"
    execute_query(query, (name, email, customer_id))
    return {"status": "Customer updated"}

@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int):
    query = "DELETE FROM customers WHERE id=%s"
    execute_query(query, (customer_id,))
    return {"status": "Customer deleted"}