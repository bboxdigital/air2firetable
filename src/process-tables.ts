import { AirtableRecords } from "./types/airtable";
import { FiretableSchema, FiretableRecords } from "./types/firetable";
import { loadFile, Prefix, saveFile } from "./utils";

export const processTables = async (baseId: string) => {
  const firetableSchema: FiretableSchema = await loadFile(Prefix.Firetable, baseId);

  for (const tableId in firetableSchema.schemas) {
    console.log(firetableSchema.schemas[tableId].name);
    const airtableRecords: AirtableRecords = await loadFile(Prefix.Airtable, tableId);

    const firetableRecords: FiretableRecords = airtableRecords;

    await saveFile(Prefix.Firetable, tableId, firetableRecords);
  }
};
