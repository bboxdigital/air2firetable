import { firestore } from "firebase-admin";
import { FiretableSchema, FiretableSettings } from "./types/firetable";
import { loadFile, Prefix } from "./utils";

export const importSchema = async (baseId: string, firestore: firestore.Firestore) => {
  const firetableSchema: FiretableSchema = await loadFile(Prefix.Firetable, baseId);

  const tableIds = Object.keys(firetableSchema.schemas);
  const currentSettings: FiretableSettings = (await firestore
    .collection("_FIRETABLE_")
    .doc("settings")
    .get()
    .then((doc) => doc.data())) as FiretableSettings;
  const mergedSettings: FiretableSettings = {
    tables: [
      ...currentSettings.tables.filter((table) => !tableIds.includes(table.collection)),
      ...firetableSchema.settings.tables,
    ],
  };

  await firestore.collection("_FIRETABLE_").doc("settings").set(mergedSettings);

  for (const tableId of Object.keys(firetableSchema.schemas)) {
    await firestore
      .collection("_FIRETABLE_")
      .doc("settings")
      .collection("schema")
      .doc(tableId)
      .set(firetableSchema.schemas[tableId]);
  }
};
