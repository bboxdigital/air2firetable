const { cursorTo } = require('readline');
const { Progress } = require('clui');
const { loadData } = require('./utils');

const importTables = async (baseId, firestore) => {
  const schema = await loadData('out', baseId);

  for (const tableId in schema.schemas) {
    console.log(schema.schemas[tableId].name);
    const tableRows = await loadData('out', tableId);
    const progressBar = new Progress(50);
    let batch = firestore.batch();

    for (let idx = 0; idx < tableRows.length; idx++) {
      cursorTo(process.stdout, 0);
      process.stdout.write(progressBar.update(idx + 1, tableRows.length));

      batch.set(
        firestore
          .collection(tableId)
          .doc(tableRows[idx].id),
        tableRows[idx].fields
      );

      if (idx % 100 == 0) {
        await batch.commit();
        batch = firestore.batch();
      }
    }

    batch.commit();
    process.stdout.write('\n');
  }
};

module.exports = {
  importTables
};