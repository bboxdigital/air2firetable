import { loadFile, Prefix, saveFile } from "./utils";
import { fieldMap } from "./constants";
import { AirtableSchema, AirtableTable } from "./types/airtable";
import {
  AirtableColumn,
  AirtableMultiSelectColumn,
  AirtableSelectColumn,
} from "./types/airtable-columns";
import {
  FiretableTableColumns,
  FiretableTableSchema,
  FiretableTableSettings,
  FiretableSchema,
} from "./types/firetable";
import { FiretableBaseColumn, FiretableSelectColumn } from "./types/firetable-columns";

const getCommonColumnProperties = (column: AirtableColumn, index: number) => ({
  key: column.name,
  name: column.name,
  fieldName: column.name,
  index,
});

const mapDefaultColumn = (column: AirtableColumn, index: number): FiretableBaseColumn => ({
  ...getCommonColumnProperties(column, index),
  type: fieldMap[column.type],
  config: {},
});

const mapSelectColumn = (
  column: AirtableSelectColumn | AirtableMultiSelectColumn,
  index: number
): FiretableSelectColumn =>
  ({
    ...getCommonColumnProperties(column, index),
    type: fieldMap[column.type],
    config: {
      freeChoice: false,
      options: column.typeOptions.choiceOrder.map(
        (choiceId) => column.typeOptions.choices[choiceId].name
      ),
    },
  } as FiretableSelectColumn);

const mapColumn = (column: AirtableColumn, index: number): FiretableBaseColumn => {
  switch (column.type) {
    case "select":
    case "multiSelect":
      return mapSelectColumn(column, index);
    default:
      return mapDefaultColumn(column, index);
  }
};

const getTableColumns = (table: AirtableTable): FiretableTableColumns =>
  Object.fromEntries(table.columns.map((column, index) => [column.name, mapColumn(column, index)]));

const getTableSettings = (table: AirtableTable): FiretableTableSettings => ({
  tableType: "primaryCollection",
  collection: table.id,
  isCollectionGroup: false,
  name: table.name,
  roles: ["ADMIN"],
  description: table.defaultView.name,
  section: "Default",
});

const getTableSchema = (table: AirtableTable): FiretableTableSchema => ({
  ...getTableSettings(table),
  columns: getTableColumns(table),
});

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
