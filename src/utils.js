require('dotenv').config();

const path = require('path');
const { readJson, writeJson } = require('fs-extra');

const getEnv = (name) => process.env[name] ??
                         (() => { throw new Error(`undefined .env variable: ${name}`); })()

const getRawSchemaPath = (baseId) => path.resolve('data', `raw-${baseId}.json`);
const getOutSchemaPath = (baseId) => path.resolve('data', `out-${baseId}.json`);

const loadRawSchema = (baseId) => readJson(getRawSchemaPath(baseId));
const loadOutSchema = (baseId) => readJson(getOutSchemaPath(baseId));

const saveRawSchema = (baseId, data) => writeJson(getRawSchemaPath(baseId), data);
const saveOutSchema = (baseId, data) => writeJson(getOutSchemaPath(baseId), data);

const getRawTablePath = (table) => path.resolve('data', `${table.id ?? table}.json`);
const getOutTablePath = (table) => path.resolve('data', `out-${table.id ?? table}.json`);

const loadRawTable = (table) => readJson(getRawTablePath(table));
const loadOutTable = (table) => readJson(getOutTablePath(table));

const saveRawTable = (baseId, data) => writeJson(getRawTablePath(baseId), data);
const saveOutTable = (baseId, data) => writeJson(getOutTablePath(baseId), data);

module.exports = {
  getEnv,
  loadRawSchema,
  loadOutSchema,
  saveRawSchema,
  saveOutSchema,
  loadRawTable,
  loadOutTable,
  saveRawTable,
  saveOutTable
}