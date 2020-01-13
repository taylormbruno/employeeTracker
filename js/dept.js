// possibly use db wrapper but have not seen solid example

const runStart = require("../tracker");

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = require("../tracker");

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
        connection.query("INSERT INTO departments SET ?", 
            { dName: data.name }, 
        function(err, res) {
            if (err) throw err;
            console.log(`\nYou've added the following department: ${data.name} \n ------------------------------- \n`);
        });
        runStart();
    });
}

module.exports = department;