import { AirtableSchema } from "./types/airtable";
import {
  AirtableRecordForeignKey,
  AirtableRecordMultipleAttachment,
  AirtableRecords,
  AirtableRecordValue,
} from "./types/airtable-records";
import { AirtableColumn, AirtableForeignKeyColumn, AirtableMultipleAttachmentColumn } from "./types/airtable-columns";
import { FiretableSchema } from "./types/firetable";
import {
  FiretableRecord,
  FiretableRecordDocumentSelect,
  FiretableRecordFile,
  FiretableRecords,
  FiretableRecordValue,
} from "./types/firetable-records";
import { AlgoliaIndex } from "./types/algolia";
import { loadFile, Prefix, saveFile } from "./utils";
import { hooks } from "./hooks";

const algoliaIndices: { [tableId: string]: AlgoliaIndex } = {};

const mapMultipleAttachment = (
  tableId: string,
  recordId: string,
  column: AirtableMultipleAttachmentColumn,
  value: AirtableRecordMultipleAttachment
): FiretableRecordFile =>
  value.map((item) => ({
    name: item.filename,
    type: item.type,
    ref: `${tableId}/${recordId}/${column.id}/${item.filename}`,
    downloadURL: item.url, // TODO: upload to Cloud Storage
    lastModifiedTS: Date.now(),
  }));

const mapForeignKey = async (
  column: AirtableForeignKeyColumn,
  value: AirtableRecordForeignKey
): Promise<FiretableRecordDocumentSelect> => {
  const ftId = column.typeOptions.foreignTableId;
  if (!algoliaIndices.hasOwnProperty(ftId)) {
    algoliaIndices[ftId] = await loadFile(Prefix.Algolia, ftId);
  }
  return value.map((objectID) => algoliaIndices[ftId].entries[objectID]).flat();
};

const mapValue = async (
  tableId: string,
  recordId: string,
  column: AirtableColumn,
  value: AirtableRecordValue
): Promise<FiretableRecordValue> => {
  switch (column.type) {
    case "multipleAttachment":
      return mapMultipleAttachment(tableId, recordId, column, value as AirtableRecordMultipleAttachment);
    case "foreignKey":
      return mapForeignKey(column, value as AirtableRecordForeignKey);
    default:
      return value;
  }
};

export const processTables = async (baseId: string) => {
  const airtableSchema: AirtableSchema = await loadFile(Prefix.Airtable, baseId);
  const firetableSchema: FiretableSchema = await loadFile(Prefix.Firetable, baseId);

  for (const tableId in firetableSchema.schemas) {
    // console.log(firetableSchema.schemas[tableId].name);
    const nameToColumn: { [key: string]: AirtableColumn } = Object.fromEntries(
      Object.values(airtableSchema[tableId].columns).map((value) => [value.name, value])
    );
    const airtableRecords: AirtableRecords = await loadFile(Prefix.Airtable, tableId);

    const firetableRecords: FiretableRecords = [];

    for (const airtableRecord of airtableRecords) {
      let firetableRecord: FiretableRecord = {
        id: airtableRecord.id,
        fields: {},
      };
      for (const handler of hooks["onBeforeProcessRecord"]) {
        firetableRecord = await handler(firetableSchema, tableId, firetableRecord);
      }
      for (const [key, value] of Object.entries(airtableRecord.fields)) {
        if (nameToColumn[key]) {
          firetableRecord.fields[nameToColumn[key].id] = await mapValue(
            tableId,
            airtableRecord.id,
            nameToColumn[key],
            value
          );
        } else {
          console.log(`WARNING: ${tableId} column not found: ${key}`);
        }
      }
      for (const handler of hooks["onAfterProcessRecord"]) {
        firetableRecord = await handler(firetableSchema, tableId, firetableRecord);
      }
      firetableRecords.push(firetableRecord);
    }

    await saveFile(Prefix.Firetable, tableId, firetableRecords);
  }
};
