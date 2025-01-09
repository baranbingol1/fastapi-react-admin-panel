## Description of the repo

Simple Admin Panel CRUD application with FastAPI and React.

## Installation Guide

### Backend

Install dependicies

```bash
cd backend
pip install -r requirements.txt
```

Use the SQL script in backend/database/db_create_script.sql to create the database.

Create .env file in backend folder and fill it out according to your database settings

```bash
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
``` 

Run the FastAPI server

```bash
uvicorn app.main:app --reload
``` 

### Frontend

Install node.js dependicies

```bash
cd frontend
npm install
```

Run the development server

```bash
npm start
```
