require('dotenv').config();

const path = require('path');
const { readJson } = require('fs-extra');

const getEnv = (name) => process.env[name] ??
                         (() => { throw new Error(`undefined .env variable: ${name}`); })()

const getSchemaPath = (baseId) => path.resolve('data', `${baseId}.json`);

const getSchema = (baseId) => readJson(getSchemaPath(baseId));

const getTablePath = (table) => path.resolve('data', `${table.id !== undefined ? table.id : table}.json`);

const getTable = (table) => readJson(getTablePath(table));

module.exports = {
  getEnv,
  getSchemaPath,
  getSchema,
  getTablePath,
  getTable
}