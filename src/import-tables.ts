import { cursorTo } from "readline";
import { Progress } from "clui";
import { loadFile, Prefix } from "./utils";
import { firestore } from "firebase-admin";
import { FiretableSchema } from "./types/firetable";
import { FiretableRecords } from "./types/firetable-records";

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
        firetableRecords[idx].fields
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
