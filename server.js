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
});

