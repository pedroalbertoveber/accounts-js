/* external modules */
const inquirer = require("inquirer");
const chalk = require("chalk");

/* internal modules */
const fs = require("fs");

const operation = () => {

  /* desta forma, o usuário terá uma espécie de "option", não será mais o input tradicional que vimos anteriormente */

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'O que você deseja fazer?',
      choices: [
        'Criar Conta',
        'Consultar Saldo',
        'Depositar',
        'Sacar',
        'Sair',
      ],
    }
  ]).then(answer => {
    const action = answer['action'];

    if (action === "Criar Conta") {
      createAccount();
    }
  }).catch(err => console.log(err));
};

operation();

/* create an account */
const createAccount = () => {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções de sua conta a seguir"));

  buildAccount();
};

const buildAccount = () => {
  inquirer.prompt([
    {
      name: "accountName",
      message: "Digite um nome para a sua conta:"
    },
  ]).then(answer => {
    const accountName = answer["accountName"];
    console.info(accountName);

    if(!fs.existsSync("accounts")) {
      fs.mkdirSync("accounts");
    }

    if(fs.existsSync(`accounts/${accountName}.json`)) {
      console.log(chalk.bgRed.black("Esta conta já existe, escolha outro nome!"));
      buildAccount();
      return;
    }

    fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', (err) => {
      console.log(err);
    });

    console.log(chalk.green("Parabéns, sua conta foi criada!"));
    operation();

  }).catch(err => console.log(err));
};