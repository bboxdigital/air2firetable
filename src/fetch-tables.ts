import Airtable from "airtable";
import Table from "airtable/lib/table";
import Record from "airtable/lib/record";
import { cursorTo, clearLine } from "readline";
import { loadFile, Prefix, saveFile } from "./utils";
import { AirtableSchema, AirtableTable, AirtableRecord } from "./types";

const fetchRecords = (table: Table, airtableTable: AirtableTable): Promise<AirtableRecord[]> => {
  let page = 1;
  const allRecords: AirtableRecord[] = [];

  return new Promise((resolve, reject) => {
    table
      .select({
        view: airtableTable.defaultView.name,
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
  const airtableSchema: AirtableSchema = await loadFile(Prefix.Airtable, baseId);
  const base = new Airtable({ apiKey }).base(baseId);

  for (const airtableTable of Object.values(airtableSchema)) {
    console.log(airtableTable.name);
    const airtableRecords: AirtableRecord[] = await fetchRecords(
      base(airtableTable.name),
      airtableTable
    );
    console.log(airtableRecords.length);
    await saveFile(Prefix.Airtable, airtableTable.id, airtableRecords);
  }
};
