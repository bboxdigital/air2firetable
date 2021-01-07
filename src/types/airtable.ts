import { AirtableField } from "./airtable-fields";

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

export type AirtableColumn = {
  id: string;
  name: string;
  type: AirtableField;
  typeOptions: object | null;
};

export type AirtableRecords = Array<AirtableRecord>;

export type AirtableRecord = {
  id: string;
  fields: {
    [columnName: string]: string | number | object | null;
  };
};
