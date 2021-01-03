#!/usr/bin/env node

require('dotenv').config();

const { cursorTo } = require('readline');
const { Progress } = require('clui');
const firebase = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');
const { getSchema, getTable } = require('./utils');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const importTables = async (baseId, firestore) => {
  const schema = await getSchema(baseId);

  for (const table of Object.values(schema)) {
    console.log(table.name);
    const tableRows = await getTable(table);
    const progressBar = new Progress(50);
    let batch = firestore.batch();

    for (let idx = 0; idx < tableRows.length; idx++) {
      cursorTo(process.stdout, 0);
      process.stdout.write(progressBar.update(idx + 1, tableRows.length));

      batch.set(firestore.collection(table.id).doc(tableRows[idx].id), tableRows[idx].fields);

      if (idx % 100 == 0) {
        await batch.commit();
        batch = firestore.batch();
      }
    }

    batch.commit();
    process.stdout.write('\n');
  }
}

importTables(process.env.BASE_ID, firebase.firestore());