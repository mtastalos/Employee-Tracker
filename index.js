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
    choices: ['View all Employees', 'View All Employees by Department', 'View All Employees By Role', 'Add Employee', 'Remove Employee', 'Add a Role', 'Add a Department',  'Update Employee Role']
}
function dashboard () {
    const menuDisplay = 
    `SELECT employees.id, CONCAT(first_name,' ',last_name) as full_name, roles.id as role_id, roles.title, roles.salary,
    departments.id as dept_id ,departments.dep_name
    FROM employees INNER JOIN roles 
    on employees.role_id = roles.id INNER JOIN departments
    on departments.id = roles.department_id 
    ORDER BY employees.id `;
    db.query(menuDisplay, (err, rows) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.log('\n')
        console.table(rows)
        return beginPrompts()
    })
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
        }
    ]
    inquirer.prompt(question)
    .then(answer => {
        let roles = []
        let selectedRole, arrayHolder
        db.promise().query("Select title, id FROM roles").then(([rows,fields]) => {
            rows.forEach(element => {
                arrayHolder = rows;
                roles.push(element.title);
            });
        })
        .then(function(){
            const roleQuestion = {
                type: 'list',
                name: 'roleSelected',
                message: 'Select the role for the employee:',
                choices: roles
            }
            inquirer.prompt(roleQuestion)
            .then(nextAnswer => {
                selectedRole = arrayHolder[(roleQuestion.choices.indexOf(nextAnswer.roleSelected))].id;
                db.promise().query("Select title, id FROM roles").then(([rows,fields]) => {
                    rows.forEach(element => {
                        roles.push(element.dep_name);
                    });
                })
                .then(function(){
                    console.log(selectedRole)
                    const sql = 
                        `INSERT INTO employees 
                        (first_name, last_name, role_id)
                        VALUES ('${answer.firstName}', '${answer.lastName}', ${selectedRole});`
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log({ error: err.message });
                            return;
                        }
                        if(rows){
                            dashboard();
                        }
                    })
                })   
            })
        })   
    })
}   

function removeEmployee() {
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
            message: 'Which employee would you like to remove?',
            choices: names
        }
        inquirer.prompt(question)
        .then(answer => {
            let selected = question.choices.indexOf(answer.remove)
            const sql = `DELETE FROM employees WHERE id = ${employeeArray[selected].id};`
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

function addRole() {
    const question = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new role?'
        },
        {
            type: 'input',
            name: 'pay',
            message: 'How much is their salary?'
        }
    ]
    inquirer.prompt(question)
    .then(answer => {
        let departments = []
        let selected, arrayHolder
        db.promise().query("Select dep_name, id FROM departments").then(([rows,fields]) => {
            rows.forEach(element => {
                arrayHolder = rows;
                departments.push(element.dep_name);
            });
        })
        .then(function(){
            const deptQuestion = {
                type: 'list',
                name: 'deptSelected',
                message: 'Select the department for the new role:',
                choices: departments
            }
            inquirer.prompt(deptQuestion)
            .then(nextAnswer => {
                selected = arrayHolder[(deptQuestion.choices.indexOf(nextAnswer.deptSelected))].id;
                const sql = 
                    `INSERT INTO roles 
                    (title, salary, department_id)
                    VALUES ('${answer.name}', '${answer.pay}', ${selected});`
                db.query(sql, (err, rows) => {
                    if (err) {
                        console.log({ error: err.message });
                        return;
                    }
                    if(rows){
                        db.query(`SELECT * FROM roles WHERE department_id = ${selected}`, (err, rows) => {
                            if (err) {
                                console.log({ error: err.message });
                                return;
                            }
                            console.log('\n')
                            console.table(rows)
                            return beginPrompts()
                        })
                    }
                }) 
            })
        })   
    })
}   

