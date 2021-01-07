import { AirtableColumn } from "./airtable-columns";

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
  sampleRows: Array<AirtableRecord>;
};

export type AirtableRecords = Array<AirtableRecord>;

export type AirtableRecord = {
  id: string;
  fields: {
    [columnName: string]: string | number | object | null;
  };
};
