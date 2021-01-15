export interface FiretableBaseColumn {
  key: string;
  fieldName: string;
  name: string;
  index: number;
  type: FiretableColumnType;
  config: object;
}

export type FiretableColumnType =
  | "SIMPLE_TEXT" // "Short Text"
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
  | "DOCUMENT_SELECT" // "Connect Table"
  | "SERVICE_SELECT" // "Connect Service"
  | "JSON"
  | "CODE"
  | "RICH_TEXT"
  | "ACTION"
  | "DERIVATIVE"
  | "AGGREGATE"
  | "COLOR"
  | "SLIDER"
  | "USER"
  | "ID";

export interface FiretableTextColumn extends FiretableBaseColumn {
  type: "SIMPLE_TEXT" | "LONG_TEXT";
  config: {
    maxLength?: string; // "255"
  };
}

export interface FiretableRatingColumn extends FiretableBaseColumn {
  type: "RATING";
  config: {
    max?: number; // int 1-15
    precision?: number; // 0.25, 0.5, 0.75, 1
  };
}

export interface FiretableSelectColumn extends FiretableBaseColumn {
  type: "SINGLE_SELECT" | "MULTI_SELECT";
  config: {
    freeText?: boolean; // whether users can add options in-row
    options?: Array<string>;
  };
}

export interface FiretableSubTableColumn extends FiretableBaseColumn {
  type: "SUB_TABLE";
  config: {
    parentLabel?: Array<string>; // lets you choose multiple Select fields, not sure why
  };
}

export interface FiretableDocumentSelectColumn extends FiretableBaseColumn {
  type: "DOCUMENT_SELECT";
  config: {
    index: string; // Algolia index name, e.g. "[collection]"
    primaryKeys: Array<string>; // fieldsToSync from Algolia to use as display
    filters?: string;
  };
}

export interface FiretableServiceSelectColumn extends FiretableBaseColumn {
  type: "SERVICE_SELECT";
  config: {
    // TODO
  };
}

export interface FiretableActionColumn extends FiretableBaseColumn {
  type: "ACTION";
  config: {
    // TODO
  };
}

export interface FiretableDerivativeColumn extends FiretableBaseColumn {
  type: "DERIVATIVE";
  config: {
    listenerFields: Array<string>; // columnIds which trigger the derivative
    renderFieldType: FiretableColumnType; // value type
    script: string; // JS function body: (db: Firestore, row: DocumentData, ref: DocumentReference) => value
  };
}

export interface FiretableAggregateColumn extends FiretableBaseColumn {
  type: "AGGREGATE";
  config: {
    // TODO
  };
}

export interface FiretableNoConfigColumn extends FiretableBaseColumn {
  type:
    | "EMAIL"
    | "PHONE_NUMBER"
    | "CHECK_BOX"
    | "NUMBER"
    | "PERCENTAGE"
    | "DATE"
    | "DATE_TIME"
    | "DURATION"
    | "URL"
    | "IMAGE"
    | "FILE"
    | "JSON"
    | "CODE"
    | "RICH_TEXT"
    | "COLOR"
    | "SLIDER"
    | "USER"
    | "ID";
}

export type FiretableColumn =
  | FiretableTextColumn
  | FiretableRatingColumn
  | FiretableSelectColumn
  | FiretableSubTableColumn
  | FiretableDocumentSelectColumn
  | FiretableServiceSelectColumn
  | FiretableActionColumn
  | FiretableDerivativeColumn
  | FiretableAggregateColumn
  | FiretableNoConfigColumn;
