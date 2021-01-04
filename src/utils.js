require('dotenv').config();

const path = require('path');
const { readJson } = require('fs-extra');

const getEnv = (name) => process.env[name] ??
                         (() => { throw new Error(`undefined .env variable: ${name}`); })()

const getRawSchemaPath = (baseId) => path.resolve('data', `${baseId}.json`);
const getOutSchemaPath = (baseId) => path.resolve('data', `out-${baseId}.json`);

const getRawSchema = (baseId) => readJson(getRawSchemaPath(baseId));
const getOutSchema = (baseId) => readJson(getOutSchemaPath(baseId));

const getRawTablePath = (table) => path.resolve('data', `${table.id ?? table}.json`);
const getOutTablePath = (table) => path.resolve('data', `out-${table.id ?? table}.json`);

const getRawTable = (table) => readJson(getRawTablePath(table));
const getOutTable = (table) => readJson(getOutTablePath(table));

module.exports = {
  getEnv,
  getRawSchemaPath,
  getOutSchemaPath,
  getRawSchema,
  getOutSchema,
  getRawTablePath,
  getOutTablePath,
  getRawTable,
  getOutTable
}