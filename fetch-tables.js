#!/usr/bin/env node

require('dotenv').config();

const inquirer = require('inquirer');
const { writeJson } = require('fs-extra');
const Airtable = require('airtable');
const { getSchema, getTablePath } = require('./utils');

const fetchRecords = (base, table) => {
  let page = 1;
  const allRecords = [];

  return new Promise((resolve, reject) => {
    base(table.name).select({
      view: table.defaultView.name
    }).eachPage((records, fetchNextPage) => {
      console.log(records.length, page++);
      records.forEach(record => allRecords.push(record._rawJson));
      fetchNextPage();
    }, (err) => {
      err ? reject(err) : resolve(allRecords);
    });
  });
}

const fetchTables = async (baseId, apiKey) => {
  const schema = await getSchema(baseId);
  const base = new Airtable({apiKey}).base(baseId);

  for (const table of Object.values(schema)) {
    console.log(table.name);
    const records = await fetchRecords(base, table);
    console.log(records.length);
    await writeJson(getTablePath(table), records);
  };
}

const run = async (baseId) => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'apiKey',
      message: 'Airtable API key:'
    }
  ]);
  await fetchTables(baseId, answers.apiKey);
}

run(process.env.BASE_ID);