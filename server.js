const inquirer = require('inquirer');
const db = require('./db/connection');

// TODO: Create an array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the name of your project? (Required)',
        validate: titleInput => {
            if (titleInput) {
            return true;
            } else {
                console.log('Please enter in a title!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Provide a description of the project (Required)',
        validate: descriptionInput => {
            if (descriptionInput) {
            return true;
            } else {
                console.log('Please enter in a project description!');
                return false;
          }
        }
    },
    {
        type: 'confirm',
        name: 'confirmInput',
        message: 'Would you like to include a installation section?',
        default: true
    },
    {
        type: 'input',
        name: 'installation',
        message: 'Please share the installation instructions.',
        when: ({ confirmInput }) => confirmInput
    },
    {
        type: 'confirm',
        name: 'confirmUsage',
        message: 'Would you like to include a usage section?',
        default: true
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Please share the usage information.',
        when: ({ confirmUsage }) => confirmUsage
    },    
    {
        type: 'checkbox',
        name: 'badges',
        message: 'Please select what was used to create this project. (Check all that apply)',
        choices: ['JavaScript', 'HTML', 'CSS', 'jQuery', 'Bootstrap', 'Node']
    },    {
        type: 'list',
        name: 'license',
        message: 'Please select what type of license your project requires.',
        choices: ['I need to work in a community', 'I want it simple and permissive.', 'I care about sharing improvements.']
    },
    {
        type: 'confirm',
        name: 'confirmContribution',
        message: 'Would you like to include a contribution section?',
        default: true
    },
    {
        type: 'input',
        name: 'contribution',
        message: 'Please share any contributions.',
        when: ({ confirmContribution }) => confirmContribution
    },
    {
        type: 'confirm',
        name: 'confirmTesting',
        message: 'Would you like to include a testing section?',
        default: true
    },
    {
        type: 'input',
        name: 'testing',
        message: 'Please share any testing instructions.',
        when: ({ confirmTesting }) => confirmTesting
    }
];


inquirer.prompt(questions)
.then(answers => {answers})

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });