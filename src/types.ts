export type RawSchema = {
  [tableId: string]: RawSchemaTable;
};

export type RawSchemaTable = {
  id: string;
  name: string;
  nameForUrl: string;
  primaryColumnName: string;
  defaultView: {
    id: string;
    name: string;
  };
  columns: Array<RawSchemaTableColumn>;
  isEmpty: boolean;
  isEmptyDueToFilter: boolean;
  numRecordsToList: number;
  sampleRows: Array<RawTableRecord>;
};

export type RawSchemaTableColumn = {
  id: string;
  name: string;
  type: string;
  typeOptions: object | null;
};

export type RawTable = Array<RawTableRecord>;

export type RawTableRecord = {
  [columnName: string]: string | number | object | null;
};

export type FiretableFieldType =
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

export type FiretableRole = string;

export type FiretableTableSettings = {
  tableType: "primaryCollection" | "collectionGroup";
  collection: string;
  isCollectionGroup: boolean;
  name: string;
  roles: Array<FiretableRole>;
  description: string;
  section: string;
};

export type FiretableColumnSettings = {
  config: object;
  fieldName: string;
  key: string;
  name: string;
  type: FiretableFieldType;
  index: number;
};

export type FiretableTableColumns = {
  [columnName: string]: FiretableColumnSettings;
};

export type FiretableTableSchema = FiretableTableSettings & {
  columns: FiretableTableColumns;
};

export type OutSchema = {
  settings: {
    tables: Array<FiretableTableSettings>;
  };
  schemas: {
    [tableId: string]: FiretableTableSchema;
  };
};
