const mysql = require("mysql");
const inquirer = require("inquirer");

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
});

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

function retrRoles() {
    connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            roles.push(res[i].title);
        }
    });
}

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
    ]).then(function(data) {
        // let query = 'INSERT INTO departments VALUES ?';
        connection.query("INSERT INTO roles(title, salary, department_id) VALUES ?", 
        { 
            title: data.title,
            salary: data.salary,
            department_id: data.deptId

        }, function(err, res) {
            if (err) throw err;
            console.log(`\nYou've added the following role: ${data.title} \n ------------------------------- \n`);
        });
        runStart();
    });
}

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
        let roleID;
        console.log(roleID);
        let r = connection.query(
            "SELECT * FROM roles WHERE ?", 
            {
                title: answers.role,
            },
            function(err, res) {
                if (err) throw err;
                // console.log(`ROLE\n-----------------\n${JSON.stringify(res[0].id)}\n-----------------`);
                // console.log(roleStr);
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
        // roleID = r;
        // console.log(roleID);
    })
}