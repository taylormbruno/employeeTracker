// these functions are not working and are not linked to the actual tracker.

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