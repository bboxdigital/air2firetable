import { loadData, saveData } from "./utils";
import { fieldMap } from "./constants";
import {
  FiretableColumnSettings,
  FiretableTableColumns,
  FiretableTableSchema,
  FiretableTableSettings,
  FiretableSchema,
  AirtableSchema,
  AirtableTable,
  AirtableColumn,
} from "./types";

const mapColumn = (column: AirtableColumn, index: number): FiretableColumnSettings => {
  return {
    config: {},
    fieldName: column.name,
    key: column.name,
    name: column.name,
    type: fieldMap[column.type],
    index,
  };
};

const getTableColumns = (table: AirtableTable): FiretableTableColumns => {
  return Object.fromEntries(
    table.columns.map((column, index) => [column.name, mapColumn(column, index)])
  );
};

const getTableSettings = (table: AirtableTable): FiretableTableSettings => {
  return {
    tableType: "primaryCollection",
    collection: table.id,
    isCollectionGroup: false,
    name: table.name,
    roles: ["ADMIN"],
    description: table.defaultView.name,
    section: "Default",
  };
};

const getTableSchema = (table: AirtableTable): FiretableTableSchema => {
  return {
    ...getTableSettings(table),
    columns: getTableColumns(table),
  };
};

export const processSchema = async (baseId: string) => {
  const rawSchema: AirtableSchema = await loadData("raw", baseId);

  const outSchema: FiretableSchema = {
    settings: { tables: Object.values(rawSchema).map((table) => getTableSettings(table)) },
    schemas: {},
  };

  for (const table of Object.values(rawSchema)) {
    outSchema.schemas[table.id] = getTableSchema(table);
  }

  await saveData("out", baseId, outSchema);
};
