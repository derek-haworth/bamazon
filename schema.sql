DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity INT NULL
  PRIMARY KEY (item_id)
);


CREATE TABLE departments (
	department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10, 2),
    total_sales DECIMAL(10, 2),
    PRIMARY KEY(department_id)
);