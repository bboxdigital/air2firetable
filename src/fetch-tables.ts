import Airtable from "airtable";
import Table from "airtable/lib/table";
import Record from "airtable/lib/record";
import { cursorTo, clearLine } from "readline";
import { loadData, Prefix, saveData } from "./utils";
import { AirtableSchema, AirtableTable, AirtableRecord } from "./types";

const fetchRecords = (table: Table, rawTable: AirtableTable): Promise<AirtableRecord[]> => {
  let page = 1;
  const allRecords: AirtableRecord[] = [];

  return new Promise((resolve, reject) => {
    table
      .select({
        view: rawTable.defaultView.name,
      })
      .eachPage(
        (records: Record[], fetchNextPage: () => void) => {
          cursorTo(process.stdout, 0);
          clearLine(process.stdout, 0);
          process.stdout.write(`${records.length * page++}`);
          records.forEach((record) => allRecords.push(record._rawJson));
          fetchNextPage();
        },
        (err) => {
          cursorTo(process.stdout, 0);
          clearLine(process.stdout, 0);
          err ? reject(err) : resolve(allRecords);
        }
      );
  });
};

export const fetchTables = async (baseId: string, apiKey: string) => {
  const airSchema: AirtableSchema = await loadData(Prefix.Air, baseId);
  const base = new Airtable({ apiKey }).base(baseId);

  for (const airTable of Object.values(airSchema)) {
    console.log(airTable.name);
    const records: AirtableRecord[] = await fetchRecords(base(airTable.name), airTable);
    console.log(records.length);
    await saveData(Prefix.Air, airTable.id, records);
  }
};
