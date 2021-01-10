const mysql = require('mysql');
const inquirer = require('inquirer');

let depArray=[];
let roleArray=[];
let deleteArray=[];


var connection = mysql.createConnection({
    host: "localhost",


    port: 3306,


    //username
    user: "root",

    //pasword
    password: "password",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    startapp();
    //connection.end();
});


function startapp() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "What options would you like to choose?",
        choices: [

            "ViewAllEmployees",
            "ViewAllDepartments",
            "ViewAllEmployeesByRoles",
            "ViewAllEmployeesByDepartment",
            "addDepartment",
            "addEmployee",
            "addRole",
            "updateEmployee",
            "deleteEmployee",
                    "exit"

        ]
    })


        .then(function (answer) {
            if (answer.options === "ViewAllEmployees") {

                ViewAllEmployees();

            }else if(answer.options=="ViewAllDepartments"){
                ViewAllDepartments();
            }
             else if (answer.options === "ViewAllEmployeesByRoles") {
                ViewAllEmployeesByRoles();

            }
            else if (answer.options == "ViewAllEmployeesByDepartment") {
                ViewAllEmployeesByDepartment();


            } else if (answer.options == "addDepartment") {
                addDepartment();


            }else if(answer.options=="addRole") {
                addRole();
            }
            else if (answer.options == "updateEmployee") {

                // call function  updateEmployee();
            } else if (answer.options == "deleteEmployee") {
                 deleteEmployee();

            } 
            else if (answer.options == "exit") {

                connection.end();
            }

        })
}


// To view all employees

const ViewAllEmployees = () => {
    console.log("hello");
    connection.query("SELECT * FROM employee", (err, res) => {

        if (err) throw err;
        console.log("\n");
        console.table(res);
    })
    startapp();
};

// to view departments

const  ViewAllDepartments = () => {
    connection.query("Select * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    startapp();
};



// to add employees by department

function ViewAllEmployeesByDepartment() {
    // console.log(" i am in ViewEmployeesByDepartments");
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        depArray.push(res[i].name);
      }
      inquirer.prompt(
        {
          name: "departments",
          type: "list",
          message: "Which department of Employee's you want to list?",
          choices: depArray
        }).then(function (answer) {
          connection.query(`SELECT employee_id,first_name,last_name,department.name FROM employee
        INNER JOIN role ON role.role_id=employee.role_id
        INNER JOIN department ON department.department_id=role.department_id
        WHERE department.name="${answer.departments}"
        ORDER BY (employee_id);`, function (err, res) {
            if (err) throw err;
            console.log("\n");
            console.table(res);
            startapp();
          });
        })
    })
  }

       // to view employees by roles

  function ViewAllEmployeesByRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        roleArray.push(res[i].title);
      }
      // console.log(" i am in ViewEmployeesByRoles");
      inquirer.prompt(
        {
          name: "roles",
          type: "list",
          message: "Which role of Employee's you want to list?",
          choices: roleArray
        }).then(function (answer) {
          connection.query(`SELECT employee_id,first_name,last_name,role.title,role.salary FROM employee
      INNER JOIN role ON role.role_id= employee.role_id
      WHERE role.title= "${answer.roles}"
      ORDER BY (employee_id)`, function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log("\n");
            console.table(res);
            startapp();
          });
        })
    })
  }


// to add department
const addDepartment = () => {
    console.log("checking functionality");
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What department would you like to add"
        }
    ]).then(function (answer) {
        connection.query(`INSERT INTO department(name)  VALUES('${answer.department}')`, (err, res) => {
            if (err) throw err;
            console.log("ONE NEW DEPARTMENT ADDED:" + answer.department);

            
            ViewAllDepartments();
             })
        })
    
    

};



// // to add a role

// connection.query("SELECT * FROM department", function(err,res){
//     if (err) throw err;
//     inquirer.prompt([
//     {
//       name:"title",
//       type:"input",
//       message:"What kind of role would you like to add",
//      },
//      {
//          name:"salary",
//          type:"input",
//          message:"What is the salary for this role",
//      },
//      {
//          name:"department_name",
//          type:"list",
//          message:"Entered role comes under which department",
//          choices: function(){
//              var options_array=[];
//              res.forEach(res=>{
//                  options_array.push(
//                      res.name
//                  );
//              })
//              return options_array;
//              }
//          }
//      }].then(function(answer){
//          connection.query("SELECT * FROM department", function(err,res){
//              if (err) throw(err);
//              let newdept= res.filter(function(res){
//                  return res.name=answer.department_name;
//              })
//              let newid=newdept[0].id;
//              connection.query(`INSERT INTO role(title,salary,department_id) VALUES ('${answer.title}', ${answer.salary}, 
             
//          }
//      }


//     ])
// }


// delete a department
function deleteEmployee(); {
    // console.log(" i am in delete Employee");
    ViewEmployees();
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        deleteArray.push(res[i].employee_id);
      }
      inquirer.prompt(
        {
          name: "deleteEmployee",
          type: "input",
          message: "Enter the id of the employee you want to delete?",
        }).then(function (answer) {
          connection.query(`DELETE FROM employee WHERE employee_id="${answer.deleteEmployee}"`
            , function (err, res) {
              if (err) throw err;
              console.log("\n");
              ViewEmployees();
            });
        })
    })
  }



  // to update an employee   (that's what we did in class yesterday)



  //function updateEmployee() {
    //     let roleTable = [
    //         {
    //             id: 1,
    //             title: "TEACHING-ASSISTANT"
    //         },
    //         {
    //             id: 2,
    //             title: "TINSTRUCTOR"
    //         }
    
    //     ]
    
    //     inquirer.prompt([
    //         {
    //             name: "role",
    //             type: "rawlist",
    //             message: "What role you like to update?",
    //             choices: roleTable.map(role=>role.title)
                
 // ]
//})
    
           