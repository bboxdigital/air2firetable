/* eslint-disable */
// @ts-nocheck

export const getAirtableSchema = () => {
  const data = { ...application.tablesById };
  Object.keys(data).forEach((key) => {
    data[key] = { ...data[key] };
    data[key].columns = [
      ...data[key].columns.map((column) => {
        return { ...column };
      }),
    ];
    data[key].columns.forEach((column) => {
      if (column.foreignTable && column.foreignTable.id) {
        column.foreignTable = column.foreignTable.id;
      }
    });
  });
  return data;
};
