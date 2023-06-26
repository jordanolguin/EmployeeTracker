const inquirer = require("inquirer");
const asciiart = require("asciiart-logo");
const db = require("./config/connection");

//asciiart-logo
const coolTitleArt = asciiart({
  name: "Employee Manager",
  font: "Doom",
  lineChars: 10,
  padding: 2,
  margin: 2,
  borderColor: "cyan",
  logoColor: "cyan",
  textColor: "cyan",
}).render();

//main menu options
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuChoice",
        message: "What would you like to do?",
        choices: [
          {
            name: "View All Employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "Add Employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "View Employees by Manager",
            value: "VIEW_EMPLOYEES_BY_MANAGER",
          },
          {
            name: "Update Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE",
          },
          {
            name: "View All Roles",
            value: "VIEW_ALL_ROLES",
          },
          {
            name: "Add Role",
            value: "ADD_ROLE",
          },
          {
            name: "View All Departments",
            value: "VIEW_ALL_DEPARTMENTS",
          },
          {
            name: "Add Department",
            value: "ADD_DEPARTMENT",
          },
          {
            name: "Exit",
            value: "EXIT",
          },
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menuChoice) {
        case "VIEW_EMPLOYEES":
          viewAllEmployees();
          break;
        case "ADD_EMPLOYEE":
          addEmployee();
          break;
        case "VIEW_EMPLOYEES_BY_MANAGER":
          viewEmployeeByManager();
          break;
        case "UPDATE_EMPLOYEE_ROLE":
          updateEmployeeRole();
          break;
        case "VIEW_ALL_ROLES":
          viewAllRoles();
          break;
        case "ADD_ROLE":
          addRole();
          break;
        case "VIEW_ALL_DEPARTMENTS":
          viewAllDepartments();
          break;
        case "ADD_DEPARTMENT":
          addDepartment();
          break;
        case "EXIT":
          exit();
          break;
        default:
          console.log("Invalid choice. Please try again.");
          init();
          break;
      }
    });
}

//respective functions from main menu options
function viewAllEmployees() {
  db.query("SELECT * FROM employee", (err, results) => {
    if (err) {
      console.error("Error retrieving employees:", err);
      return;
    }
    console.table(results);
    init();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "employeeDepartment",
        message: "What is the employee's role?",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
        ],
      },
      {
        type: "list",
        name: "employeeManager",
        message: "Who is the employee's manager?",
        choices: [
          "None",
          "John Doe",
          "Mike Chan",
          "Ashley Rodriguez",
          "Kevin Tupik",
          "Kunal Singh",
          "Malia Brown",
          "Sarah Lourd",
          "Tom Allen",
        ],
      },
    ])
    .then((answers) => {
      const roleName = answers.employeeDepartment;
      const managerName = answers.employeeManager;
      db.query(
        `SELECT id FROM role WHERE title = '${roleName}'`,
        (err, roleResults) => {
          const roleId = roleResults[0].id;
          if (managerName === "None") {
            const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
            const values = [answers.firstName, answers.lastName, roleId];

            db.query(sql, values, (err, result) => {
              if (err) {
                console.error("Error adding employee to the database: ", err);
                return;
              }
              console.log("Employee added successfully!");
              init();
            });
          } else {
            db.query(
              `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = '${managerName}'`,
              (err, managerResults) => {
                const managerId = managerResults[0].id;
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                const values = [
                  answers.firstName,
                  answers.lastName,
                  roleId,
                  managerId,
                ];

                db.query(sql, values, (err, result) => {
                  if (err) {
                    console.error(
                      "Error adding employee to the database: ",
                      err
                    );
                    return;
                  }
                  console.log("Employee added successfully!");
                  init();
                });
              }
            );
          }
        }
      );
    });
}

function viewEmployeeByManager() {
  const sql = `SELECT CONCAT (first_name, " ", last_name) AS name, id AS value 
  FROM employee_tracker_db.employee
  WHERE manager_id IS NULL;`;
  db.query(sql, (err, employeeResults) => {
    if (err) {
      console.error("Error retrieving employees: ", err);
      return;
    }
    inquirer
      .prompt([
        {
          type: "list",
          name: "managerId",
          message: "Select a manager to view their employees",
          choices: employeeResults,
        },
      ])
      .then((answers) => {
        const sql2 = `SELECT * FROM employee_tracker_db.employee
        WHERE manager_id = ${answers.managerId};`;
        db.query(sql2, (err, results) => {
          if (err) {
            console.error("Error retrieving employees: ", err);
            return;
          }
          console.table(results);
          init();
        });
      });
  });
}

function updateEmployeeRole() {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, employeeResults) => {
    if (err) {
      console.error("Error retrieving employees: ", err);
      return;
    }
    const employees = employeeResults.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    const roleSql = "SELECT * FROM role";
    db.query(roleSql, (err, roleResults) => {
      if (err) {
        console.error("Error retrieving roles: ", err);
        return;
      }
      const roles = roleResults.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role would you like to update?",
            choices: employees,
          },
          {
            type: "list",
            name: "roleId",
            message:
              "Which role do you want to assign to the selected employee?",
            choices: roles,
          },
        ])
        .then((answers) => {
          const employeeId = answers.employeeId;
          const roleId = answers.roleId;
          const updateSql = "UPDATE employee SET role_id = ? WHERE id = ?";
          const updateValues = [roleId, employeeId];
          db.query(updateSql, updateValues, (err, result) => {
            if (err) {
              console.error("Error updating employee role: ", err);
              return;
            }
            console.log("Employee role updated successfully!");
            init();
          });
        });
    });
  });
}

function viewAllRoles() {
  db.query("SELECT * FROM role", (err, results) => {
    if (err) {
      console.error("Error retrieving employees: ", err);
      return;
    }
    console.table(results);
    init();
  });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "roleDepartment",
        message: "Which department does the role belong to?",
        choices: ["Sales", "Engineering", "Finance", "Legal"],
      },
    ])
    .then((answers) => {
      const { roleTitle, roleSalary, roleDepartment } = answers;
      db.query(
        "SELECT id FROM department WHERE name = ?",
        roleDepartment,
        (err, departmentResults) => {
          if (err) {
            console.error("Error retrieving department ID: ", err);
            return;
          }
          const departmentId = departmentResults[0].id;
          const sql =
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
          const values = [roleTitle, roleSalary, departmentId];
          db.query(sql, values, (err, result) => {
            if (err) {
              console.error("Error adding role to the database: ", err);
              return;
            }
            console.log("Role added successfully!");
            init();
          });
        }
      );
    });
}

function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      console.error("Error retrieving employees:", err);
      return;
    }
    console.table(results);
    init();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      const departmentName = answers.departmentName;
      const sql = "INSERT INTO department (name) VALUES (?)";
      const values = [departmentName];
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error adding department to the database: ", err);
          return;
        }
        console.log("Department added successfully!");
        init();
      });
    });
}

function exit() {
  console.log("Goodbye!");
  db.end();
  process.exit();
}

console.log(coolTitleArt);
init();
