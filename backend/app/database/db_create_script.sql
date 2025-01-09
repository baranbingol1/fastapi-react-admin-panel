-- script for creating the sample db used in the project

CREATE DATABASE IF NOT EXISTS retail_management_db;
USE retail_management_db;

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- add idxs for better DML performance
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_order_customer ON orders(customer_id);
CREATE INDEX idx_orderdetail_order ON order_details(order_id);
CREATE INDEX idx_orderdetail_product ON order_details(product_id);

-- insert samples
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books and publications');
INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES
('Smartphone', 'Latest model smartphone', 699.99, 50, 1),
('T-shirt', 'Cotton T-shirt', 19.99, 100, 2),
('Programming Book', 'Learn coding', 49.99, 30, 3);
INSERT INTO customers (first_name, last_name, email, phone, address) VALUES
('John', 'Doe', 'john@example.com', '123-456-7890', '123 Main St'),
('Jane', 'Smith', 'jane@example.com', '098-765-4321', '456 Oak Ave');
INSERT INTO orders (customer_id, total_amount, status) VALUES
(1, 699.99, 'completed'),
(2, 69.98, 'pending'),
(1, 49.99, 'processing');
INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 699.99),    -- John bought a smartphone
(2, 2, 2, 19.99),     -- Jane bought 2 t-shirts
(2, 3, 1, 49.99);     -- Jane bought a programming book

-- triggers

DELIMITER //

CREATE TRIGGER `after_insert_order_details`
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
END //

CREATE TRIGGER `before_delete_category`
BEFORE DELETE ON categories
FOR EACH ROW
BEGIN
    IF (SELECT COUNT(*) FROM products WHERE category_id = OLD.category_id) > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete category with associated products.';
    END IF;
END //

DELIMITER ;

-- other queries for testing purposes
SELECT * FROM categories;

SELECT o.order_id, c.first_name, p.name, od.quantity, od.unit_price
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.product_id
ORDER BY o.order_id;