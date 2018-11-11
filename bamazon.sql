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

-- MOCK ENTRIES 
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