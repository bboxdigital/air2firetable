const { loadOutSchema } = require('./utils');

const importSchema = async (baseId, firestore) => {
  const schema = await loadOutSchema(baseId);

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