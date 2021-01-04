const { loadData } = require('./utils');

const importSchema = async (baseId, firestore) => {
  const schema = await loadData('out', baseId);

  await firestore
    .collection('_FIRETABLE_')
    .doc('settings')
    .set(schema.settings);

  for (const tableId in schema.schemas) {
    await firestore
      .collection('_FIRETABLE_')
      .doc('settings')
      .collection('schema')
      .doc(tableId)
      .set(schema.schemas[tableId]);
  }
};

module.exports = {
  importSchema
};