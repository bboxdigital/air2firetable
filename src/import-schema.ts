import { firestore } from "firebase-admin";
import { FiretableSchema } from "./types";
import { loadData } from "./utils";

export const importSchema = async (baseId: string, firestore: firestore.Firestore) => {
  const schema: FiretableSchema = await loadData("out", baseId);

  await firestore.collection("_FIRETABLE_").doc("settings").set(schema.settings);

  for (const tableId in schema.schemas) {
    await firestore
      .collection("_FIRETABLE_")
      .doc("settings")
      .collection("schema")
      .doc(tableId)
      .set(schema.schemas[tableId]);
  }
};