const R = require('ramda');
const { loadData, saveData } = require('./utils');

const processTables = async (baseId) => {
  const schema = await loadData('out', baseId);

  for (const tableId in schema.schemas) {
    console.log(schema.schemas[tableId].name);
    const rawRows = await loadData('raw', tableId);

    const outRows = R.pipe(
      R.identity
    )(rawRows);

    await saveData('out', tableId, outRows);
  }
};

module.exports = {
  processTables
};