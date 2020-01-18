// possibly use db wrapper for connection but have not seen solid example

const mysql = require("mysql");
const inquirer = require("inquirer");

const tracker = require("../tracker");
const role = require("./role");

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

let depts = [];

// used to retrieve departments to create inquirer lists for roles
function retrDepts() {
    tracker.connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            depts.push(res[i].dept_name);
        }
    });
}

const chc = ["All roles for this department will be moved/added to the same department", "All roles for this department will be deleted !This can not be undone!", "I will individually update these roles"];
function delDept() {
    inquirer.prompt([
        {
            name: "dept",
            type: "list",
            message:"Which department would you like to delete?",
            choices: depts
        },{
            name:"task",
            type:"list",
            message:"Before deleting the department, do you need to update any roles?",
            choices: chc
        }
    ]).then(function(data){
        const dept = data.dept;
        const task = data.task;
        switch (task) {
            case chc[0]: 
            depRol(dept, "update");
            break;
            case chc[1]:
            depRol(dept, "delete");
            break;
            case chc[2]:
            depRol(dept, "nothing");
            break;
        }
    });
}

let old_id;
let new_id;

function depRol(dept, task) {
    console.log("76: " + dept);
    let oldD = dept;
    console.log("78: " + task);
    switch (task) {
        case "update":
            msg = `What department would you like to move the ${dept}'s roles to?`;
            inquirer.prompt({
                name: "newDept",
                type:"list",
                message: msg,
                choices: depts
            }).then(function(data) {
                console.log("88: " + oldD);
                let newD = data.newDept;
                console.log("90: " + newD);
                let old_id = getDeptId(oldD);
                let new_id = getDeptId(newD);
                // returns undefined
                console.log("93: " + old_id);
                console.log("94: " + new_id);
                // role.updateRoles(new_id, old_id, oldD, newD);
                // deleteDept(oldD);
            });
        break;
        case "delete":
            console.log(`\nDeleting all roles under the department: ${oldD}\n ------------------------------- \n`);
            tracker.connection.query(
            "DELETE FROM roles WHERE ?", {

            },
            function(err, res){
                if (err) throw err;
                console.log(`Deleting all roles under`)
            });

        break;
        case "nothing":
            deleteDept(oldD);
        break;
    }
}

function deleteDept(oldD) {
    console.log(oldD);
    tracker.connection.query(
    "DELETE FROM departments WHERE ?",
    {
        dept_name: oldD
    },
    function(err,res) {
        if (err) throw err;
        console.log(`\nYou've deleted the following department: ${oldD} \n ------------------------------- \n`);
    });
}

function getDeptId(id) {
    let get_id;
    tracker.connection.query(
    "SELECT * FROM departments WHERE ?", 
    {
        dept_name: id
    },
    function(err, res) {
        if (err) throw err;
        get_id = res[0].id;           
        console.log("139: " + get_id);
    });
    return get_id;
}

exports.department = department;
exports.delDept = delDept;
exports.retrDepts = retrDepts;

