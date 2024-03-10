INSERT INTO departments (id, name)
VALUES (1, 'Engineering'),
       (2, 'Finance'),
       (3, 'Legal'),
       (4, 'Sales');

INSERT INTO roles (id, title, salary, department_id)
VALUES (1, 'Lead Engineer', 150000, 1),
       (2, 'Software Engineer', 120000, 1),
       (3, 'Accountant', 125000, 2),
       (4, 'Legal Team Lead', 250000, 3),
       (5, 'Lawyer', 190000, 3),
       (6, 'Salesperson', 80000, 4),
       (7, 'Sales Lead', 100000, 4),
       (8, 'Account Manager', 150000, 1);

INSERT INTO employees (id, first_name, last_name, roles_id, manager_id)
VALUES (1, 'John', 'Doe', 1, NULL),
       (2, 'Mike', 'Chan', 2, 1),
       (3, 'Ashley', 'Rodriguez', 3, NULL),
       (4, 'Kevin', 'Tupik', 4, NULL),
       (5, 'Kunal', 'Singh', 5, 4),
       (6, 'Malia', 'Brown', 6, NULL),
       (7, 'Sarah', 'Lourd', 7, 6),
       (8, 'Tom', 'Allen', 8, 6);