
const mysql = require("mysql");
const inquirer = require("inquirer");

const tracker = require("../tracker");

let roles = [];
let mgrs = ["none"];

// used to retrieve roles to create inquirer lists for employee
function retrRoles() {
    tracker.connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            roles.push(res[i].title);
        }
        // console.log(roles);
    });
}

function retrMan() {
    tracker.connection.query("SELECT * FROM employees WHERE manager_id!=null", function(err, res) {
        if(err) throw err;
        for(let i=0; i<res.length; i++) {
            let first = res[i].first_name;
            let last = res[i].last_name;
            let mName = first.concat(' ', last); 
            mgrs.push(mName);
        }
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
         },
         {
             name: "manager",
             type: "list",
             message: "Whos is this empoyees manager?",
             choices: mgrs
         }
    ]).then(function(answers) {
         tracker.connection.query(
             "SELECT * FROM roles WHERE ?", 
             {
                 title: answers.role,
             },
         function(err, res) {
             if (err) throw err;
             roleOut = res[0].id;
             tracker.connection.query(
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
             tracker.runStart();
         });
     });
 }

exports.retrMan = retrMan;
exports.retrRoles = retrRoles;
exports.employee = employee;
