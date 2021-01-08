export interface FiretableColumn {
  key: string;
  name: string;
  fieldName: string;
  index: number;
  type: FiretableField;
  config: object;
}

export type FiretableField =
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

export interface FiretableTextColumn extends FiretableColumn {
  type: "SIMPLE_TEXT" | "LONG_TEXT";
  config: {
    maxLength?: string; // "255"
  };
}

export interface FiretableRatingColumn extends FiretableColumn {
  type: "RATING";
  config: {
    max?: number; // int 1-15
    precision?: number; // 0.25, 0.5, 0.75, 1
  };
}

export interface FiretableSelectColumn extends FiretableColumn {
  type: "SINGLE_SELECT" | "MULTI_SELECT";
  config: {
    freeText?: boolean; // whether users can add options in-row
    options?: Array<string>;
  };
}

export interface FiretableSubTableColumn extends FiretableColumn {
  type: "SUB_TABLE";
  config: {
    parentLabel?: Array<string>; // lets you choose multiple Select fields, not sure why
  };
}

export interface FiretableDocumentSelectColumn extends FiretableColumn {
  type: "DOCUMENT_SELECT";
  config: {
    // TODO
  };
}

export interface FiretableServiceSelectColumn extends FiretableColumn {
  type: "SERVICE_SELECT";
  config: {
    // TODO
  };
}

export interface FiretableActionColumn extends FiretableColumn {
  type: "ACTION";
  config: {
    // TODO
  };
}

export interface FiretableDerivativeColumn extends FiretableColumn {
  type: "DERIVATIVE";
  config: {
    // TODO
  };
}

export interface FiretableAggregateColumn extends FiretableColumn {
  type: "AGGREGATE";
  config: {
    // TODO
  };
}

export interface FiretableNoConfigColumn extends FiretableColumn {
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
