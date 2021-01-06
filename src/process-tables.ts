import R from "ramda";
import { FiretableSchema, AirtableData } from "./types";
import { loadData, saveData } from "./utils";

export const processTables = async (baseId: string) => {
  const schema: FiretableSchema = await loadData("out", baseId);

  for (const tableId in schema.schemas) {
    console.log(schema.schemas[tableId].name);
    const rawRows: AirtableData = await loadData("raw", tableId);

    const outRows = R.pipe(R.identity)(rawRows);

    await saveData("out", tableId, outRows);
  }
};
