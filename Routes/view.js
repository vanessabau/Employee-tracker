const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table"); 


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
            }
        })
}

//ROUTES
