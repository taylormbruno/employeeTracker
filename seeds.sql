USE employees_db;

INSERT INTO departments(dept_name) VALUES ("Sales");
INSERT INTO departments(dept_name) VALUES ("Engineering");
INSERT INTO departments(dept_name) VALUES ("Finance");
INSERT INTO departments(dept_name) VALUES ("Legal");


INSERT INTO roles(title, salary, department_id) VALUES ("Accountant", "54358.00", 13);
INSERT INTO roles(title, salary, department_id) VALUES ("Account Manager", "57436.00", 13);
INSERT INTO roles(title, salary, department_id) VALUES ("Sales Lead", "27654.00", 11);
INSERT INTO roles(title, salary, department_id) VALUES ("Sales Person", "18657.00", 11);
INSERT INTO roles(title, salary, department_id) VALUES ("Lead Engineer", "95679.00", 12);
INSERT INTO roles(title, salary, department_id) VALUES ("Software Engineer", "62430.00", 12);
INSERT INTO roles(title, salary, department_id) VALUES ("Legal Team Lead", "47793.00", 14);

SELECT title, salary, dept_name 
FROM roles INNER JOIN departments 
ON roles.department_id = departments.id;

SELECT e.first_name, e.last_name, r.title, r.salary
FROM employees e INNER JOIN roles r 
ON e.role_id = r.id;

SELECT e.first_name, e.last_name, r.title, r.salary, d.dept_name
FROM ((employees e
INNER JOIN roles r ON e.role_id = r.id)
INNER JOIN departments d ON r.department_id = d.id)
WHERE title = "Sales Lead";


SELECT * FROM employees WHERE manager_id IS NOT NULL;

SELECT id FROM employees WHERE first_name = "Tom" AND last_name = "Cruise";