import { loadFile, Prefix, saveFile } from "./utils";
import { fieldMap } from "./constants";
import { AirtableSchema, AirtableTable } from "./types/airtable";
import {
  AirtableColumn,
  AirtableForeignKeyColumn,
  AirtableLookupColumn,
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
  FiretableDerivativeColumn,
  FiretableDocumentSelectColumn,
  FiretableSelectColumn,
} from "./types/firetable-columns";
import { AlgoliaIndex } from "./types/algolia";
import { hooks } from "./hooks";

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
    case "date":
      return column.typeOptions.isDateTime ? "DATE_TIME" : "DATE";
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
      options: column.typeOptions.choiceOrder.map((choiceId) => column.typeOptions.choices[choiceId].name),
    },
  } as FiretableSelectColumn);

const mapForeignKeyColumn = async (
  column: AirtableForeignKeyColumn,
  index: number
): Promise<FiretableDocumentSelectColumn> => {
  const algoliaIndex: AlgoliaIndex = await loadFile(Prefix.Algolia, column.typeOptions.foreignTableId);
  return {
    ...getCommonColumnProperties(column, index),
    type: "DOCUMENT_SELECT",
    config: {
      index: column.typeOptions.foreignTableId,
      primaryKeys: algoliaIndex.config.fieldsToSync,
    },
  };
};

const mapLookupColumn = async (
  table: AirtableTable,
  column: AirtableLookupColumn,
  index: number
): Promise<FiretableDerivativeColumn> => {
  const relColumn = table.columns.find(
    (col) => col.id == column.typeOptions.relationColumnId
  ) as AirtableForeignKeyColumn;
  return {
    ...getCommonColumnProperties(column, index),
    type: "DERIVATIVE",
    config: {
      listenerFields: [column.typeOptions.relationColumnId],
      renderFieldType: fieldMap[column.typeOptions.resultType],
      script: `
        const docId = row["${column.typeOptions.relationColumnId}"];
        const doc = await db.collection("${relColumn.typeOptions.foreignTableId}").doc(docId).get();
        return doc.data()["${column.typeOptions.foreignTableRollupColumnId}"];
      `,
    },
  };
};

const mapColumn = async (table: AirtableTable, column: AirtableColumn, index: number): Promise<FiretableBaseColumn> => {
  switch (column.type) {
    case "select":
    case "multiSelect":
      return mapSelectColumn(column, index);
    case "foreignKey":
      return await mapForeignKeyColumn(column, index);
    case "lookup":
      return await mapLookupColumn(table, column, index);
    default:
      return mapDefaultColumn(column, index);
  }
};

const getTableColumns = async (table: AirtableTable): Promise<FiretableTableColumns> => {
  const tableColumns: FiretableTableColumns = {};
  let index = 0;
  for (const handler of hooks["onGetTableColumns"]) {
    index = await handler(table, tableColumns, index);
  }
  for (const column of table.columns) {
    tableColumns[column.id] = await mapColumn(table, column, index++);
  }
  return tableColumns;
};

const getTableSettings = (table: AirtableTable): FiretableTableSettings => ({
  tableType: "primaryCollection",
  collection: table.id,
  isCollectionGroup: false,
  name: table.name,
  roles: ["ADMIN"],
  description: table.defaultView.name,
  section: "Default",
});

const getTableSchema = async (table: AirtableTable): Promise<FiretableTableSchema> => ({
  ...getTableSettings(table),
  columns: await getTableColumns(table),
});

export const processSchema = async (baseId: string) => {
  const airtableSchema: AirtableSchema = await loadFile(Prefix.Airtable, baseId);

  const firetableSchema: FiretableSchema = {
    settings: { tables: Object.values(airtableSchema).map((table) => getTableSettings(table)) },
    schemas: {},
  };

  for (const table of Object.values(airtableSchema)) {
    firetableSchema.schemas[table.id] = await getTableSchema(table);
  }

  await saveFile(Prefix.Firetable, baseId, firetableSchema);
};
