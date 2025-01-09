import mysql.connector
from dotenv import load_dotenv
from pathlib import Path
import os
def get_connection():
    env_path = Path(__file__).parent.parent.parent / ".env"
    assert env_path.exists(), ".env file does not exist"
    load_dotenv(env_path)
    assert os.getenv("DB_HOST") is not None, "DB_HOST is not set"
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        autocommit=True  # ensure we don't hold locks and automatically commit transactions
    )

def execute_query(query, params=None):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(query, params)
    if query.strip().upper().startswith("SELECT"):
        result = cursor.fetchall()
    else:
        connection.commit()
        result = cursor.lastrowid if query.strip().upper().startswith("INSERT") else cursor.rowcount
    cursor.close()
    connection.close()
    return result

if __name__ == "__main__": # for testing purposes
    print(execute_query("SELECT * FROM categories")) 