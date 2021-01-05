import { cursorTo } from 'readline';
import { Progress } from 'clui';
import { loadData } from './utils';
import { firestore } from 'firebase-admin';
import { OutSchema } from './types';

export const importTables = async (baseId: string, firestore: firestore.Firestore) => {
  const schema: OutSchema = await loadData('out', baseId);

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