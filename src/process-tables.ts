import { AirtableSchema } from "./types/airtable";
import {
  AirtableRecordMultipleAttachment,
  AirtableRecords,
  AirtableRecordValue,
} from "./types/airtable-records";
import { AirtableColumn, AirtableMultipleAttachmentColumn } from "./types/airtable-columns";
import { FiretableSchema } from "./types/firetable";
import {
  FiretableRecordFile,
  FiretableRecords,
  FiretableRecordValue,
} from "./types/firetable-records";
import { loadFile, Prefix, saveFile } from "./utils";

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

const mapValue = (
  tableId: string,
  recordId: string,
  column: AirtableColumn,
  value: AirtableRecordValue
): FiretableRecordValue => {
  switch (column.type) {
    case "multipleAttachment":
      return mapMultipleAttachment(
        tableId,
        recordId,
        column,
        value as AirtableRecordMultipleAttachment
      );
    default:
      return value;
  }
};

export const processTables = async (baseId: string) => {
  const airtableSchema: AirtableSchema = await loadFile(Prefix.Airtable, baseId);
  const firetableSchema: FiretableSchema = await loadFile(Prefix.Firetable, baseId);

  for (const tableId in firetableSchema.schemas) {
    console.log(firetableSchema.schemas[tableId].name);
    const nameToColumn: { [key: string]: AirtableColumn } = Object.fromEntries(
      Object.values(airtableSchema[tableId].columns).map((value) => [value.name, value])
    );
    const airtableRecords: AirtableRecords = await loadFile(Prefix.Airtable, tableId);

    const firetableRecords: FiretableRecords = airtableRecords.map(({ id, fields }) => ({
      id,
      fields: Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
          nameToColumn[key].id,
          mapValue(tableId, id, nameToColumn[key], value),
        ])
      ),
    }));

    await saveFile(Prefix.Firetable, tableId, firetableRecords);
  }
};
