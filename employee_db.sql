DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
department_id INT AUTO_INCREMENT,
name VARCHAR(50)NOT NULL,
PRIMARY KEY(department_id)
);

CREATE TABLE role(
role_id INT AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL (10,2)  NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY(role_id),
FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee(
employee_id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,

PRIMARY KEY(employee_id),
FOREIGN KEY (role_id) REFERENCES role(role_id)
);

INSERT INTO department(name) VALUES ("MARKETING");
INSERT INTO department(name) VALUES ("LAWYER");
INSERT INTO department(name) VALUES ("HUMAN RESOURCES");
INSERT INTO department(name) VALUES ("ENGINEER");
INSERT INTO department(name) VALUES ("SALES PERSON");

INSERT INTO role(title, salary, department_id) VALUES ("TEACHING-ASSISTANT", 45,3);
INSERT INTO role(title, salary, department_id) VALUES ("TINSTRUCTOR", 11,2);
INSERT INTO role(title, salary, department_id) VALUES ("SALES MANAGER", 22,2);
INSERT INTO role(title, salary, department_id) VALUES ("MEDIA PERSON", 33,1);
INSERT INTO role(title, salary, department_id) VALUES ("DEPUTY MANAGER", 55,1);

INSERT INTO employee (first_name, last_name , role_id) VALUES ("TONY" ,"STARK",2);
INSERT INTO employee (first_name, last_name , role_id) VALUES ("JOHN" ,"DOE",1);
INSERT INTO employee (first_name, last_name , role_id) VALUES ("SUSAN" ,"SMITH",3);
INSERT INTO employee (first_name, last_name , role_id) VALUES ("MAGGIE" ,"MILL",4);
INSERT INTO employee (first_name, last_name , role_id) VALUES ("TOM" ,"CRUISE",5);

-- This is the comment

select * 
from employee
Inner Join role on  employee.role_id = role.id 
Inner Join department on department.id= role.department_id;

SELECT employee_id,first_name,last_name,department.name FROM employee
    INNER JOIN role ON role.role_id=employee.role_id
    INNER JOIN department ON department.department_id=role.department_id;
    
SELECT role_id,title FROM role ;

UPDATE employee
SET role_id = 3
WHERE employee_id=1;