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

export type AirtableField =
  | "text"
  | "multilineText"
  | "checkbox"
  | "number"
  | "date"
  | "multipleAttachment"
  | "select"
  | "multiSelect"
  | "foreignKey"
  | "lookup"
  | "richText"
  | "rollup"
  | "formula"
  | "autoNumber";

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

export type FiretableRole = string;

export type FiretableColumnSettings = {
  config: object;
  fieldName: string;
  key: string;
  name: string;
  type: FiretableField;
  index: number;
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

export type FiretableTableColumns = {
  [columnName: string]: FiretableColumnSettings;
};

export type FiretableTableSchema = FiretableTableSettings & {
  columns: FiretableTableColumns;
};

export type FiretableSchema = {
  settings: {
    tables: Array<FiretableTableSettings>;
  };
  schemas: {
    [tableId: string]: FiretableTableSchema;
  };
};

export type FiretableRecords = Array<FiretableRecord>;

export type FiretableRecord = {
  id: string;
  fields: {
    [columnName: string]: string | number | object | null;
  };
};
