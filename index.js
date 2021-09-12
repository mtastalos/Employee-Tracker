const inquirer = require('inquirer');
// const command = require('./lib/commands.js');
const db = require('./config/connection');
const cTable = require('console.table');

//Menu prompt
const menuPrompt = 
{
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?.',
    choices: ['View all Employees', 'View All Employees by Department', 'View All Employees By Role', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
}

function getByRoles() {
    let roles = []
    db.promise().query("Select title, id FROM roles").then(([rows,fields]) => {
        rows.forEach(element => {
            roles.push(element.title);
        });
    })
    .then(function(){
        const question = {
            type: 'list',
            name: 'roleSelected',
            message: 'Which role would you like to look up?',
            choices: roles
        }
        inquirer.prompt(question)
        .then(answer => {
            let selected = (question.choices.indexOf(answer.roleSelected)+1)
            const sql = `
                SELECT employees.id, CONCAT(first_name,' ',last_name) as full_name, roles.title, roles.salary, departments.dep_name
                FROM employees INNER JOIN roles 
                on employees.role_id = roles.id INNER JOIN departments
                on departments.id = roles.department_id 
                WHERE roles.id = ${selected}
                ORDER BY employees.id; `;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(rows);
                return beginPrompts();
            });
        })
    })   
}   

function getByDepartment() {
    let departments = []
    db.promise().query("Select dep_name, id FROM departments").then(([rows,fields]) => {
        rows.forEach(element => {
            departments.push(element.dep_name);
        });
    })
    .then(function(){
        const question = {
            type: 'list',
            name: 'deptSelected',
            message: 'Which department would you like to look up?',
            choices: departments
        }
        inquirer.prompt(question)
        .then(answer => {
            let selected = (question.choices.indexOf(answer.deptSelected)+1)
            const sql = `
                SELECT employees.id, CONCAT(first_name,' ',last_name) as full_name, roles.title, roles.salary, departments.dep_name
                FROM employees INNER JOIN roles 
                on employees.role_id = roles.id INNER JOIN departments
                on departments.id = roles.department_id 
                WHERE departments.id = ${selected}
                ORDER BY employees.id; `;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(rows);
                return beginPrompts();
            });
        })
    })   
}   

// function getByManager() {
//     const question = {
//         type: 'list',
//         name: 'manager',
//         message: 'Which management group would you like to look up?',
//         choices: ['Sales', 'Engineering', 'Legal', 'Finance']
//     }
    
//     inquirer.prompt(question)
//     .then(answer => {
//         console.log((question.choices.indexOf(answer.department)+1))
//         const sql = `SELECT * 
//         FROM employees INNER JOIN roles 
//         on employees.role_id = roles.id INNER JOIN departments
//         on departments.id = roles.department_id  
//         WHERE departments.id = ${(question.choices.indexOf(answer.department)+1)};`
//         db.query(sql, (err, rows) => {
//             if (err) {
//                 console.log({ error: err.message });
//                 return;
//             }
//             console.log(rows)
//         });
//     })
    
// }

function addEmployee() {
    const question = [
        {
            type: 'input',
            name: 'firstName',
            message: 'Please spell first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please spell last name?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Please select role?',
            choices: ['Sales', 'Engineering', 'Legal', 'Finance']
        }
    ]
    
    inquirer.prompt(question)
    .then(answer => {
        console.log(answer)
        const sql = 
        `INSERT INTO employees 
        (first_name, last_name, role_id)
        VALUES 
        ('${answer.firstName}', '${answer.lastName}', ${(question[2].choices.indexOf(answer.role)+1)});`

        db.query(sql, (err, rows) => {
            if (err) {
                console.log({ error: err.message });
                return;
            }
            dashboard();
            return beginPrompts();
        });
    })
}   

function remove() {
    let names = []
    let employeeArray
    db.promise().query("Select CONCAT(first_name,' ',last_name) as Name, id FROM employees").then(([rows,fields]) => {
        employeeArray = rows
        rows.forEach(element => {
            names.push(element.Name);
        });
    })
    .then(function(){
        const question = {
            type: 'list',
            name: 'remove',
            message: 'Which department would you like to look up?',
            choices: names
        }
        inquirer.prompt(question)
        .then(answer => {
            let selected = question.choices.indexOf(answer.remove)
            // console.log(employeeArray[selected].id)
            const sql = `DELETE FROM employees
            WHERE id = ${employeeArray[selected].id};`
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                return beginPrompts()
            });
        })
    })   
}

function dashboard () {
    const menuDisplay = 
    `SELECT employees.id, CONCAT(first_name,' ',last_name) as full_name, roles.title, roles.salary, departments.dep_name
    FROM employees INNER JOIN roles 
    on employees.role_id = roles.id INNER JOIN departments
    on departments.id = roles.department_id 
    ORDER BY employees.id `;
    db.query(menuDisplay, (err, rows) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(rows)
        return beginPrompts()
    })

}

function beginPrompts() {
    inquirer.prompt(menuPrompt)
    .then(answer => {
        switch (menuPrompt.choices.indexOf(answer.menu)){
            case 0:  dashboard(); break;
            case 1:  getByDepartment(); break;
            case 2:  getByRoles(); break;
            case 3:  addEmployee(); break;
            case 4:  remove(); break;
            case 5:  remove(); break;
        }
    })
}
beginPrompts()


// function getAll() {menuPrompt.choices.indexOf(an)}]

