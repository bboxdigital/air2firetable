const Airtable = require('airtable');
const { cursorTo, clearLine } = require('readline');
const { loadData, saveData } = require('./utils');

const fetchRecords = (base, table) => {
  let page = 1;
  const allRecords = [];

  return new Promise((resolve, reject) => {
    base(table.name).select({
      view: table.defaultView.name
    }).eachPage((records, fetchNextPage) => {
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

const fetchTables = async (baseId, apiKey) => {
  const schema = await loadData('raw', baseId);
  const base = new Airtable({apiKey}).base(baseId);

  for (const table of Object.values(schema)) {
    console.log(table.name);
    const records = await fetchRecords(base, table);
    console.log(records.length);
    await saveData('raw', table.id, records);
  };
};

module.exports = {
  fetchTables
};