let runStart = require("../tracker");

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = require("../tracker");

let roles = [];

// used to retrieve roles to create inquirer lists for employee
function retrRoles() {
    connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            roles.push(res[i].title);
        }
        console.log(roles);
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
             choices: ["Accounting"]
         },
         {
             name: "manager",
             type: "confirm",
             message: "Is this employee a manager?"
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
                 }, 
             function(err, res) {
                 if (err) throw err;
                 console.log(`\nYou've added the following employee: ${answers.fName} ${answers.lName} \n ------------------------------- \n`);
             });
             runStart();
         });
     });
 }

module.exports = retrRoles;
module.exports = employee;