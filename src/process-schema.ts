import { loadData, saveData } from './utils';
import { typeMap } from './constants';
import { FiretableColumnSettings, FiretableTableColumns, FiretableTableSchema, FiretableTableSettings, OutSchema, RawSchema, RawSchemaTable, RawSchemaTableColumn } from './types';

const mapColumn = (column: RawSchemaTableColumn, index: number): FiretableColumnSettings => {
  return {
    config: {},
    fieldName: column.name,
    key: column.name,
    name: column.name,
    type: typeMap[column.type],
    index
  };
};

const getTableColumns = (table: RawSchemaTable): FiretableTableColumns => {
  return Object.fromEntries(table.columns.map((column, index) => [column.name, mapColumn(column, index)]));
};

const getTableSettings = (table: RawSchemaTable): FiretableTableSettings => {
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

const getTableSchema = (table: RawSchemaTable): FiretableTableSchema => {
  return {
    ...getTableSettings(table),
    columns: getTableColumns(table)
  };
};

export const processSchema = async (baseId: string) => {
  const rawSchema: RawSchema = await loadData('raw', baseId);

  const outSchema: OutSchema = {
    settings: { tables: Object.values(rawSchema).map(table => getTableSettings(table)) },
    schemas: {}
  }

  for (const table of Object.values(rawSchema)) {
    outSchema.schemas[table.id] = getTableSchema(table);
  }

  await saveData('out', baseId, outSchema);
};