DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL,
    department_id INT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);

ALTER TABLE departments AUTO_INCREMENT=11;
ALTER TABLE roles AUTO_INCREMENT=101;
ALTER TABLE employees AUTO_INCREMENT=1001;
-- add manager name column
ALTER TABLE employees ADD manager_name VARCHAR(150); 