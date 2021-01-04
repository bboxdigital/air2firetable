const { getRawSchema } = require('./utils');

const typeMap = Object.freeze({
  // see: https://github.com/AntlerVC/firetable/blob/master/www/src/constants/fields.tsx
  'autoNumber': 'NUMBER', // automatically generates a unique, automatically incremented number
  'text': 'SIMPLE_TEXT',
  'number': 'NUMBER',
  'select': 'SINGLE_SELECT',
  'multilineText': 'LONG_TEXT',
  'multiSelect': 'MULTI_SELECT',
  'richText': 'RICH_TEXT',
  'foreignKey': 'JSON', // [ 'recxLter7QYPTgaKq' ],
  'multipleAttachment': 'JSON', /*  [
                                      {
                                        id: 'att4eybld3qlhFfIK',
                                        url: 'https://cdn.filestackcontent.com/F94oVb05QbmCZlMZeWeJ',
                                        filename: 'Briser_le_code_document_enseignant.pdf',
                                        type: 'application/pdf'
                                      }
                                    ] */
  'lookup': 'JSON', // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
  'date': 'DATE',
  'rollup': 'JSON', // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
  'checkbox': 'CHECK_BOX',
  'formula': 'JSON' // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
});

const mapColumn = (column, index) => {
  return {
    config: {},
    fieldName: column.name,
    key: column.name,
    name: column.name,
    type: typeMap[column.type],
    index
  };
};

const getRawTableColumns = (table) => {
  return Object.fromEntries(table.columns.map((column, index) => [column.name, mapColumn(column, index)]));
};

const getRawTableSettings = (table) => {
  return {
    tableType: 'primaryCollection',
    collection: table.id,
    isCollectionGroup: false,
    name: table.name,
    roles: [ 'ADMIN' ],
    description: table.defaultView.name,
    section: 'Default'
  };
};

const getRawTableSchema = (table) => {
  return {
    ...getRawTableSettings(table),
    columns: getRawTableColumns(table)
  };
};

const importSchema = async (baseId, firestore) => {
  const schema = await getRawSchema(baseId);

  const settings = { tables: Object.values(schema).map(table => getRawTableSettings(table)) };
  await firestore.collection('_FIRETABLE_').doc('settings').set(settings);

  for (const table of Object.values(schema)) {
    const tableSchema = getRawTableSchema(table);
    await firestore.collection('_FIRETABLE_').doc('settings').collection('schema').doc(table.id).set(tableSchema);
  }
};

module.exports = {
  importSchema
};