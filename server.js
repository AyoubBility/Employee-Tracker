const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'pleasedad2004',
    database: 'employee_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    opening_prompt();
});

function opening_prompt(){
    inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "View Employees by Department",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Add Role",
        "End"]
    })
}