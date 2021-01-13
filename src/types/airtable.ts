import { AirtableColumn } from "./airtable-columns";
import { AirtableRecords } from "./airtable-records";

export type AirtableSchema = {
  [tableId: string]: AirtableTable;
};

export type AirtableTable = {
  id: string;
  name: string;
  nameForUrl: string;
  primaryColumnName: string;
  defaultView: {
    id: string;
    name: string;
  };
  columns: Array<AirtableColumn>;
  isEmpty: boolean;
  isEmptyDueToFilter: boolean;
  numRecordsToList: number;
  sampleRows: AirtableRecords;
};
