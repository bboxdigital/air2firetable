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
  [columnName: string]: FiretableColumnSettings;
};

export type FiretableColumnSettings = {
  config: object;
  fieldName: string;
  key: string;
  name: string;
  type: FiretableField;
  index: number;
};

export type FiretableRecords = Array<FiretableRecord>;

export type FiretableRecord = {
  id: string;
  fields: {
    [columnName: string]: string | number | object | null;
  };
};

export type FiretableField =
  | "SIMPLE_TEXT"
  | "LONG_TEXT"
  | "EMAIL"
  | "PHONE_NUMBER"
  | "CHECK_BOX"
  | "NUMBER"
  | "PERCENTAGE"
  | "DATE"
  | "DATE_TIME"
  | "DURATION"
  | "URL"
  | "RATING"
  | "IMAGE"
  | "FILE"
  | "SINGLE_SELECT"
  | "MULTI_SELECT"
  | "SUB_TABLE"
  | "DOCUMENT_SELECT"
  | "SERVICE_SELECT"
  | "JSON"
  | "CODE"
  | "RICH_TEXT"
  | "ACTION"
  | "DERIVATIVE"
  | "AGGREGATE"
  | "COLOR"
  | "SLIDER"
  | "USER"
  | "ID"
  | "LAST";
