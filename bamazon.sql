DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price INTEGER(10) NOT NULL,
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES
		('Bulbasaur', 'Kanto', 10, 50),
        ('Charmander', 'Kanto', 10, 50),
        ('Squirtle', 'Kanto', 10, 50),
        ('Chikorita', 'Johto', 15, 50),
        ('Cyndaquil', 'Johto', 15, 50),
        ('Totodile', 'Johto', 15, 50),
        ('Treecko', 'Hoenn', 20, 50),
        ('Torchic', 'Hoenn', 20, 50),
        ('Mudkip', 'Hoenn', 20, 50),
        ('Pikachu', 'Kanto', 25, 25);
        
ALTER TABLE products add product_sales INTEGER(10) default 0;

ALTER TABLE products add FOREIGN KEY (department_name) REFERENCES departments (department_id)

CREATE TABLE departments(
	department_id INTEGER auto_increment NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INTEGER(10) NOT NULL,
    product_sales INTEGER(10) default 0,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
	VALUES
		('Kanto', 2000),
        ('Johto', 3000),
        ('Hoenn', 4000);
        
SELECT * FROM departments;


SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
SUM(products.product_sales) AS total_sales
FROM products 
LEFT JOIN departments ON products.department_name = departments.department_id
GROUP BY products.department_name;


SELECT products.item_id, products.product_name, departments.department_name, products.price, products.stock_quantity
FROM products
INNER JOIN departments ON products.department_name = departments.department_id;