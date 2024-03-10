DROP DATABASE IF EXISTS super_db;

CREATE DATABASE super_db;

USE super_db;

CREATE TABLE deparments (
  id: INT PRIMARY KEY,
  name: VARCHAR(30) NOT NULL
  );

CREATE TABLE roles (
  id INT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT
  review TEXT NOT NULL,
  FOREIGN KEY (department_id)
   REFERENCES deparments(id)
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  review TEXT NOT NULL,
  FOREIGN KEY (role_id)
  REFERENCES role(id)
  manager_id INT
  );
