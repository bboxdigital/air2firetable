import { loadFile, Prefix, saveFile } from "./utils";
import { AirtableSchema } from "./types/airtable";
import { AlgoliaIndex } from "./types/algolia";
import { AirtableRecords } from "./types/airtable-records";

export const processAlgolia = async (baseId: string) => {
  const airtableSchema: AirtableSchema = await loadFile(Prefix.Airtable, baseId);

  for (const table of Object.values(airtableSchema)) {
    const columnNameMap = Object.fromEntries(table.columns.map((column) => [column.name, column.id]));
    const primaryColumnId = columnNameMap[table.primaryColumnName];
    const textColumns = table.columns.filter(
      (col) =>
        (col.type === "text" && !col.typeOptions?.validatorName) ||
        col.type === "multilineText" ||
        col.type === "richText"
    );

    const algoliaIndex: AlgoliaIndex = {
      config: {
        name: table.id,
        fieldsToSync: Array.from(new Set([primaryColumnId, ...textColumns.map((col) => col.id)])),
        requiredFields: [primaryColumnId],
      },
      entries: {},
    };

    const airtableRecords: AirtableRecords = await loadFile(Prefix.Airtable, table.id);

    for (const record of airtableRecords) {
      algoliaIndex.entries[record.id] = [
        {
          docPath: `${table.id}/${record.id}`,
          snapshot: {
            objectID: record.id,
            [primaryColumnId]: record.fields[table.primaryColumnName],
            ...Object.fromEntries(textColumns.map((col) => [col.id, record.fields[col.name]])),
          },
        },
      ];
    }

    await saveFile(Prefix.Algolia, table.id, algoliaIndex);
  }
};
