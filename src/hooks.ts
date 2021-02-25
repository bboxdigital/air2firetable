import { AirtableTable } from "./types/airtable";
import { FiretableSchema, FiretableTableColumns } from "./types/firetable";
import { FiretableRecord } from "./types/firetable-records";

export type GetTableColumnsHandler = (
  airtableTable: AirtableTable,
  firetableTableColumns: FiretableTableColumns,
  index: number
) => number;

export type ProcessRecordHandler = (
  firetableSchema: FiretableSchema,
  tableId: string,
  firetableRecord: FiretableRecord
) => FiretableRecord;

export type Hooks = {
  onGetTableColumns: Array<GetTableColumnsHandler>;
  onProcessRecord: Array<ProcessRecordHandler>;
};

export const hooks: Hooks = {
  onGetTableColumns: [],
  onProcessRecord: [],
};
