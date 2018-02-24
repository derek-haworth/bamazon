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
	("pillow", "living", 9.95, 39),
    ("bowls", "kitchen", 7.25, 67),
    ("microwave", "appliances", 129.99, 12),
    ("toaster", "appliances", 19.99, 20),
	("sheets", "bedroom", 45.00, 3),
	("silverware", "kitchen", 52.88, 20),
	("lawnmower", "outdoor", 199.88, 4),
	("patio umbrella", "outdoor", 49.98, 5),
	("tv", "tech", 599.99, 8),
	("plunger", "bathroom", 11.11, 18),
	("lamp", "living", 69.00, 3);
	

DROP TABLE products;  

SELECT * from products;

UPDATE products SET price = 12.50 WHERE item_id = 11;

-- Departments Table
CREATE TABLE departments (
	department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10, 2),
    total_sales DECIMAL(10, 2),
    PRIMARY KEY(department_id)
);


INSERT INTO departments
	(department_name, over_head_costs, total_sales)
VALUES
	("kitchen", 3500.00, 0.00),
    ("outdoor", 350.00, 0.00);
    ("living", 350.00, 0.00);
    ("tech", 1000.00, 0.00);
    ("bathroom", 350.00, 0.00);
    ("appliances", 350.00, 0.00);
    
DROP TABLE departments;
    
SELECT * from departments;

DELETE from departments WHERE department_name is NULL;