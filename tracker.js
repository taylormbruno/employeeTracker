const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    // your port
    port: 3306,
    // your username
    user: "root",
    // your password
    password: "Rbkoho46",
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
            employee();
            break;

        case "Exit":
            connection.end();
            break;
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