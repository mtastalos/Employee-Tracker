const mysql = require('mysql2');

// Your MySQL user name/password
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'associates',
});

module.exports = db;