function addDepartment() {
    const question = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?'
        }
    ]
    inquirer.prompt(question)
    .then(answer => {
        db.promise().query(`INSERT INTO departments (dep_name) VALUES ('${answer.name}')`).then(([rows,fields]) => {
        })
        .then(()=>{
            db.query('SELECT * FROM departments', (err, result) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(result);
                beginPrompts()
            })
        })
    })
}   

function updateEmployee() {
    let names = []
    let employeeArray
    db.promise().query("Select CONCAT(first_name,' ',last_name) as Name, first_name, last_name, role_id, id FROM employees").then(([rows,fields]) => {
        employeeArray = rows
        rows.forEach(element => {
            names.push(element.Name);
        });
    })
    .then(function(){
        const question = {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: names
        }
        inquirer.prompt(question)
        .then(answer => {
            let selected = employeeArray[question.choices.indexOf(answer.employee)].id
            employeeArray = employeeArray[question.choices.indexOf(answer.employee)]
            const sql = `
                SELECT employees.id, CONCAT(first_name,' ',last_name) as full_name, roles.id as role_id, roles.title, roles.salary, departments.id as dept_id ,departments.dep_name
                FROM employees INNER JOIN roles 
                on employees.role_id = roles.id INNER JOIN departments
                on departments.id = roles.department_id 
                WHERE employees.id = ${selected};`
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(rows)
                const selection = {
                    type: 'list',
                    name: 'pick',
                    message: 'What would you like to update:',
                    choices: ['First name', 'Last name', 'Role id']
                }
                inquirer.prompt(selection)
                .then(answer => {
                    let selectedUpdate = selection.choices.indexOf(answer.pick);
                    switch (selectedUpdate) {
                        case 0:  inquirer.prompt(
                            {
                            type: 'input',
                            name: 'case',
                            message: 'Enter in new first name:'
                            })
                            .then(answer => {
                                db.query(`UPDATE employees SET first_name = '${answer.case}' WHERE id = ${selected}`, (err, rows) => {
                                    if (err) {
                                        console.log({ error: err.message });
                                        return;
                                    }
                                    dashboard()
                                })
                            })
                        break;
                        case 1:  inquirer.prompt(
                            {
                            type: 'input',
                            name: 'case',
                            message: 'Enter in new last name:'
                            })
                            .then(answer => {
                                db.query(`UPDATE employees SET last_name = '${answer.case}' WHERE id = ${selected}`, (err, rows) => {
                                    if (err) {
                                        console.log({ error: err.message });
                                        return;
                                    }
                                    dashboard()
                                })
                            })
                        break;
                        case 2:  
                            let options = []
                            let rolesArray
                            db.promise().query("Select title, id FROM roles").then(([rows,fields]) => {
                                rows.forEach(element => {
                                    options.push(element.title);
                                });
                                rolesArray = rows;
                            }).
                            then(()=> {
                                const option =
                                {
                                type: 'list',
                                name: 'case',
                                message: 'Which role would you like to change it too?',
                                choices: options
                                }
                                inquirer.prompt(option)
                                .then(nextquestion => {
                                    let decision = rolesArray[option.choices.indexOf(nextquestion.case)].id
                                    db.query(`UPDATE employees SET role_id = '${decision}' WHERE id = ${employeeArray.id}`, (err, rows) => {
                                        if (err) {
                                            console.log({ error: err.message });
                                            return;
                                        }
                                        dashboard()
                                    })
                                })
                            })
                            
                        break;
                    }
                    
                })
            });
        })
    })   
}


function beginPrompts() {
    inquirer.prompt(menuPrompt)
    .then(answer => {
        console.log(menuPrompt.choices.indexOf(answer.menu))
        switch (menuPrompt.choices.indexOf(answer.menu)){
            case 0:  dashboard(); break;
            case 1:  getByDepartment(); break;
            case 2:  getByRoles(); break;
            case 3:  addEmployee(); break;
            case 4:  removeEmployee(); break;
            case 5:  addRole(); break;
            case 6:  addDepartment(); break;
            case 7:  updateEmployee(); break;
        }
    })
}
beginPrompts()



