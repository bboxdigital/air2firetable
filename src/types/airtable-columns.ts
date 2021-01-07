export type AirtableBaseColumn = {
  id: string;
  name: string;
  type: AirtableColumnType;
  typeOptions: object | null;
};

export type AirtableColumnType =
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

export type AirtableTextColumn = AirtableBaseColumn & {
  type: "text";
  typeOptions: {
    validatorName: "url" | "email" | string;
  } | null;
};

export type AirtableMultilineTextColumn = AirtableBaseColumn & {
  type: "multilineText";
  typeOptions: null;
};

export type AirtableCheckboxColumn = AirtableBaseColumn & {
  type: "checkbox";
  typeOptions: {
    color: AirtableColor;
    icon: "check" | string;
  };
};

export type AirtableNumberColumn = AirtableBaseColumn & {
  type: "number";
  typeOptions: {
    format: "integer" | string;
    negative: boolean;
    validatorName?: "positive" | string;
  };
};

export type AirtableDateColumn = AirtableBaseColumn & {
  type: "date";
  typeOptions: {
    isDateTime: boolean;
    dateFormat: "ISO" | string;
  };
};

export type AirtableMultipleAttachmentColumn = AirtableBaseColumn & {
  type: "multipleAttachment";
  typeOptions: {
    unreversed: boolean;
  };
};

export type AirtableSelectColumn = AirtableBaseColumn & {
  type: "select";
  typeOptions: AirtableSelectTypeOptions;
};

export type AirtableMultiSelectColumn = AirtableBaseColumn & {
  type: "multiSelect";
  typeOptions: AirtableSelectTypeOptions;
};

export type AirtableSelectTypeOptions = {
  choiceOrder: Array<string>;
  choices: {
    [choiceId: string]: AirtableSelectChoice;
  };
  disableColors?: boolean;
};

export type AirtableSelectChoice = {
  id: string;
  color: AirtableColor;
  name: string;
};

export type AirtableForeignKeyColumn = AirtableBaseColumn & {
  type: "foreignKey";
  typeOptions: {
    foreignTableId: string;
    symmetricColumnId: string;
    relationship: "many" | "one";
    unreversed: boolean;
  };
  foreignTable: string; // id
};

export type AirtableLookupColumn = AirtableBaseColumn & {
  type: "lookup";
  typeOptions: {
    relationColumnId: string;
    foreignTableRollupColumnId: string;
    unreversed: boolean;
    dependencies: {
      referencedColumnIdsForValue: Array<string>;
    };
    resultType: AirtableColumnType;
  };
  foreignTableName: string;
  foreignTableRollupColumnName: string;
};

export type AirtableRichTextColumn = AirtableBaseColumn & {
  type: "richText";
  typeOptions: null;
};

export type AirtableRollupColumn = AirtableBaseColumn & {
  type: "rollup";
  typeOptions: {
    relationColumnId: string;
    foreignTableRollupColumnId: string;
    formulaTextParsed: string;
    dependencies: {
      referencedColumnIdsForValue: Array<string>;
    };
    resultType: AirtableColumnType;
  };
  foreignTableName: string;
  foreignTableRollupColumnName: string;
};

export type AirtableFormulaColumn = AirtableBaseColumn & {
  type: "formula";
  typeOptions: {
    formulaTextParsed: string;
    dependencies: {
      referencedColumnIdsForValue: Array<string>;
    };
    resultType: AirtableColumnType;
  };
};

export type AirtableAutoNumberColumn = AirtableBaseColumn & {
  type: "autoNumber";
  typeOptions: {
    maxUsedAutoNumber: number;
  };
};

export type AirtableColumn =
  | AirtableTextColumn
  | AirtableMultilineTextColumn
  | AirtableCheckboxColumn
  | AirtableNumberColumn
  | AirtableDateColumn
  | AirtableMultipleAttachmentColumn
  | AirtableSelectColumn
  | AirtableMultiSelectColumn
  | AirtableForeignKeyColumn
  | AirtableLookupColumn
  | AirtableRichTextColumn
  | AirtableRollupColumn
  | AirtableFormulaColumn
  | AirtableAutoNumberColumn;

export type AirtableColor =
  | "blue"
  | "blueMedium"
  | "blueDark"
  | "blueDarker"
  | "cyan"
  | "cyanMedium"
  | "cyanDark"
  | "cyanDarker"
  | "gray"
  | "grayMedium"
  | "grayDark"
  | "grayDarker"
  | "green"
  | "greenMedium"
  | "greenDark"
  | "greenDarker"
  | "orange"
  | "orangeMedium"
  | "orangeDark"
  | "orangeDarker"
  | "pink"
  | "pinkMedium"
  | "pinkDark"
  | "pinkDarker"
  | "purple"
  | "purpleMedium"
  | "purpleDark"
  | "purpleDarker"
  | "red"
  | "redMedium"
  | "redDark"
  | "redDarker"
  | "teal"
  | "tealMedium"
  | "tealDark"
  | "tealDarker"
  | "yellow"
  | "yellowMedium"
  | "yellowDark"
  | "yellowDarker";
