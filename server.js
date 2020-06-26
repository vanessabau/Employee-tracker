//Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

//Connection information foe sql database
const connection = mysql.createConnection({
    host: "localhost",

    //PORT
    port: 3306, 

    //USERNAME
    user: "root",

    //PASSWORD
    password: "password",
    database: "employee_db"
});

//Connect to mySql server and database
connection.connect(function(err){
    if(err) throw err;
    console.log("SQL connected");

    //add start function here
    start();
});


function start(){
    inquirer
        .prompt([
            {
                type: "list",
                name: "start",
                message: "We have information on employees, departments, and employee roles. What would you like to do?",
                choices: ["View", "Add", "Update", "Exit"] 
            }
        ]).then (function(res){
            switch(res.start){
                case "View":
                    view();
                    break;
                case "Add":
                    add();
                    break;
                case "Update":
                    updateEmployee();
                break;
                case "Exit":
                    console.log("All done");
                    break;
                default:
                    console.log("default");
            }
        });
}

//VIEW FUNCTION SET
function view(){
    inquirer
        .prompt([
            {
                type: "list",
                name: "view",
                message: "Select one to view:", 
                choices: ["All employees", "By department", "By role"]
            }
        ]).then(function(res){
            switch(res.view){
                case "All employees":
                    viewAllEmployees();
                    break;
                case "By department":
                    viewByDepartment();
                    break;
                case "By role":
                    viewByRole();
                default:
                    console.log("default");
            }
        });
}

function viewAllEmployees(){
    connection.query("SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id", function(err, results){
        if(err) throw err;
        console.table(results);
        start();
    });
}

function viewByDepartment(){
    //query database for all departments
    connection.query("SELECT * FROM department", function(err, results){
        if(err) throw err;
        //once you have the departments, prompt user for which they chose
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function(){
                        let choiceArr = [];
                        for(i=0; i< results.length; i++){
                            choiceArr.push(results[i].name);
                        }
                        return choiceArr;
                    },
                    message: "Select department"
                }
            ]).then(function(answer){
                connection.query(
                    "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE d.name =?", [answer.choice], function(err, results){
                        if(err) throw err;
                        console.table(results);
                        start();
                    }
                )
            });
    });

}

function viewByRole(){
    //query database for all departments
    connection.query("SELECT title FROM role", function(err, results){
        if(err) throw err;
        //once you have the roles, prompt user for which they chose
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function(){
                        var choiceArr = [];
                        for(i=0; i< results.length; i++){
                            choiceArr.push(results[i].title);
                        }
                        return choiceArr;
                    },
                    message: "Select role"
                }
            ]).then(function(answer){
                console.log(answer.choice);
                connection.query(
                    "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE e.role_id =?", [answer.choice], function(err, results){
                        if(err) throw err;
                        console.table(results);
                        start();
                    }
                )
            });
    });

}


//ADD FUNCTION SET
function add(){
    inquirer
        .prompt([
            {
                type: "list",
                name: "add",
                message: "What would you like to add?",
                choices: ["Department", "Employee role", "Employee"]
            }
        ]).then(function(res){
            switch(res.add){
                case "Department":
                    addDepartment();
                    break;
                case "Employee role":
                    addEmployeeRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;
                default:
                    console.log("default");
            }
        })
}

function addDepartment(){
    //Prompt info for department
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What would you like the department name to be?"
            }
        ]).then(function(answer){
            connection.query(
                "INSERT INTO department VALUES (DEFAULT, ?)", 
                [answer.department], 
                function(err){
                    if(err) throw err;
                    console.log("-----------------------------------------");
                    console.log("Departments updated with "+ answer.department);
                    console.log("-----------------------------------------");
                    start();
                }
            )
        })
}

function addEmployeeRole(){
    //Prompt info for role
    inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "Enter role title:"
            },
            {
                name: "salary",
                type: "number",
                message: "Enter salary",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer){
            connection.query(
                "INSERT INTO role SET ?", 
                {
                    title: answer.role,
                    salary: answer.salary,
                }, 
                function(err){
                    if(err) throw err;
                    console.log("-----------------------------------------");
                    console.log("Departments updated with "+ answer.role);
                    console.log("-----------------------------------------");
                    start();
                }
            )
        })
}

function addEmployee(){
    connection.query("SELECT * FROM department", function(err, results){
        if(err) throw err;
        //Once you have results prompt user to new employee information
        inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter employee first name"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter employee last name"
            },  
            {
                name: "roleTitle",
                type: "input",
                message: "Enter employee's role"
            },
            {
                name: "salary",
                type: "number",
                message: "Enter employee salary",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "manager",
                type: "number",
                message: "Enter Manager ID",
                default: "1"
            },
            {
                name: "department",
                type: "rawlist",
                choices: function(){
                    var choiceArr = [];
                    for(i=0; i< results.length; i++){
                        choiceArr.push(results[i].name)
                    }
                    return choiceArr;
                },
                message: "Select Department"
            }
        ]).then(function(answer){
            //answer is an object with key value pairs from inquirer prompt
            console.log(answer); //delete this line in final version
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleTitle,
                    manager_id: answer.manager
                }
            );
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.roleTitle,
                    salary: answer.salary
                }
            );
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.department
                },
                console.log("-----------------------------------------"),
                console.log("Employee Added Successfully"),
                console.log("-----------------------------------------"),
                //start()
            );
        });
    });
    
}

//UPDATE FUNCTION SET
function updateEmployee(){
    //Select employee to update
    connection.query("SELECT * FROM employee",
        function(err, results){
        if(err) throw err;
        inquirer 
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function(){
                        let choiceArr = [];
                        for(i=0; i< results.length; i++)
                        {
                            choiceArr.push(results[i].last_name);
                        }
                        return choiceArr;
                    },
                    message: "Select employee to update"
                }
            ])
            .then(function(answer){
                //SaveName is employee
                const saveName = answer.choice;
                
                connection.query("SELECT * FROM employee WHERE last_name = ?", [answer.choice], 
                function(err, results){
                    connection.query("SELECT * FROM department", 
                    function(err, results){
                        if(err) throw err;
                    inquirer
                    .prompt([
                        {
                            name: "role_id",
                            type: "input",
                            message: "Enter new role title "
                        },
                        {
                            name: "salary",
                            type: "number",
                            validate: function(value){
                                if(isNaN(value) === false){
                                    return true;
                                }
                                return false;
                            },
                            message: "Enter new salary",
                        },
                        {
                            name: "manager",
                            type: "number",
                            validate: function(value){
                                if(isNaN(value) === false){
                                    return true;
                                }
                                return false;
                            },
                            message: "Enter new manager ID",
                            default: "1"
                        },
                        {
                            name: "department",
                            type: "rawlist",
                            choices: function(){
                                var choiceArr = [];
                                for(i=0; i< results.length; i++){
                                    choiceArr.push(results[i].name)
                                }
                                return choiceArr;
                            },
                            message: "Select Department"
                        }
                    ]).then(function(answer){
                        console.log(answer);
                        console.log(saveName);
                        connection.query("UPDATE employee SET ? WHERE last_name = ?",
                            [
                                {
                                    role_id: answer.role_id,
                                    manager_id: answer.manager
                                }, saveName  
                            ], 
                        ),
                        console.log("Employee updated");
                        viewAllEmployees();
                    });
                })      
            })      
        })
    })
}

