
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

ShowAllemployees = () => {
console.log('Viewing All Employees');

const sql = `
SELECT 
    employees.id,
    employees.first_name,
    employees.last_name,
    employees.role_id,
    employees.manager_id,
    roles.title,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN employees manager ON employees.manager_id = manager.id
`;

db.query(sql, (err, rows) => {
 if (err) throw err;
console.table(rows);
 promptUser();
});
};

addEmployees = () => {
console.log('Adding Employee');
inquirer.prompt([
{
  type: 'input',
  name: 'first_name',
  message: 'What is the employee\'s first name?',
  validate (value) {
    if (value) {
      return true;
    } else {
      console.log('Please enter the employee\'s first name.');
      return false
   }
  }
},
{
  type: 'input',
  name: 'last_name',
  message: 'What is the employee\'s last name?',
  validate (value) {
    if (value) {
      return true;
    } else {
      console.log('Please enter the employee\'s last name.');
      return false
    }
  }
}
])

.then((answer) => {
  const params = [answer.first_name, answer.last_name];

const 
