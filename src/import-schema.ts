import { firestore } from "firebase-admin";
import { FiretableSchema } from "./types/firetable";
import { loadFile, Prefix } from "./utils";

export const importSchema = async (baseId: string, firestore: firestore.Firestore) => {
  const firetableSchema: FiretableSchema = await loadFile(Prefix.Firetable, baseId);

  await firestore.collection("_FIRETABLE_").doc("settings").set(firetableSchema.settings);

  for (const tableId in firetableSchema.schemas) {
    await firestore
      .collection("_FIRETABLE_")
      .doc("settings")
      .collection("schema")
      .doc(tableId)
      .set(firetableSchema.schemas[tableId]);
  }
};
