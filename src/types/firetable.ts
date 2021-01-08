import { FiretableColumn } from "./firetable-columns";

export type FiretableSchema = {
  settings: {
    tables: Array<FiretableTableSettings>;
  };
  schemas: {
    [tableId: string]: FiretableTableSchema;
  };
};

export type FiretableTableSettings = {
  tableType: "primaryCollection" | "collectionGroup";
  collection: string;
  isCollectionGroup: boolean;
  name: string;
  roles: Array<FiretableRole>;
  description: string;
  section: string;
};

export type FiretableRole = string;

export type FiretableTableSchema = FiretableTableSettings & {
  columns: FiretableTableColumns;
};

export type FiretableTableColumns = {
  [columnName: string]: FiretableColumn;
};

export type FiretableRecords = Array<FiretableRecord>;

export type FiretableRecord = {
  id: string;
  fields: {
    [columnName: string]: string | number | object | null;
  };
};
