import R from "ramda";
import { FiretableSchema, AirtableRecords, FiretableRecords } from "./types";
import { loadFile, Prefix, saveFile } from "./utils";

export const processTables = async (baseId: string) => {
  const firetableSchema: FiretableSchema = await loadFile(Prefix.Firetable, baseId);

  for (const tableId in firetableSchema.schemas) {
    console.log(firetableSchema.schemas[tableId].name);
    const airtableRecords: AirtableRecords = await loadFile(Prefix.Airtable, tableId);

    const firetableRecords: FiretableRecords = R.pipe(R.identity)(airtableRecords);

    await saveFile(Prefix.Firetable, tableId, firetableRecords);
  }
};
