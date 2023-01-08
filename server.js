const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'pleasedad2004',
    database: 'employee_db'
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the employee_db database.");
    start();
});


function start(){
    inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "View Department",
        "View Role",
        "Add Department",
        "Add Employee",
        "Add Role",
        "End"]
    })
    .then(function ({ task }) {
        switch (task) {
          case "View Employees":
            view_employee();
            break;
  
          case "View Department":
            view_department();
            break;

          case "View Role":
            view_role();
            break;

          case "Add Department":
            add_department();
            break;
        
          case "Add Employee":
            add_employee();
            break;
  
          case "Add Role":
            add_role();
            break;
  
          case "End":
            db.end();
            break;
        }
    });
}


function view_employee() {
  var query = 'SELECT * FROM employee';
  db.query(query, function(err, res) {
      if (err) throw err;
      console.log(res.length + ' employees found!');
      console.table('All Employees:', res); 
      start();
  })
};

function add_employee() {
  db.query('SELECT * FROM role', function (err, res) {
      if (err) throw err;
      inquirer
          .prompt([
              {
                  name: 'first_name',
                  type: 'input', 
                  message: "What is the employee's fist name? ",
              },
              {
                  name: 'last_name',
                  type: 'input', 
                  message: "What is the employee's last name? "
              },
              {
                  name: 'manager_id',
                  type: 'input', 
                  message: "What is the employee's manager's ID? "
              },
              {
                  name: 'role', 
                  type: 'list',
                  choices: function() {
                  var roleArray = [];
                  for (let i = 0; i < res.length; i++) {
                      roleArray.push(res[i].title);
                  }
                  return roleArray;
                  },
                  message: "What is this employee's role? "
              }
              ]).then(function (answer) {
                  let role_id;
                  for (let a = 0; a < res.length; a++) {
                      if (res[a].title == answer.role) {
                          role_id = res[a].id;
                          console.log(role_id)
                      }                  
                  }  
                  db.query(
                  'INSERT INTO employee SET ?',
                  {
                      first_name: answer.first_name,
                      last_name: answer.last_name,
                      manager_id: answer.manager_id,
                      role_id: role_id,
                  },
                  function (err) {
                      if (err) throw err;
                      console.log('An employee has been added!');
                      start();
                  })
              })
      })
};

function view_department() {
    var query = 'SELECT * FROM department';
    db.query(query, function(err, res) {
        if(err)throw err;
        console.log(res.length + ' department found!');
        console.table('All Departments:', res);
        start();
    })
  };

function add_department() {
  inquirer
      .prompt([
          {
              name: 'newDepartment', 
              type: 'input', 
              message: 'Which department would you like to add?'
          }
          ]).then(function (answer) {
              db.query(
                  'INSERT INTO department SET ?',
                  {
                      name: answer.newDepartment
                  });
              var query = 'SELECT * FROM department';
              db.query(query, function(err, res) {
              if(err)throw err;
              console.log('Your department has been added!');
              console.table('All Departments:', res);
              start();
              })
          })
};

function view_role() {
  var query = 'SELECT * FROM role';
  db.query(query, function(err, res){
      if (err) throw err;
      console.table('All Roles:', res);
      start();
  })
};

function add_role() {
  db.query('SELECT * FROM department', function(err, res) {
      if (err) throw err;
  
      inquirer 
      .prompt([
          {
              name: 'new_role',
              type: 'input', 
              message: "What new role would you like to add?"
          },
          {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this role? (Enter a number)'
          },
          {
              name: 'Department',
              type: 'list',
              choices: function() {
                  var deptArry = [];
                  for (let i = 0; i < res.length; i++) {
                  deptArry.push(res[i].name);
                  }
                  return deptArry;
              },
          }
      ]).then(function (answer) {
          let department_id;
          for (let a = 0; a < res.length; a++) {
              if (res[a].name == answer.Department) {
                  department_id = res[a].id;
              }
          }
          db.query(
              'INSERT INTO role SET ?',
              {
                  title: answer.new_role,
                  salary: answer.salary,
                  department_id: department_id
              },
              function (err, res) {
                  if(err)throw err;
                  console.log('Your new role has been added!');
                  console.table('All Roles:', res);
                  start();
              })
      })
  })
};