/* external modules */
const inquirer = require("inquirer");
const chalk = require("chalk");

/* internal modules */
const fs = require("fs");

const operation = () => {

  /* this way, the costumer will recieve some options, it's not like a standard input as we used before */

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
      return;
    }

    if(action === "Depositar") {
      deposit();
      return;
    }

    if(action === "Consultar Saldo") {
      getAccountBalance();
      return;
    }

    if(action === "Sacar") {
      withdraw();
      return;
    }

    if(action === "Sair") {
      console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
      process.exit();
    }

  }).catch(err => console.log(err));
};

/* initializing system */
operation();


/* suporters functions */

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

const checkAccount = ( accountName ) => {
  if(!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Esta conta não existe. Tente novamente"));
    return false;
  }

  return true;
};

const addAmount = ( accountName, amount ) => {
  const accountData = getAccount(accountName);

  if(!amount) {
    console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!"));
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
  fs.writeFileSync(
    `accounts/${accountName}.json`, 
    JSON.stringify(accountData),
    (err => {
      console.log(err)
    })
  );

  console.log(chalk.green(`Foi depositado o valor de R$ ${amount},00 na sua conta!`));
};

const getAccount = ( accountName ) => {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
};

const removeAmount = ( accountName, amount ) => {

  const accountData = getAccount(accountName);

  if(!amount) {
    console.log(chalk.bgRed.black("Ocorreu um erro! Tente novamente mais tarde..."));
    return withdraw();
  }

  if (accountData.balance < amount ) {
    console.log(chalk.bgRed.black("Valor indisponível"))
    return withdraw();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);
  fs.writeFileSync(
   `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err => console.log(err)),    
  );

  console.log(chalk.green(`Foi realizado um saque de R$ ${amount},00 da sua conta.`));
  operation();
};

/* main functions */

/* create an account */
const createAccount = () => {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções de sua conta a seguir"));

  buildAccount();
};

/* add an amount to user account */
const deposit = () => {
  inquirer.prompt([
    {
      name: "accountName",
      message: "Qual o nome da sua conta?",
    }
  ]).then(answer => {
    const accountName = answer["accountName"];

    /* verify if account exists */
    if(!checkAccount(accountName)) {
      return deposit();
    }

    inquirer.prompt([
      {
        name: "amount",
        message: "Quanto você deseja depositar?"
      }
    ]).then(answer => {
      const amount = answer["amount"];

      /* add an amount */
      addAmount(accountName, amount);
      operation();

    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

/* show account balance */
const getAccountBalance = () => {
  inquirer.prompt([
    {
      name: "accountName",
      message: "Digite o nome da sua conta:",
    }
  ]).then(answer => {
    const accountName = answer["accountName"];

    /* verify if account exists */
    if(!checkAccount(accountName)) {
      return getAccountBalance();
    }

    const accountData = getAccount(accountName);
    console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é R$ ${accountData.balance},00`));
    operation();

  }).catch(err => console.log(err));
};

/* withdraw an amount from user account */
const withdraw = () => {
  inquirer.prompt([
    {
      name: "accountName",
      message: "Qual o nome da sua conta?"
    }
  ]).then(answer => {
    const accountName = answer["accountName"];

    /* verify if account exists */
    if(!checkAccount(accountName)) {
      return withdraw();
    }

    inquirer.prompt([
      {
        name: "amount",
        message: "Quanto você deseja sacar?",
      },
    ]).then(answer => {
      const amount = answer["amount"];

      removeAmount(accountName, amount);
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};