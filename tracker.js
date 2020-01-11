const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"Rbkoho46",
    database:"employees_db"
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
                "Add department", 
                "Add role", 
                "Add employee", 
                "Exit"
            ]
        }
    ).then(function(data) {
        switch (data.action) {
        case "Add department": 
            department();
            break;

        case "Add role":
            role();
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

function department() {
    inquirer.prompt(
        {
            name: "dName",
            type: "input",
            message:"What would you like to name this department?"
        }
    ).then(function(data) {
        let query = `INSERT INTO departments (name) VALUES (?)`;
        connection.query(query, [
            data.dName
        ], 
        function(err, res) {
            if (err) throw err;
            console.log(`You've added the following department: ${data.dName} \n ------------------------------- \n`);
            console.log("  ID  |   Name  ")
            // does not work after here
            console.log(res);
            for (let i=0; i < res.length; i++) {
                console.log(`${res[i].id} | ${res[i].name}`);
            }
        });
    });
}