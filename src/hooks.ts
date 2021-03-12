import { AirtableTable } from "./types/airtable";
import { FiretableSchema, FiretableTableColumns } from "./types/firetable";
import { FiretableRecord } from "./types/firetable-records";

export type BeforeGetTableColumnsHandler = (
  airtableTable: AirtableTable,
  firetableTableColumns: FiretableTableColumns,
  index: number
) => Promise<number>;

export type AfterGetTableColumnsHandler = (
  airtableTable: AirtableTable,
  firetableTableColumns: FiretableTableColumns
) => Promise<FiretableTableColumns>;

export type ProcessRecordHandler = (
  firetableSchema: FiretableSchema,
  tableId: string,
  firetableRecord: FiretableRecord
) => Promise<FiretableRecord>;

export type Hooks = {
  onBeforeGetTableColumns: Array<BeforeGetTableColumnsHandler>;
  onAfterGetTableColumns: Array<AfterGetTableColumnsHandler>;
  onBeforeProcessRecord: Array<ProcessRecordHandler>;
  onAfterProcessRecord: Array<ProcessRecordHandler>;
};

export const hooks: Hooks = {
  onBeforeGetTableColumns: [],
  onAfterGetTableColumns: [],
  onBeforeProcessRecord: [],
  onAfterProcessRecord: [],
};
