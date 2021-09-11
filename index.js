const inquirer = require('inquirer');
// const command = require('./lib/commands.js');
const db = require('./config/connection');
const cTable = require('console.table');
const { lookup } = require('dns');

//Menu prompt
const menuPrompt = 
{
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?.',
    choices: ['View all Employees', 'View All Employees by Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
}

async function getAllEmployees() {
    const sql = 'SELECT * FROM employees;'
    db.query(sql, (err, rows) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(rows)
        dashboard()
    });
}   

function getByDepartment() {
    const question = {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to look up?',
        choices: ['Sales', 'Engineering', 'Legal', 'Finance']
    }
    
    inquirer.prompt(question)
    .then(answer => {
        console.log((question.choices.indexOf(answer.department)+1))
        const sql = `SELECT * 
        FROM employees INNER JOIN roles 
        on employees.role_id = roles.id INNER JOIN departments
        on departments.id = roles.department_id  
        WHERE departments.id = ${(question.choices.indexOf(answer.department)+1)};`
        db.query(sql, (err, rows) => {
            if (err) {
                console.log({ error: err.message });
                return;
            }
            console.table(rows)
        });
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
            dashboard()
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
                dashboard();
            });
        })
    })
    
    // db.query("Select CONCAT(first_name,' ',last_name) as Name FROM employees", (err, rows) => {
    //     if (err) {
    //         console.log({ error: err.message });
    //         return;
    //     }
    //     rows.forEach(element => {
    //         names.push(element.name)
    //     });
    // })

    
}

function dashboard () {
    const menuDisplay = 
    `SELECT * FROM employees INNER JOIN roles 
    on employees.role_id = roles.id INNER JOIN departments
    on departments.id = roles.department_id `;
db.query(menuDisplay, (err, rows) => {
    console.table(rows)
    return beginPrompts()
})

}

// dashboard()
function beginPrompts() {
    inquirer.prompt(menuPrompt)
    .then(answer => {
        switch (menuPrompt.choices.indexOf(answer.menu)){
            case 0:  getAllEmployees(); break;
            case 1:  getByDepartment(); break;
            case 2:  addEmployee(); break;
            case 3:  addEmployee(); break;
            case 4:  remove(); break;
            case 5:  remove(); break;
            
        }
    })
}
beginPrompts()


// function getAll() {menuPrompt.choices.indexOf(an)}]

