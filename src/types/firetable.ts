import { FiretableBaseColumn } from "./firetable-columns";

export type FiretableSchema = {
  settings: FiretableSettings;
  schemas: {
    [tableId: string]: FiretableTableSchema;
  };
};

export type FiretableSettings = {
  tables: Array<FiretableTableSettings>;
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
  [columnName: string]: FiretableBaseColumn;
};

export type FiretableAlgoliaConfig = {
  name: string; // "[collection]"
  subTable?: string; // "[subcollection]"
  fieldsToSync: Array<string>;
  requiredFields?: Array<string>;
  indices?: Array<{
    name: string;
    fieldsToSync: Array<string>;
  }>;
};
