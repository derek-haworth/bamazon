-- Create bamazon table and use it
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;


-- Products Table
CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity INT NULL
  PRIMARY KEY (item_id)
);

INSERT INTO products 
	(product_name, department_name, price, stock_quantity)
VALUES 
	("pillow", "home", 9.95, 39),
    ("bowls", "kitchen", 7.25, 67),
    ("microwave", "appliances", 129.99, 12);

DROP TABLE products;  

SELECT * from products;


-- Departments Table
CREATE TABLE departments (
	department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10, 2),
    total_sales DECIMAL(10, 2),
    PRIMARY KEY(department_id)
);