import { loadFile, Prefix, saveFile } from "./utils";
import { fieldMap } from "./constants";
import { AirtableSchema, AirtableTable } from "./types/airtable";
import {
  AirtableColumn,
  AirtableColumnType,
  AirtableMultiSelectColumn,
  AirtableSelectColumn,
} from "./types/airtable-columns";
import {
  FiretableTableColumns,
  FiretableTableSchema,
  FiretableTableSettings,
  FiretableSchema,
} from "./types/firetable";
import {
  FiretableBaseColumn,
  FiretableColumnType,
  FiretableSelectColumn,
} from "./types/firetable-columns";

const mapType = (column: AirtableColumn): FiretableColumnType => {
  switch (column.type) {
    case "text":
      if (column.typeOptions?.validatorName === "url") {
        return "URL";
      } else if (column.typeOptions?.validatorName === "email") {
        return "EMAIL";
      } else {
        return "SIMPLE_TEXT";
      }
    default:
      return fieldMap[column.type];
  }
};

const getCommonColumnProperties = (column: AirtableColumn, index: number) => ({
  key: column.id,
  fieldName: column.id,
  name: column.name,
  index,
});

const mapDefaultColumn = (column: AirtableColumn, index: number): FiretableBaseColumn => ({
  ...getCommonColumnProperties(column, index),
  type: mapType(column),
  config: {},
});

const mapSelectColumn = (
  column: AirtableSelectColumn | AirtableMultiSelectColumn,
  index: number
): FiretableSelectColumn =>
  ({
    ...getCommonColumnProperties(column, index),
    type: mapType(column),
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
  Object.fromEntries(table.columns.map((column, index) => [column.id, mapColumn(column, index)]));

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
