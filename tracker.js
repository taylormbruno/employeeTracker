const mysql = require("mysql");
const inquirer = require("inquirer");

let depts = [];
let roles = [];

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

    // retrDepts();
});

// starts application. change to which category they are working on leading to more prompts specific to that category
function runStart() {
    inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View departments",
                "Add department",
                "View roles", 
                "Add role", 
                "View employees",
                "Add employee", 
                "Exit"
            ]
        }
    ).then(function(data) {
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
}

// used to retrieve departments to create inquirer lists for roles
function retrDepts() {
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            depts.push(res[i].dName);
            console.log(depts);
        }
    });
    console.log(depts);
}

// used to retrieve roles to create inquirer lists for employee
function retrRoles() {
    connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            roles.push(res[i].title);
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

// create department
function department() {
    inquirer.prompt(
        {
            name: "name",
            type: "input",
            message:"What would you like to name this department?"
        }
    ).then(function(data) {
        // let query = 'INSERT INTO departments VALUES ?';
        connection.query("INSERT INTO departments SET ?", { dName: data.name }, function(err, res) {
            if (err) throw err;
            console.log(`\nYou've added the following department: ${data.name} \n ------------------------------- \n`);
        });
        runStart();
    });
}

// create role
function role() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message:"What would you like to name this role?"
        },
        {
            name: "salary",
            type: "input",
            message:"What would you like the salary for this role set to?"
        },
        {
            name: "deptID",
            type: "list",
            message:"What is the department for this role?",
            choices: depts
        }
    ]).then(function(data) {
        let dId  = data.deptID;
        let dSal = data.salary;
        let dTi = data.title;
        connection.query(
            "SELECT * FROM departments WHERE ?",
            {
                dName: dId
            }, 
            function(err, res) {
                if (err) throw err;
                deptOut = res[0].id;
                console.log(dSal);
                connection.query("INSERT INTO roles SET ?", 
                { 
                    title: dTi,
                    salary: dSal,
                    department_id: deptOut
                }, function(err, res) {
                    if (err) throw err;
                    console.log(`\nYou've added the following role: ${data.title} \n ------------------------------- \n`);
                });
                runStart();
            }
        );
    });
}

// create employee
function employee() {
   inquirer.prompt([
        {
            name: "fName",
            type: "input",
            message:"What is the first name of this employee?"
        },
        {
            name: "lName",
            type: "input",
            message:"What is the last name of this employee?"
        },
        {
            name: "role",
            type: "list",
            message:"What is the role of this employee?",
            choices: roles
        }
   ]).then(function(answers) {
        connection.query(
            "SELECT * FROM roles WHERE ?", 
            {
                title: answers.role,
            },
            function(err, res) {
                if (err) throw err;
                roleOut = res[0].id;
                connection.query(
                    "INSERT INTO employees SET ?", 
                    {
                        first_name: answers.fName, 
                        last_name: answers.lName, 
                        role_id: roleOut,
                        manager_id: null
                }, function(err, res) {
                    if (err) throw err;
                    console.log(`\nYou've added the following employee: ${answers.fName} ${answers.lName} \n ------------------------------- \n`);
                });
                runStart();
            }
        );
    })
}