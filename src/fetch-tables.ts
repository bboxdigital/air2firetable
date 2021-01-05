import Airtable from 'airtable';
import Table from 'airtable/lib/table';
import Record from 'airtable/lib/record';
import { cursorTo, clearLine } from 'readline';
import { loadData, saveData } from './utils';
import { RawSchema, RawSchemaTable } from './types';

const fetchRecords = (table: Table, rawTable: RawSchemaTable) => {
  let page = 1;
  const allRecords: object[] = [];

  return new Promise((resolve, reject) => {
    table.select({
      view: rawTable.defaultView.name
    }).eachPage((records: Record[], fetchNextPage: () => void) => {
      cursorTo(process.stdout, 0);
      clearLine(process.stdout, 0);
      process.stdout.write(`${records.length * page++}`);
      records.forEach(record => allRecords.push(record._rawJson));
      fetchNextPage();
    }, (err) => {
      cursorTo(process.stdout, 0);
      clearLine(process.stdout, 0);
      err ? reject(err) : resolve(allRecords);
    });
  });
};

export const fetchTables = async (baseId: string, apiKey: string) => {
  const rawSchema: RawSchema = await loadData('raw', baseId);
  const base = new Airtable({apiKey}).base(baseId);

  for (const rawTable of Object.values(rawSchema)) {
    console.log(rawTable.name);
    const records: object[] = await fetchRecords(base(rawTable.name), rawTable) as object[];
    console.log(records.length);
    await saveData('raw', rawTable.id, records);
  };
};