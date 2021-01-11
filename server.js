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
      "updateEmployeeByRole",
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
      } else if (answer.options == "updateEmployeeByRole") {
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
  })
  startapp();
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
  })
  startapp();
};








function updateEmployee() {
  let roleResults = [], employeeResults = []; // Initialize as empty arrays for now.


  /* Nehreet, this is what I was saying in class. You can hardcode the results that come from MySQL server. But later we will need
     to do 2 things. Query and get the results of all the 1)ROLES and 2)EMPLOYEES.
     
     Why do we need to do this?

     Well its because we need:
     1) The user to select the desired employee. Hence this is why we query all employees and present them the list of employees to choose
    
     2) The user to select new role for desired employee. We need to prompt the user with this as well.
        Note: The new role is what we will use to update employee.
  */

  // Hard Coded Results from MySQL Server
  // roleResults = [{
  //     role_id: 1,
  //     title: "TEACHING-ASSISTANT"
  //   },
  //   {
  //     role_id: 2,
  //     title: "TINSTRUCTOR"
  //   }
  // ];

  // employeeResults = [
  //   {
  //     employee_id: 1,
  //     first_name: "TONY",
  //     last_name: "STARK",
  //     role_id: 2
  //   },
  //   {
  //     employee_id: 2,
  //     first_name: "JOHN",
  //     last_name: "DOE",
  //     role_id: 1
  //   }
  // ];

  // The following hardcoded code above is now replaced with the ROLES and EMPLOYEE queries ^^^^.

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

        /* 
          At this point user has told us 2 things:

          1) Desired employee
          2) New role of employee

          There is a slight problem we need to update the employee table, but that table requires role_id and employee_id.

          So we need to write some logic to retrieve the IDs.

          In the prompt above we only displayed role name and employee name. We did this so the user doesn't have to see or worry about IDs. Its more human readable to show them the role name and employee name instead.

          The following logic gets employee_id and role_id:
          */
        let { employee_id } = employeeResults.find(employee => `${employee.first_name} ${employee.last_name}` === answer.employee_full_name);

        let { role_id } = roleResults.find(role => role.title === answer.role_title);

        // ^^^ What is {employee_id} and {role_id}?
        // Its called destructuring object. We can do this to simplify the code by only getting the 1 property we need from object.
        // More details: 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring


        // At this point we have the role_id and employee_id to filter on employee table. Now wee can update.

        /*
          Recall in class Nehreet you and I wrote this query in Workbench. We can now use the exact same query in our code.

          UPDATE employee
          SET role_id = 3
          WHERE employee_id=1;
        */
        connection.query(`UPDATE employee SET role_id = ${role_id} WHERE employee_id=${employee_id}`, function (err, res) {
          if (err) throw err;
          console.log("Update Successful\n\n\n");
          ViewAllEmployees();
        });
      });
    });

  });

}



// delete a department
function deleteEmployee() {
  // console.log(" i am in delete Employee");
  ViewAllEmployees();
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
        name: "department_id",
        type: "list",
        message: "What is the departmentname for this role",
        choices: optionsArray

      },

    ]).then(function (answer) {
      for (i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].name === answer.department_id) {
          department_id = optionsArray[i].id;                              // after running inquirer on last option throwing me an error.
        }
      }
      connection.query(`INSERT INTO role (title ,salary , department_id) VALUES ('${answer.title}' , ${answer.salary}, ${department_id})`, (err, res) => {
        if (err) throw err;
        console.log("One role added" + res);
        ViewAllRoles();

      });
    });
  })
}