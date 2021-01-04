require('dotenv').config();

const path = require('path');
const { readJson, writeJson } = require('fs-extra');

const getEnv = (name) => process.env[name] ??
                         (() => { throw new Error(`undefined .env variable: ${name}`); })()

const getFilePath = (type, id) => path.resolve('data', `${type}-${id}.json`);

const loadData = (type, id) => readJson(getFilePath(type, id));
const saveData = (type, id, data) => writeJson(getFilePath(type, id), data);

module.exports = {
  getEnv,
  loadData,
  saveData
}