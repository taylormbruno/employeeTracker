const mysql = require("mysql");
const inquirer = require("inquirer");

const department = require("./js/dept");
const role = require("./js/role");
const retrDepts = require('./js/role');
const employee = require("./js/empl");
const retrRoles = require('./js/empl');

const connection = mysql.createConnection({
    host: "localhost",
    // your port
    port: 3306,
    // your username
    user: "root",
    // your password
    password: "",
    database: "employees_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    runStart();

});

// starts application.
function runStart() {
    inquirer.prompt(
        {
            name: "category",
            type: "list",
            message: "What will you be working on today?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "Exit"
            ]
        }
    ).then(function(data) {
        let catQ = [];
        switch (data.category) {
            case "Departments":
                catQ = ["View departments", "Add department"];
                break;
            case "Roles":
                catQ = ["View roles", "Add role"];
                break;
            case "Employees":
                catQ = ["View employees", "Add employee"]
                break;
        }
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: catQ
        }).then(function(data) {
            switch (data.action) {
            case "View departments":
                view("departments");
                break;
    
            case "Add department": 
                department();
                break;
    
            case "View roles":
                view("roles");
                break;
                
            case "Add role":
                retrDepts();
                role();
                break;
    
            case "View employees":
                view("employees");
                break;
                    
            case "Add employee":
                retrRoles();
                employee();
                break;
    
            case "Exit":
                connection.end();
                break;
            }
        });
    });
}

// used to view a table from the console
function view(view) {
    switch (view) {
        case "departments":
            query = "SELECT * FROM departments";
            connection.query(query, function(err,res) {
                if (err) throw err;
        
                console.log("  ID  |  Name  \n---------------");
                for(let i=0; i<res.length; i++) {
                    console.log(`${res[i].id}  |  ${res[i].dName}`);
                }
                runStart();
            });
            break;
        case "roles":
            query = "SELECT * FROM roles";
            connection.query(query, function(err,res) {
                if (err) throw err;
        
                console.log("  ID  |  Title  |  Salary  |  Department ID  \n---------------");
                for(let i=0; i<res.length; i++) {
                    console.log(`${res[i].id}  |  ${res[i].title}  |  $${res[i].salary}  |  ${res[i].department_id}`);
                }
                runStart();
            });
            break;
        case "employees":
            query = "SELECT * FROM employees";
            connection.query(query, function(err,res) {
                if (err) throw err;
        
                console.log("  ID  |  Name  |  Role ID  |  Manager ID  \n---------------");
                for(let i=0; i<res.length; i++) {
                    console.log(`${res[i].id}  |  ${res[i].last_name}, ${res[i].first_name}  |  ${res[i].role_id}  |  ${res[i].manager_id}`);
                }
                runStart();
            });
            break;
    }
}

module.exports = runStart;
module.exports = connection;