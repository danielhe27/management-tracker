const mysql = require('mysql2');

// Import inquirer
const inquirer = require('inquirer');
// Import console.table
const cTable = require('console.table');

require('dotenv').config();

// Connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Brooklyn.99',
  database: process.env.DB_NAME || 'super_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Welcome, lets take a look to your roaster');
  afterConnection();
});

// Function after connection is established and welcome image shows
const afterConnection = () => {
  promptUser();
};

// Inquirer prompt for the first action
const promptUser = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update an employee manager',
        'View employees by department',
        'Delete a departments',
        'Delete a role',
        'Delete an employee',
        'View department budgets',
        'No Action'
      ]
    }
  ])
  .then((answers) => {
    switch (answers.choices) {
      case "View all departments":
        showDepartments();
        break;
      case "View all roles":
        showRoles();
        break;
      case "View all employees":
        showEmployees();
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        addRoles();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateEmployee();
        break;
      case "Update an employee manager":
        updateManager();
        break;
      case "View employees by department":
        employeesDepartments();
        break;
      case "Delete a departments":
        deleteDepartments();
        break;
      case "Delete a role":
        deleteRoles();
        break;
      case "Delete an employee":
        deleteEmployee();
        break;
      case "View department budgets":
        viewBudget();
        break;
      case "No Action":
        connection.end();
        break;
    }
  });
};

// Function to show all departments
const showDepartments = () => {
  console.log('Showing all departments...\n');
  const sql = `SELECT id, name FROM departments`;

  connection.promise().query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      promptUser();
    })
    .catch(err => {
      console.error('Error fetching departments:', err);
      promptUser();
    });
};

// Function to show all roles
const showRoles = () => {
  console.log('Showing all roles...\n');
  const sql = `SELECT roles.id,
                      roles.title,
                      departments.name AS department,
                      roles.salary
               FROM roles
               LEFT JOIN departments ON roles.department_id = departments.id`;
  connection.promise().query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      promptUser();
    })
    .catch(err => {
      console.error('Error fetching roles:', err);
      promptUser();
    });
};

// function to show all employees 
const showEmployees = () => {
  console.log('Showing all employees...\n');
  const sql = `SELECT employees.id,
                      employees.first_name,
                      employees.last_name,
                      roles.title,
                      departments.name AS department,
                      roles.salary,
                      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
               FROM employees
               LEFT JOIN roles ON employees.role_id = roles.id
               LEFT JOIN departments ON roles.department_id = departments.id
               LEFT JOIN employees AS manager ON employees.manager_id = manager.id`;

  connection.promise().query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch(err => {
      console.error('Error fetching employees:', err);
      promptUser();
    });
};

// function to add a department 
addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What department do you want to add?",
      validate: addDept => {
        if (addDept) {
            return true;
        } else {
            console.log('Please enter a department');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO departments (name)
                  VALUES (?)`;
      connection.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log('Added ' + answer.addDept + " to departments!"); 

        showDepartments();
    });
  });
};

// function to add a role 
addRoles = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'roles', // This captures the role name
      message: "What role do you want to add?",
      validate: addRoles => {
        if (addRoles) {
          return true;
        } else {
          console.log('Please enter a role');
          return false;
        }
      }
    },
    {
    type: 'input', 
  name: 'salary',
  message: "What is the salary of this role?",
  validate: addSalary => {
    if (isNaN(addSalary) || addSalary.trim() === "") {
      console.log('Please enter a valid salary');
      return false; 
    } else if (addSalary.length > 15) { // Ensure the salary doesn't exceed 10 digits
      console.log('Salary must be less than or equal to 1 digits');
      return false;
    } else {
      return true; 
    }
  }
}
  ])
  .then(answer => {
    const params = [answer.roles, answer.salary];

    // grab dept from department table
    const roleSql = `SELECT name, id FROM departments`; 

    connection.promise().query(roleSql)
      .then(([data]) => {
        const dept = data.map(({ name, id }) => ({ name, value: id }));

        inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
        ])
        .then(deptChoice => {
          const dept = deptChoice.dept;
          params.push(dept);


const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;

connection.query(sql, params, (err, result) => {
    if (err) throw err;
    console.log('Added ' + answer.roles + " to roles!"); // Assuming 'answer.roles' contains the role title
    showRoles();
});

        });
      })
      .catch(err => {
        console.error('Error fetching departments:', err);
      });
  });
};

// function to add an employee 
addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirst => {
        if (addFirst) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const params = [answer.fistName, answer.lastName]

    // grab roles from roles table
    const roleSql = `SELECT roles.id, roles.title FROM roles`;
  
    connection.promise().query(roleSql, (err, data) => {
      if (err) throw err; 
      
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);

              const managerSql = `SELECT * FROM employees`;

              connection.promise().query(managerSql, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));


                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);

                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                    connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has been added!")

                    showEmployees();
              });
            });
          });
        });
     });
  });
};

