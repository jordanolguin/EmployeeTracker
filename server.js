const inquirer = require("inquirer");
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
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menuChoice) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Exit":
          exit();
          break;
        default:
          console.log("Invalid choice. Please try again.");
          init();
          break;
      }
    });
}

function viewAllEmployees()

function addEmployee()

function updateEmployeeRole()

function viewAllRoles()

function addRole()

function viewAllDepartments()

function addDepartment()

function exit()

init();
