DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    dName VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL,
    department_id INT NULL,
    PRIMARY KEY(id)
);

/* ALTER TABLE roles AUTO_INCREMENT=1001; USE FOR SETTING SPECIFC START POINT FOR AUTO_INCR*/

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);

INSERT INTO departments(dName) VALUES ("Accounting");

INSERT INTO roles(title, salary, department_id) VALUES ("Accountant", "60000.00", 2);
INSERT INTO roles(title, salary, department_id) VALUES ("Engineer", "40000.00", 3);
INSERT INTO roles(title, salary, department_id) VALUES ("Assistant", "20000.00", 4);


INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, NULL);


