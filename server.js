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
  console.log("CLI app is running.");
  console.log(`Using PORT: ${PORT}`);
});
