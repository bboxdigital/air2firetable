import { AirtableTable } from "./types/airtable";
import { FiretableSchema, FiretableTableColumns } from "./types/firetable";
import { FiretableRecord } from "./types/firetable-records";

export type GetTableColumnsHandler = (
  airtableTable: AirtableTable,
  firetableTableColumns: FiretableTableColumns,
  index: number
) => Promise<number>;

export type ProcessRecordHandler = (
  firetableSchema: FiretableSchema,
  tableId: string,
  firetableRecord: FiretableRecord
) => Promise<FiretableRecord>;

export type Hooks = {
  onGetTableColumns: Array<GetTableColumnsHandler>;
  onBeforeProcessRecord: Array<ProcessRecordHandler>;
  onAfterProcessRecord: Array<ProcessRecordHandler>;
};

export const hooks: Hooks = {
  onGetTableColumns: [],
  onBeforeProcessRecord: [],
  onAfterProcessRecord: [],
};
