const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const deptJ = require("./js/dept");
const roleJ = require("./js/role");
const emplJ = require("./js/empl");

const connection = mysql.createConnection({
    host: "localhost",
    // your port
    port: 3306,
    // your username
    user: "root",
    // your password
    password: "12345678",
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
                chooseCat(catQ);
                break;
            case "Roles":
                catQ = ["View roles", "Add role", "Exit"];
                chooseCat(catQ);
                break;
            case "Employees":
                catQ = ["View all employees", "View employees by manager", "Add employee", "Update Employee", "Exit"];
                emplJ.retrMan();
                emplJ.retrRoles();
                chooseCat(catQ);
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}


function chooseCat(catQ) {
    inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: catQ
        }
    ).then(function(data) {
        switch (data.action) {
            case "View departments":
            view("departments");
            break;
    
            case "Add department": 
            deptJ.department();
            break;
    
            case "View roles":
            view("roles");
            break;
                
            case "Add role":
            roleJ.retrDepts();
            roleJ.role();
            break;
    
            case "View all employees":
            emplJ.viewEmp();
            break;

            case "View employees by manager":
            emplJ.viewByMan();
            break;
                    
            case "Add employee":
            emplJ.employee();
            break;

            case "Update Employee":
            emplJ.updateEmpl()
            break;
    
            case "Exit":
            connection.end();
            break;
        }
    });
}

// used to view a table from the console
function view(view) {
    switch (view) {
        case "departments":
            query = "SELECT * FROM departments";
            connection.query(query, function(err,res) {
                if (err) throw err;
                console.table(res);
                runStart();
            });
            break;
        case "roles":
            query = "SELECT * FROM roles";
            connection.query(query, function(err,res) {
                if (err) throw err;
                console.table(res);
                runStart();
            });
            break;
        case "employees":
            query = "SELECT e.first_name, e.last_name, e.manager_name, r.title, r.salary, d.dept_name FROM ((employees e INNER JOIN roles r ON e.role_id = r.id) INNER JOIN departments d ON r.department_id = d.id)";
            connection.query(query, function(err,res) {
                if (err) throw err;
                console.table(res);
                runStart();
            });
            break;
    }
}

exports.runStart = runStart;
exports.connection = connection;
exports.view = view;