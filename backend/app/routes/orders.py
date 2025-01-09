from fastapi import APIRouter
from app.database.db import execute_query

router = APIRouter()

@router.get("/orders")
def list_orders():
    query = "SELECT * FROM orders"
    return {"orders": execute_query(query)}

@router.post("/orders")
def create_order(customer_id: int, product_id: int, quantity: int):
    # ...maybe check product stock here...
    query = "INSERT INTO orders (customer_id, product_id, quantity) VALUES (%s, %s, %s)"
    execute_query(query, (customer_id, product_id, quantity))
    return {"status": "Order created"}

@router.get("/orders/{order_id}")
def get_order(order_id: int):
    query = "SELECT * FROM orders WHERE id=%s"
    return {"order": execute_query(query, (order_id,))}

@router.put("/orders/{order_id}")
def update_order(order_id: int, quantity: int):
    query = "UPDATE orders SET quantity=%s WHERE id=%s"
    execute_query(query, (quantity, order_id))
    return {"status": "Order updated"}

@router.delete("/orders/{order_id}")
def delete_order(order_id: int):
    query = "DELETE FROM orders WHERE id=%s"
    execute_query(query, (order_id,))
    return {"status": "Order deleted"}