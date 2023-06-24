const inquirer = require("inquirer");
require("dotenv").config();
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection({
  host: "127.0.0.1", // for Mac users
  // host: "localhost", // for Windows users
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the employee_tracker_db database.");
  console.log(`Using PORT: ${PORT}`);
});

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
        case "Add Department":
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

function viewAllEmployees() {
  // Execute a db.query to fetch all employees
  // Display the employee data in a formatted table
  //console.table
  // Call init() to prompt the user with the menu options again
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
      //execute db.query to add the employee with the provided info
      //call init() to prompt the menu options again
    });
}

function updateEmployeeRole() {}

function viewAllRoles() {
  // Execute a db.query to fetch all roles
  // Display the role data in a formatted table
  // Call init() to prompt the user with the menu options again
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
      //execute db.query to add the role with the provided title, salary, and department
      //call init() to prompt the menu options again
    });
}

function viewAllDepartments() {
  // Execute a db.query to fetch all departments
  // Display the department data in a formatted table
  // Call init() to prompt the user with the menu options again
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
      //execute db.query to add the department with the provided name
      //call init() to prompt the menu options again
    });
}

function exit() {
  console.log("Goodbye!");
  db.end();
  process.exit();
}

init();
