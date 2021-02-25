#!/usr/bin/env node
/* eslint-disable */

const inquirer = require("inquirer");
const { Command } = require("commander");
const { version } = require("../package.json");
const program = new Command();
program.version(version);

const firebase = require("firebase-admin");
const glob = require("glob");
const { readJsonSync } = require("fs-extra");
const { getEnv } = require("./utils");
let firebaseAdminSDK = process.env.FIREBASE_ADMINSDK || getEnv("FIREBASE_ADMINSDK");
if (!firebaseAdminSDK) {
  const globFiles = glob.sync("*firebase-adminsdk*.json");
  if (globFiles.length === 1) {
    firebaseAdminSDK = globFiles[0];
  } else {
    throw new Error("Unable to determine Firebase Admin SDK file!");
  }
}
console.log(`Using: ${firebaseAdminSDK}`);
const serviceAccount = readJsonSync(firebaseAdminSDK);
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const { hooks } = require("./hooks");
const { plugin } = require("./plugins/air2firetable-tqec/plugin"); // TODO: clean up
for (const hook of Object.keys(plugin)) {
  for (const handler of plugin[hook]) {
    hooks[hook].push(handler);
  }
}

const { fetchSchema } = require("./fetch-schema");
const { fetchTables } = require("./fetch-tables");
const { processAlgolia } = require("./process-algolia");
const { processSchema } = require("./process-schema");
const { processTables } = require("./process-tables");
const { importSchema } = require("./import-schema");
const { importTables } = require("./import-tables");

const askAirtableCredentials = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Airtable login email:",
    },
    {
      type: "password",
      name: "password",
      message: "Airtable login password:",
    },
  ]);
  return [answers.email, answers.password];
};

const runFetchSchema = async () =>
  await fetchSchema(getEnv("AIRTABLE_BASE_ID"), ...(await askAirtableCredentials()));
const runFetchTables = () => fetchTables(getEnv("AIRTABLE_BASE_ID"), getEnv("AIRTABLE_API_KEY"));
const runProcessAlgolia = () => processAlgolia(getEnv("AIRTABLE_BASE_ID"));
const runProcessSchema = () => processSchema(getEnv("AIRTABLE_BASE_ID"));
const runProcessTables = () => processTables(getEnv("AIRTABLE_BASE_ID"));
const runImportSchema = () => importSchema(getEnv("AIRTABLE_BASE_ID"), firebase.firestore());
const runImportTables = () => importTables(getEnv("AIRTABLE_BASE_ID"), firebase.firestore());

const commands = [
  [runFetchSchema, "fetch-schema", "Fetch base schema from Airtable"],
  [runFetchTables, "fetch-tables", "Fetch schema tables from Airtable"],
  [runProcessAlgolia, "process-algolia", "Process configs for Algolia"],
  [runProcessSchema, "process-schema", "Process schema for Firetable"],
  [runProcessTables, "process-tables", "Process tables for Firetable"],
  [runImportSchema, "import-schema", "Import schema into Firetable"],
  [runImportTables, "import-tables", "Import tables into Firetable"],
];

commands.forEach(([fn, name, description]) => {
  program.command(name).description(description).action(fn);
});

const confirmRun = async ([fn, name]) => {
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: `Run ${name}?`,
      default: true,
    },
  ]);
  return answers.confirmed && (await fn());
};

const runDefault = async () => {
  for (const command of commands) {
    await confirmRun(command);
  }
};

program
  .command("run", { isDefault: true })
  .description("Run the full migration")
  .action(runDefault);

program.parse(process.argv);
