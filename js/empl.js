
const inquirer = require("inquirer");
const tracker = require("../tracker");

let roles = [];
let mgrs = [];

// used to retrieve roles to create inquirer lists for employee
function retrRoles() {
    roles=[];
    tracker.connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            roles.push(res[i].title);
        }
    });
}

function retrMan() {
    mgrs = ["none"];
    tracker.connection.query("SELECT * FROM employees WHERE manager_id IS NULL", function(err, res) {
        // console.log(res);
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
                im = null;
                return addE(answers, im, roleOut)
            }
            else {
                let fN = mgrN[0];
                let lN = mgrN[1];
                tracker.connection.query(
                "SELECT * FROM employees WHERE ? AND ?", 
                [{first_name: fN}, {last_name: lN}], 
                function(err, res) {
                    if (err) throw err;
                    let im = res[0].id;
                    return addE(answers, im, roleOut);
                });
            }
        });
    });
}

function addE(answers, im, roleOut) {
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
        console.log(`\n You've added the following employee: ${answers.fName} ${answers.lName} \n ------------------------------- \n`);
        tracker.runStart();
    });
}

function updateEmpl() {
    let empCol = [];
    let empNames = [];
    tracker.connection.query("SHOW COLUMNS FROM employees", function(err,res) {
        if (err) throw err;
        res.forEach(obj => empCol.push(obj.Field));
        empCol.shift();
    });
    tracker.connection.query("SELECT * FROM employees", function(err,res) {
        if (err) throw err
        res.forEach(function(obj) {
        let name = obj.first_name.concat(" ", obj.last_name);
        empNames.push(name);
        });
        updE2(empNames, empCol);
    });
}

let eName;

function updE2(empNames, empCol) {
    inquirer.prompt([
        {
            name: "who",
            type: "list",
            message: "Who would you like to update?",
            choices: empNames
        },
        {
            name: "upWhat",
            type: "list",
            message: "What would you like to update?",
            choices: empCol
        }
    ]).then(function(data) {
        eName = data.who;
        let up = data.upWhat;
        switch (data.upWhat) {
            case 'first_name':
                upPrompt = {
                    name: "update",
                    type: "input",
                    message: "What is this employees new first name?"
                }
            break;
            case 'last_name':
                upPrompt = {
                    name: "update",
                    type: "input",
                    message: "What is this employees new last name?"
                }
            break;
            case 'role_id':
                upPrompt = {
                    name: "update",
                    type: "list",
                    message: "What is this employees new role?",
                    choices: roles
                }
            break;
            case 'manager_id':
                upPrompt = {
                    name: "update",
                    type: "list",
                    message: "Who is this employees new manager?",
                    choices: mgrs
                }
            break;
        }
        up3(up, upPrompt);
    });
}

function up3(up, upPrompt) {
    inquirer.prompt(upPrompt).then(function(data) {
        let upD;
        switch (up) {
            case 'first_name':
            case 'last_name':
                upD = data.update;
                up4(upD, up);
            break;
            case 'role_id':
                tracker.connection.query('SELECT id FROM roles WHERE ?',{
                    title: data.update
                } ,
                function (err,res) {
                    upD = res[0].id;
                    up4(upD, up, data, eName)
                });
            break;
            case 'manager_id':
                let mN = data.update.split(" ");
                tracker.connection.query('SELECT id FROM employees WHERE ? AND ?',[
                    {
                        first_name: mN[0]
                    },
                    {
                        last_name: mN[1]
                    }
                ],
                function (err,res) {
                    upD = res[0].id;
                    up4(upD, up)
                });
            break;
        } 
    });
}

function up4(upD, up) {
    let p1 = {};
    p1[up] = upD;
    let nm = eName.split(" ");
    tracker.connection.query(
    "UPDATE employees SET ? WHERE (? AND ?)",[p1, {first_name: nm[0]}, {last_name: nm[1]}],
    function(err, res) {
        console.log(`\nYou have now updated ${eName}'s *${up}* to ${upD}`);
        tracker.runStart();

    });
}

let counter = 1;
let length = 1;
// creates table for employees, using inner joins to display role and department information
let eMan=[];

function viewEmp() {
    tracker.connection.query(
    "SELECT * FROM employees",
    function(err,res) {
        if (err) throw err;
        res.forEach(function(obj) {
            if (err) {
            }
            else {
                if (obj.manager_id === null) {
                }
                else {
                    tracker.connection.query(
                    "SELECT first_name, last_name FROM employees WHERE ?", 
                    {
                        id: obj.manager_id
                    },
                    function(error, result) {
                        if (error) throw error;
                        eMan = (result[0].first_name.concat(" ", result[0].last_name));
                        tracker.connection.query(
                        "UPDATE employees SET ? WHERE ?",
                        [
                            {
                                manager_name: eMan
                            },
                            {
                                id: obj.id
                            }
                        ],
                        function(e, r) {
                            if (e) throw r;
                            viewE2();
                        });
                    });
                }
            }
        });
    });
}
function viewE2() {
    counter++;
    if (counter === (length+1)) {
        tracker.view("employees");
    }
}

function viewByMan() {
    inquirer.prompt(
        {
            name: "viewMan",
            type: "list",
            message: "Which manager's employees would you like to see?",
            choices: mgrs
        }
    ).then(function(data) {
        tracker.connection.query(
            "SELECT e.first_name, e.last_name, e.manager_name, r.title, r.salary, d.dept_name FROM ((employees e INNER JOIN roles r ON e.role_id = r.id) INNER JOIN departments d ON r.department_id = d.id) WHERE ?",
            {
                manager_name: data.viewMan
            },
            function(err, res) {
                console.log(`\n${data.viewMan}'s Employees`);
                if (err) throw err;
                console.table(res);
                tracker.runStart();
            }
        )
    });
}

exports.retrMan = retrMan;
exports.retrRoles = retrRoles;
exports.employee = employee;
exports.updateEmpl = updateEmpl;
exports.viewEmp = viewEmp;
exports.viewE2 = viewE2;
exports.viewByMan = viewByMan;