import { loadFile, Prefix, saveFile } from "./utils";
import { fieldMap } from "./constants";
import { AirtableSchema, AirtableTable } from "./types/airtable";
import { AirtableColumn } from "./types/airtable-columns";
import {
  FiretableColumnSettings,
  FiretableTableColumns,
  FiretableTableSchema,
  FiretableTableSettings,
  FiretableSchema,
} from "./types/firetable";

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
  const airtableSchema: AirtableSchema = await loadFile(Prefix.Airtable, baseId);

  const firetableSchema: FiretableSchema = {
    settings: { tables: Object.values(airtableSchema).map((table) => getTableSettings(table)) },
    schemas: {},
  };

  for (const table of Object.values(airtableSchema)) {
    firetableSchema.schemas[table.id] = getTableSchema(table);
  }

  await saveFile(Prefix.Firetable, baseId, firetableSchema);
};
