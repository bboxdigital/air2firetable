const R = require('ramda');
const { loadOutSchema, loadRawTable, saveOutTable } = require('./utils');

const processTables = async (baseId) => {
  const schema = await loadOutSchema(baseId);

  for (const tableId in schema.schemas) {
    console.log(schema.schemas[tableId].name);
    const rawRows = await loadRawTable(tableId);

    const outRows = R.pipe(
      R.identity
    )(rawRows);

    await saveOutTable(tableId, outRows);
  }
};

module.exports = {
  processTables
};