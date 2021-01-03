const path = require('path');
const { readJson } = require('fs-extra');

const getSchemaPath = (baseId) => path.resolve('data', `${baseId}.json`);

const getSchema = (baseId) => readJson(getSchemaPath(baseId));

const getTablePath = (table) => path.resolve('data', `${table.id !== undefined ? table.id : table}.json`);

const getTable = (table) => readJson(getTablePath(table));

module.exports = {
  getSchemaPath,
  getSchema,
  getTablePath,
  getTable
}