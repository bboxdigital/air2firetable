#!/usr/bin/env node

const inquirer = require('inquirer');
const { Command } = require('commander');
const { version } = require('../package.json');
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
const { processSchema } = require('./process-schema');
const { importSchema } = require('./import-schema');
const { importTables } = require('./import-tables');

const runFetchSchema = async () => {
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
};

program
  .command('fetch-schema')
  .description('Fetch base schema from Airtable')
  .action(runFetchSchema);

const runFetchTables = async () => {
  await fetchTables(getEnv('BASE_ID'), getEnv('AIRTABLE_KEY'));
};

program
  .command('fetch-tables')
  .description('Fetch schema tables from Airtable')
  .action(runFetchTables);

const runProcessSchema = async () => {
  await processSchema(getEnv('BASE_ID'));
};

program
  .command('process-schema')
  .description('Process schema for Firetable')
  .action(runProcessSchema);

const runImportSchema = async () => {
  await importSchema(getEnv('BASE_ID'), firebase.firestore());
};

program
  .command('import-schema')
  .description('Import schema into Firetable')
  .action(runImportSchema);

const runImportTables = async () => {
  await importTables(getEnv('BASE_ID'), firebase.firestore());
};

program
  .command('import-tables')
  .description('Import tables into Firetable')
  .action(runImportTables);

const confirmRun = async (fn, name) => {
  const answers = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message: `Run ${name}?`,
    default: true
  }]);
  return answers.confirmed && await fn();
}

const runDefault = async () => {
  await confirmRun(runFetchSchema, 'fetch-schema');
  await confirmRun(runFetchTables, 'fetch-tables');
  await confirmRun(runProcessSchema, 'process-schema');
  await confirmRun(runImportSchema, 'import-schema');
  await confirmRun(runImportTables, 'import-tables');
};

program
  .command('run', { isDefault: true })
  .description('Run the full migration')
  .action(runDefault);

program.parse(process.argv);