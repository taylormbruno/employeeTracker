// possibly use db wrapper for connection but have not seen solid example

const mysql = require("mysql");
const inquirer = require("inquirer");

const tracker = require("../tracker");

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
        tracker.connection.query("INSERT INTO departments SET ?", 
            { dept_name: data.name }, 
        function(err, res) {
            if (err) throw err;
            console.log(`\nYou've added the following department: ${data.name} \n ------------------------------- \n`);
            tracker.runStart();
        });
    });
}

exports.department = department;