const mysql = require('mysql');
const inquirer = require('inquirer');

let depArray = [];
let roleArray = [];
let deleteArray = [];


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
      " ViewAllRoles",
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

      } else if (answer.options == "ViewAllDepartments") {
        ViewAllDepartments();
      } else if (answer.options == " ViewAllRoles") {

        ViewAllRoles();

      } else if (answer.options === "ViewAllEmployeesByRoles") {
        ViewAllEmployeesByRoles();

      } else if (answer.options == "ViewAllEmployeesByDepartment") {
        ViewAllEmployeesByDepartment();


      } else if (answer.options == "addDepartment") {
        addDepartment();


      } else if (answer.options == "addRole") {
        addRole();
      } else if (answer.options == "addEmployee") {
        addEmployee();
      } else if (answer.options == "updateEmployee") {
        updateEmployee();
      } else if (answer.options == "deleteEmployee") {
        deleteEmployee();

      } else if (answer.options == "exit") {

        connection.end();
      }

    })
}


// To view all employees

const ViewAllEmployees = () => {
  console.log("hello");
  connection.query(`SELECT * FROM employee 
                    INNER JOIN role ON role.role_id=employee.role_id
                    INNER JOIN department ON department.department_id=role.department_id`, (err, res) => {

    if (err) throw err;
    console.log("\n");
    console.table(res);
    startapp();
  })
};

// to view departments

const ViewAllDepartments = () => {
  connection.query("Select * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    startapp();
  })
  //startapp();
};



// to add employees by department

function ViewAllEmployeesByDepartment() {
  //   // console.log(" i am in ViewEmployeesByDepartments");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      depArray.push(res[i].name);
    }
    inquirer.prompt({
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

// // to view employees by roles

function ViewAllEmployeesByRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
    // console.log(" i am in ViewEmployeesByRoles");
    inquirer.prompt({
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
  inquirer.prompt([{
    name: "department",
    type: "input",
    message: "What department would you like to add"
  }]).then(function (answer) {
    connection.query(`INSERT INTO department(name)  VALUES('${answer.department}')`, (err, res) => {
      if (err) throw err;
      console.log("ONE NEW DEPARTMENT ADDED:" + answer.department);


      ViewAllDepartments();
    })
  })



};

const ViewAllRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    startapp();
  })
  //startapp();
};








function updateEmployee() {
  let roleResults = [], employeeResults = []; // Initialize as empty arrays for now.


 

  // Query Employees
  connection.query(`SELECT * FROM employee`, function (err, res) {
    if (err) throw err;
    employeeResults = [...res]; // Assign query results to employeeResults array

    // Query Roles
    connection.query(`SELECT * FROM role`, function (err, res) {
      if (err) throw err;
      roleResults = [...res]; // Assign query results to roleResults array

      // Now we can prompt user with employees info and roles info.
      inquirer.prompt([
        {
          name: "employee_full_name",
          type: "rawlist",
          message: "What employee would you like to update?",
          choices: employeeResults.map(employee => `${employee.first_name} ${employee.last_name}`) // Use map to only show name of employee
        },
        {
          name: "role_title",
          type: "rawlist",
          message: "What is the employee's new role?",
          choices: roleResults.map(role => role.title) // Use map to only show role title
        }
      ]).then(function (answer) {

        
        let { employee_id } = employeeResults.find(employee => `${employee.first_name} ${employee.last_name}` === answer.employee_full_name);

        let { role_id } = roleResults.find(role => role.title === answer.role_title);

        
        connection.query(`UPDATE employee SET role_id = ${role_id} WHERE employee_id=${employee_id}`, function (err, res) {
          if (err) throw err;
          console.log("Update Successful\n\n\n");
          ViewAllEmployees();
        });
      });
    });

  });

}

// only to view employess for delete function
function viewEmp(){
  console.log("hello");
  connection.query(`SELECT * FROM employee 
                    INNER JOIN role ON role.role_id=employee.role_id
                    INNER JOIN department ON department.department_id=role.department_id`, (err, res) => {

    if (err) throw err;
    console.log("\n");
    console.table(res);

})
}







// to add a role

function addRole() {

  let optionsArray = [];
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      optionsArray.push(res[i].name);
    }

    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title for this role",

      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role",

      },
      {
        name: "department_name",
        type: "list",
        message: "What is the departmentname for this role",
        choices: optionsArray

      },

    ]).then(function (answer) {
      let department_id;

      // res contains the deparment rows. We have to search for the row that has the department name that the user selected.
      // Once we find that department name, then we use its department_id
      for (let i = 0; i < res.length; i++) {
        if (res[i].name === answer.department_name) {
          department_id = res[i].department_id;  
          break;
        }
      }

      if (department_id) {
        connection.query(`INSERT INTO role (title ,salary , department_id) VALUES ('${answer.title}' , ${answer.salary}, ${department_id})`, (err, res) => {
          if (err) throw err;
          console.log("One role added" + res);
          ViewAllRoles();

        });
      }
    });
  })
}


function addEmployee() {


  let optionsArray = [];
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      optionsArray.push(res[i].title);
    }

    inquirer.prompt([
      {
        name: "f_name",
        type: "input",
        message: "What is employee first_name",

      },
      {
        name: "l_name",
        type: "input",
        message: "What is employee last_name",

      },
      {
        name: "role",
        type: "list",
        message: "What is the title for this role",
        choices: optionsArray

      },

    ]).then(function (answer) {
      let role_id;

      for (let i = 0; i < res.length; i++) {
        if (res[i].title === answer.role) {
          role_id = res[i].role_id;  
          break;
        }
      }

      if (role_id) {
        connection.query(`INSERT INTO employee (first_name ,last_name , role_id) VALUES ('${answer.f_name}' , '${answer.l_name}', ${role_id})`, (err, res) => {
          if (err) throw err;
          console.log("One employee added" + res);
          ViewAllEmployees();

        });
      }
    });
  })
}



// delete a department
function deleteEmployee() {
  console.log(" i am in delete Employee");
 viewEmp();
 connection.query("SELECT * FROM employee", function (err, res) {
   if (err) throw err;
   for (var i = 0; i < res.length; i++) {
     deleteArray.push(res[i].employee_id);
   }
   inquirer.prompt({
     
     name: "deleteEmployee",
     type: "input",
     message: "Enter the id of the employee you want to delete?",
   }).then(function (answer) {
     connection.query(`DELETE FROM employee WHERE employee_id="${answer.deleteEmployee}"`, function (err, res) {
       if (err) throw err;
       console.log("\n");
       ViewAllEmployees();
     });
   })
 })
}