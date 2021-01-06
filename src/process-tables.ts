import R from "ramda";
import { FiretableSchema, AirtableData } from "./types";
import { loadData, Prefix, saveData } from "./utils";

export const processTables = async (baseId: string) => {
  const schema: FiretableSchema = await loadData(Prefix.Fire, baseId);

  for (const tableId in schema.schemas) {
    console.log(schema.schemas[tableId].name);
    const airRows: AirtableData = await loadData(Prefix.Air, tableId);

    const fireRows = R.pipe(R.identity)(airRows);

    await saveData(Prefix.Fire, tableId, fireRows);
  }
};
