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
                    console.log("View prompt here");
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