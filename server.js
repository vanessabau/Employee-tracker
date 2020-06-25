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

function viewAll(){
    connection.query("SELECT * FROM employee", function(err, results){
        if(err) throw err;
        console.table(results);
    });
}

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
            console.log(res.start);
            switch(res.start){
                case "View":
                    view();
                    break;
                case "Add":
                    console.log("Add prompt here");
                    break;
                case "Update":
                    console.log("Update employee function here");
                break;
                case "Exit":
                    console.log("All done");
                    break;
                default:
                    console.log("default");
            }
        });
}

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
                default:
                    console.log("default");
            }
        });
}

function viewAllEmployees(){
    connection.query("SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id", function(err, results){
        if(err) throw err;
        console.table(results);
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
                        var choiceArr = [];
                        for(i=0; i< results.length; i++){
                            choiceArr.push(results[i].name);
                        }
                        return choiceArr;
                    },
                    message: "Select department"
                }
            ]).then(function(answer){
                console.log(answer.choice);
                connection.query(
                    "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE d.name =?", [answer.choice], function(err, results){
                        if(err) throw err;
                        console.table(results);
                    }
                )
            });
    });

}
