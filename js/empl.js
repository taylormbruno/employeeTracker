
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
    tracker.connection.query("SELECT * FROM employees WHERE manager_id IS NULL", function(err, res) {
        // console.log(res);
        if(err) throw err;
        for(let i=0; i<res.length; i++) {
            let first = res[i].first_name;
            let last = res[i].last_name;
            let mName = first.concat(' ', last); 
            mgrs.push(mName);
            // console.log(mName);
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
        let mgrN = answers.manager.split(" ");
         tracker.connection.query(
             "SELECT * FROM roles WHERE ?", 
             {
                 title: answers.role,
             },
         function(err, res) {
            if (err) throw err;
            let roleOut = res[0].id;

            if (mgrN == "none") {
                mgrID = null;
            }
            else {
                let fN = mgrN[0];
                let lN = mgrN[1];
                console.log("\n 1 NAME MGR: " + fN + " " + lN);
                tracker.connection.query(
                "SELECT * FROM employees WHERE ? AND ?", 
                [{first_name: fN}, {last_name: lN}], 
                function(err, res) {
                    if (err) throw err;
                    console.log("\n 2 result id: " + res[0].id);
                    let im = res[0].id;
                    return addE(answers, im, roleOut);
                });
            }
        });
    });
}

function addE(answers, im, roleOut) {
    console.log("\n 3 answers: " + answers.fName);
    console.log("\n 4 im " + im);
    console.log("\n 5 roleOut " + roleOut);
    tracker.connection.query(
    "INSERT INTO employees SET ?", 
        {
            first_name: answers.fName, 
            last_name: answers.lName, 
            role_id: roleOut,
            manager_id: im
        }, 
    function(err, res) {
        if (err) throw err;
        console.log(`\n 5 You've added the following employee: ${answers.fName} ${answers.lName} \n ------------------------------- \n`);
    });
    tracker.runStart();
}
exports.retrMan = retrMan;
exports.retrRoles = retrRoles;
exports.employee = employee;

