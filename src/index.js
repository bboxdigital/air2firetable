#!/usr/bin/env node

const inquirer = require('inquirer');
const { Command } = require("commander");
const { version } = require("../package.json");
const program = new Command();
program.version(version);

const firebase = require('firebase-admin');
const glob = require('glob');
const { readJsonSync } = require('fs-extra');
const serviceAccount = readJsonSync(glob.sync('*firebase-adminsdk*.json')[0]);
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const { getEnv } = require('./utils');
const { fetchSchema } = require('./fetch-schema');
const { fetchTables } = require('./fetch-tables');
const { importSchema } = require('./import-schema');
const { importTables } = require('./import-tables');

program
  .command("fetch-schema")
  .description("Fetch base schema from Airtable")
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Airtable login email:'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Airtable login password:'
      }
    ]);
    await fetchSchema(getEnv('BASE_ID'), answers.email, answers.password);
  });

program
  .command("fetch-tables")
  .description("Fetch schema tables from Airtable")
  .action(async () => {
    await fetchTables(getEnv('BASE_ID'), getEnv('AIRTABLE_KEY'));
  });

program
  .command("import-schema")
  .description("Import schema into Firetable")
  .action(async () => {
    await importSchema(getEnv('BASE_ID'), firebase.firestore());
  });

program
  .command("import-tables")
  .description("Import tables into Firetable")
  .action(async () => {
    await importTables(getEnv('BASE_ID'), firebase.firestore());
  });

program.parse(process.argv);