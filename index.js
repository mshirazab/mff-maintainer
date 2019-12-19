const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
const menuOptions = ["Add new charecter"];
const menuQuestion = [
  {
    type: "list",
    name: "menu",
    message: "What do you want to do",
    choices: menuOptions,
    filter: val => menuOptions.findIndex(elem => elem === val)
  }
];
inquirer.prompt(menuQuestion).then(choice => {
  if (choice.menu === 0) {
    const { questions, resolveAnswers } = require("./addUniformQuestions");
    inquirer.prompt(questions).then(resolveAnswers);
  }
});
