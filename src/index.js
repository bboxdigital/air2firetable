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
const { processTables } = require('./process-tables');
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
const runFetchTables = () => fetchTables(getEnv('BASE_ID'), getEnv('AIRTABLE_KEY'));
const runProcessSchema = () => processSchema(getEnv('BASE_ID'));
const runProcessTables = () => processTables(getEnv('BASE_ID'));
const runImportSchema = () => importSchema(getEnv('BASE_ID'), firebase.firestore());
const runImportTables = () => importTables(getEnv('BASE_ID'), firebase.firestore());

const commands = [
  [runFetchSchema, 'fetch-schema', 'Fetch base schema from Airtable'],
  [runFetchTables, 'fetch-tables', 'Fetch schema tables from Airtable'],
  [runProcessSchema, 'process-schema', 'Process schema for Firetable'],
  [runProcessTables, 'process-tables', 'Process tables for Firetable'],
  [runImportSchema, 'import-schema', 'Import schema into Firetable'],
  [runImportTables, 'import-tables', 'Import tables into Firetable']
]

commands.forEach(([fn, name, description ]) => {
  program
    .command(name)
    .description(description)
    .action(fn);
});

const confirmRun = async ([fn, name]) => {
  const answers = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message: `Run ${name}?`,
    default: true
  }]);
  return answers.confirmed && await fn();
}

const runDefault = async () => {
  for (const command of commands) {
    await confirmRun(command);
  }
};

program
  .command('run', { isDefault: true })
  .description('Run the full migration')
  .action(runDefault);

program.parse(process.argv);