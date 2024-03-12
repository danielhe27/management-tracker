
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

const db = mysql.createConnection(
{
  host: 'localhost',
  user: 'root',
  password: 'Brooklyn.99',
  database: 'super_db'
},
console.log('Connected to the super_db database.')
);

const promptUser = () => {
inquirer
   .prompt([
      {
        type: 'list',
        name: 'options',
        message: 'What would you like to see?',
        choices: [
          'View All Employees',
          'Add Employee',
          'Update Employee Role',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'Exit'
        ]
      }
    ])
   .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Exit':
          process.exit();
          console.log('Goodbye!');
      }
    });
    };

    ShowAll
