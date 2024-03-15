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
      name: 'roles',
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
    } 
    else if (addSalary.length > 15) { // Ensure the salary doesn't exceed 15 digits
      console.log('Salary must be less than or equal to 1 digits');
      return false;
    } 
    else {
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
    console.log('Added ' + answer.roles + " to roles!"); 
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
      name: 'firstName',
      message: "What is the employee's first name?",
      validate: addFirst => {
        if (addFirst) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },

    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLast => {
        if (addLast) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])

  .then(answer => {
    const params = [answer.firstName, answer.lastName]; 

    // grab roles from roles table
    const roleSql = `SELECT id, title FROM roles`;

    connection.promise().query(roleSql)
      .then(([data]) => {
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

          const managerSql = `SELECT id, first_name, last_name FROM employees`;

          connection.promise().query(managerSql)
            .then(([data]) => {
              const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

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

                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                connection.promise().query(sql, params)
                  .then(() => {
                    console.log("Employee has been added!");
                    showEmployees();
                  })
                  .catch(err => {
                    console.error("Error adding employee:", err.message);
                  });
              });
            })
            .catch(err => {
              console.error("Error fetching managers:", err.message);
            });
        });
      })
      .catch(err => {
        console.error("Error fetching roles:", err.message);
      });
  });
};

// function to update an employee 
updateEmployee = () => {
  const employeeSql = `SELECT * FROM employees`; 
  connection.promise().query(employeeSql)
    .then(([data]) => {
      const employeeChoices = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name, 
        value: id 
      }));

      return inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: "Which employee would you like to update?",
          choices: employeeChoices
        }
      ]);
    })
    .then(empChoice => {
      const roleSql = `SELECT * FROM roles`; 
      
      return connection.promise().query(roleSql).then(([roles]) => {
        const rolesChoices = roles.map(({ id, title }) => ({
          name: title, 
          value: id 
        }));

        return inquirer.prompt([
          {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's new role?",
            choices: rolesChoices
          }
        ]).then(roleChoice => {
          return { employeeId: empChoice.employeeId, roleId: roleChoice.roleId };
        });
      });
    })
    .then(({ employeeId, roleId }) => {
      const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
      return connection.promise().query(sql, [roleId, employeeId]);
    })
    .then(() => {
      console.log("Employee has been updated!");
      showEmployees();
    })
    .catch(err => {
      console.error("Error updating employee:", err.message);
    });
};


// function to update an employee 
updateManager = () => {
  const employeeSql = "SELECT * FROM employees";

  connection.promise().query(employeeSql)
    .then(([data]) => {

      if (data.length === 0) {
        console.log("No employees found."); // Handle no data case
        return; 
      }
      const employeeChoices = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id
      }));

      return inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: "Which employee would you like to update?",
          choices: employeeChoices
        }
      ]);
    })
    .then(empChoice => {
      if (!empChoice || !empChoice.employeeId) {
        console.log("Operation cancelled or no employee selected.");
        return; // Exit if no selection was made
      }

      // Proceed with fetching managers only if a valid employee was selected
      return connection.promise().query("SELECT * FROM employees")
        .then(([managers]) => {
          const managersChoices = managers.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id
          }));

          return inquirer.prompt([
            {
              type: 'list',
              name: 'managerId',
              message: "Who is the new manager for the selected employee?",
              choices: managersChoices
            }
          ])
          .then(managerChoice => {
            return { employeeId: empChoice.employeeId, managerId: managerChoice.managerId };
          });
        });
    })
    .then(({ employeeId, managerId } = {}) => {
      if (!employeeId || !managerId) {
        return; // Check if employeeId or managerId is missing and exit if so
      }
      const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
      return connection.promise().query(sql, [managerId, employeeId]);
    })
    .then(() => {
      console.log("Employee's manager has been updated!");
      showEmployees(); // Ensure this function is defined to show the updated list
    })
    .catch(err => {
      console.error("Error updating employee's manager:", err.message);
    });
};


// function to view employee by department
employeesDepartments = () => {
  console.log('Showing employees by departments...\n');
  const sql = `SELECT employees.first_name, 
                      employees.last_name, 
                      departments.name AS department
               FROM employees
               LEFT JOIN roles ON employees.role_id = roles.id 
               LEFT JOIN departments ON roles.department_id = departments.id`;

               connection.promise().query(sql)
               .then(([rows, fields]) => {
                 console.table(rows);
                 showEmployees();
               })
               .catch(err => {
                 console.error("Error fetching employees by department:", err.message);
               });
             };

// Function to delete a department
const deleteDepartments = () => {
  const deptSql = `SELECT * FROM departments`; 

  connection.promise().query(deptSql)
    .then(([data]) => {
      const deptChoices = data.map(({ name, id }) => ({ name, value: id }));
      inquirer.prompt([
        {
          type: 'list', 
          name: 'deptId',
          message: "Which department do you want to delete?",
          choices: deptChoices
        }
      ])
      .then(({ deptId }) => {
        const deleteSql = `DELETE FROM departments WHERE id = ?`; 
        connection.promise().query(deleteSql, [deptId])
          .then(() => {
            console.log("Successfully deleted department!");
            showDepartments();
          })
          .catch(err => {
            console.error("Error deleting department:", err.message);
            promptUser();
          });
      });
    })
    .catch(err => {
      console.error("Error fetching departments:", err.message);
      promptUser();
    });
};




// function to delete role
deleteRoles= () => {
  const roleSql = "SELECT * FROM roles";

  connection.promise().query(roleSql)
    .then(([data]) => {
      const rolesChoices = data.map(({ id, title }) => ({ name: title, value: id }));

      return inquirer.prompt([
        {
          type: 'list',
          name: 'roleId',
          message: "What role do you want to delete?",
          choices: rolesChoices
        }
      ]);
    })
    .then(roleChoice => {
      const sql = "DELETE FROM roles WHERE id = ?";
      return connection.promise().query(sql, [roleChoice.roleId]);
    })
    .then(() => {
      console.log("Successfully deleted!");
      showRoles(); 
    })
    .catch(err => {
      console.error("Error deleting role:", err.message);
    });
};


// function to delete employees
deleteEmployee = () => {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employees`;

  connection.promise().query(employeeSql)
  .then(([data]) => {
    const employeeChoices = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

    return inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: "Which employee would you like to delete?",
        choices: employeeChoices
      }
      ]);
    })
    .then(empChoice => {
      const sql = `DELETE FROM employees WHERE id = ?`;
      return connection.promise().query(sql, [empChoice.employeeId]);
    })
    .then(() => {
      console.log("Successfully deleted!");
      showEmployees(); 
    })
    .catch(err => {
      console.error("Error deleting employee:", err.message);
    });
  };

// view department budget 
viewBudget = () => {
  console.log('Showing budget by department...\n');

  const sql = `SELECT departments.id AS id, 
                      departments.name AS department,
                      SUM(salary) AS budget
               FROM  roles  
               JOIN departments ON roles.department_id = departments.id GROUP BY  departments.id`;
  
  connection.promise().query(sql)
  .then(([rows, fields]) => {
    console.table(rows);
    promptUser();
  })
  .catch(err => {
    console.error('Error fetching budget by department:', err);
    promptUser();
  })
  };