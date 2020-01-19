// these functions are not working and are not linked to the actual tracker.

// empl.js > updateEmpl() w/ manager update


// inside switch statement empl.js > function up2()
case 'manager_id':
                upPrompt = {
                    name: "update",
                    type: "list",
                    message: "Who is this employees new manager?",
                    choices: mgrs
                }
            break;
// inside switch statement empl.js > function up3()
case 'manager_name':
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
                    // if (err) throw err;
                    upD = res[0].id;
                    up4(upD, up, eName); //passed upD up data eName
                });
            break;


function alterMnCol() {
    console.log("Alter manager name column");
    tracker.connection.query("ALTER TABLE employees ADD manager_name VARCHAR(150)", function(err,res) {
        console.log(res);
        if (err) {
            dropMnCol(alterMnCol());
        }
        else {
            updateMnCol();    
        }
    });
}

function updateMnCol() {
    console.log("Update manager name column");
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
                    function(err, result) {
                        if (err) throw err;
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
                                tracker.runStart()
                        });
                    });
                }
            }
        });
    });
}

function dropMnCol(after) {
    console.log("Drop manager name column");
    tracker.connection.query(
    "ALTER TABLE employees DROP COLUMN manager_name", function(err,res) {
        if (err) {
            console.log("error");
        }
        else {
            if (after === true) {
               return after;
            }
        }
    });
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

// exports.viewByMan = viewByMan;
// exports.alterMnCol = alterMnCol;
// exports.updateMnCol = updateMnCol;
// exports.dropMnCol = dropMnCol;


// update emloyees manager id to manager name; may need to finish completeing bonus
let counter = 1;
let length = 1;
// creates table for employees, using inner joins to display role and department information
let eMan =[];

function viewEmp() {
    tracker.connection.query(
    "SELECT * FROM employees",
    function(err,res) {
        if (err) throw err;
        res.forEach(function(obj) {
            if (err) {
                console.log(err);
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
                        // if (error) throw error;
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
                            // if (e) throw r;
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