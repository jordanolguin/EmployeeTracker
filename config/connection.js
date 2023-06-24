require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1", // for Mac users
  // host: "localhost", // for Windows users
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;
