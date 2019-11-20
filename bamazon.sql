
DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (50),
    department_name VARCHAR (30),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Diamond-encrusted Thermometer", "Health and Wellness", 299.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lie Detector Mood Ring", "Health and Wellness", 108.88, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Slinky", "Entertainment", 1.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mugwort Tincture", "Gourmet Food", 19.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Alien Fairy Farm", "Entertainment", 699.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Family Sized Olive Jar", "Gourmet Food", 49.99, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stained Jeans", "Lifestyle Products", 489.00, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Magical Blanket", "Health and Wellness", 49.99, 23);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Black Garlic", "Gourmet Food", 19.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Designer-ripped sweater", "Lifestyle Products", 205.99, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Environmentally-Friendly Plastic Plant", "Lifestyle Products", 9.99, 100);