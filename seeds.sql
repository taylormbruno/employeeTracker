USE employees_db;

-- create depts
INSERT INTO departments(dept_name) VALUES ("Sales");
INSERT INTO departments(dept_name) VALUES ("Engineering");
INSERT INTO departments(dept_name) VALUES ("Finance");
INSERT INTO departments(dept_name) VALUES ("Legal");

-- create roles
INSERT INTO roles(title, salary, department_id) VALUES ("Accountant", "54358.00", 13);
INSERT INTO roles(title, salary, department_id) VALUES ("Account Manager", "57436.00", 13);
INSERT INTO roles(title, salary, department_id) VALUES ("Sales Lead", "27654.00", 11);
INSERT INTO roles(title, salary, department_id) VALUES ("Sales Person", "18657.00", 11);
INSERT INTO roles(title, salary, department_id) VALUES ("Lead Engineer", "95679.00", 12);
INSERT INTO roles(title, salary, department_id) VALUES ("Software Engineer", "62430.00", 12);
INSERT INTO roles(title, salary, department_id) VALUES ("Legal Team Lead", "47793.00", 14);

-- view roles with department name
SELECT title, salary, dept_name 
FROM roles INNER JOIN departments 
ON roles.department_id = departments.id;

-- inner join roles
SELECT e.first_name, e.last_name, r.title, r.salary
FROM employees e INNER JOIN roles r 
ON e.role_id = r.id;

-- inner join roles and departments
SELECT e.first_name, e.last_name, r.title, r.salary, d.dept_name
FROM ((employees e
INNER JOIN roles r ON e.role_id = r.id)
INNER JOIN departments d ON r.department_id = d.id)
WHERE title = "Sales Lead";

-- find employees with assigned managers
SELECT * FROM employees WHERE manager_id IS NOT NULL;

-- add manager name column
ALTER TABLE employees ADD manager_name VARCHAR(150); 
ALTER TABLE employees DROP COLUMN manager_name;