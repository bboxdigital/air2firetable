import { cursorTo } from "readline";
import { Progress } from "clui";
import { Timestamp } from "@google-cloud/firestore";
import { loadFile, Prefix } from "./utils";
import { firestore } from "firebase-admin";
import { FiretableSchema, FiretableTableColumns } from "./types/firetable";
import { FiretableRecord, FiretableRecords, FiretableRecordValue } from "./types/firetable-records";
import { FiretableBaseColumn } from "./types/firetable-columns";

const formatValue = (column: FiretableBaseColumn, value: FiretableRecordValue) => {
  switch (column.type) {
    case "DATE":
    case "DATE_TIME":
      return Timestamp.fromDate(new Date(Date.parse(value as string)));
    default:
      return value;
  }
};

const formatFields = (columns: FiretableTableColumns, record: FiretableRecord) =>
  Object.fromEntries(
    Object.entries(record.fields).map(([key, value]) => [key, formatValue(columns[key], value)])
  );

export const importTables = async (baseId: string, firestore: firestore.Firestore) => {
  const firetableSchema: FiretableSchema = await loadFile(Prefix.Firetable, baseId);

  for (const tableId in firetableSchema.schemas) {
    console.log(firetableSchema.schemas[tableId].name);
    const firetableRecords: FiretableRecords = await loadFile(Prefix.Firetable, tableId);
    const progressBar = new Progress(50);
    let batch = firestore.batch();

    for (let idx = 0; idx < firetableRecords.length; idx++) {
      cursorTo(process.stdout, 0);
      process.stdout.write(progressBar.update(idx + 1, firetableRecords.length));

      batch.set(
        firestore.collection(tableId).doc(firetableRecords[idx].id),
        formatFields(firetableSchema.schemas[tableId].columns, firetableRecords[idx])
      );

      if (idx % 200 == 0) {
        await batch.commit();
        batch = firestore.batch();
      }
    }

    batch.commit();
    process.stdout.write("\n");
  }
};
