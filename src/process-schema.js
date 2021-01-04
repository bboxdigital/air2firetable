const { loadRawSchema, saveOutSchema } = require('./utils');
const { typeMap } = require('./constants');

const mapColumn = (column, index) => {
  return {
    config: {},
    fieldName: column.name,
    key: column.name,
    name: column.name,
    type: typeMap[column.type],
    index
  };
};

const getTableColumns = (table) => {
  return Object.fromEntries(table.columns.map((column, index) => [column.name, mapColumn(column, index)]));
};

const getTableSettings = (table) => {
  return {
    tableType: 'primaryCollection',
    collection: table.id,
    isCollectionGroup: false,
    name: table.name,
    roles: [ 'ADMIN' ],
    description: table.defaultView.name,
    section: 'Default'
  };
};

const getTableSchema = (table) => {
  return {
    ...getTableSettings(table),
    columns: getTableColumns(table)
  };
};

const processSchema = async (baseId) => {
  const rawSchema = await loadRawSchema(baseId);

  const outSchema = {
    settings: { tables: Object.values(rawSchema).map(table => getTableSettings(table)) },
    schemas: {}
  }

  for (const table of Object.values(rawSchema)) {
    outSchema[table.id] = getTableSchema(table);
  }

  await saveOutSchema(baseId, outSchema);
};

module.exports = {
  processSchema
};