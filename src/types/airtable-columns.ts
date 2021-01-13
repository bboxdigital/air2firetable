export interface AirtableBaseColumn {
  id: string;
  name: string;
  type: AirtableColumnType;
  typeOptions: object | null;
}

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

export interface AirtableTextColumn extends AirtableBaseColumn {
  type: "text";
  typeOptions: {
    validatorName: "url" | "email"; // others?
  } | null;
}

export interface AirtableMultilineTextColumn extends AirtableBaseColumn {
  type: "multilineText";
  typeOptions: null;
}

export interface AirtableCheckboxColumn extends AirtableBaseColumn {
  type: "checkbox";
  typeOptions: {
    color: AirtableColor;
    icon: "check"; // others?
  };
}

export interface AirtableNumberColumn extends AirtableBaseColumn {
  type: "number";
  typeOptions: {
    format: "integer"; // others?
    negative: boolean;
    validatorName?: "positive"; // others?
  };
}

export interface AirtableDateColumn extends AirtableBaseColumn {
  type: "date";
  typeOptions: {
    isDateTime: boolean;
    dateFormat: "ISO"; // others?
  };
}

export interface AirtableMultipleAttachmentColumn extends AirtableBaseColumn {
  type: "multipleAttachment";
  typeOptions: {
    unreversed: boolean;
  };
}

export interface AirtableSelectColumn extends AirtableBaseColumn {
  type: "select";
  typeOptions: AirtableSelectTypeOptions;
}

export interface AirtableMultiSelectColumn extends AirtableBaseColumn {
  type: "multiSelect";
  typeOptions: AirtableSelectTypeOptions;
}

export type AirtableSelectTypeOptions = {
  choiceOrder: Array<string>; // choiceIds
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

export interface AirtableForeignKeyColumn extends AirtableBaseColumn {
  type: "foreignKey";
  typeOptions: {
    foreignTableId: string;
    symmetricColumnId: string;
    relationship: "many" | "one";
    unreversed: boolean;
  };
  foreignTable: string; // id
}

export interface AirtableLookupColumn extends AirtableBaseColumn {
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
}

export interface AirtableRichTextColumn extends AirtableBaseColumn {
  type: "richText";
  typeOptions: null;
}

export interface AirtableRollupColumn extends AirtableBaseColumn {
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
}

export interface AirtableFormulaColumn extends AirtableBaseColumn {
  type: "formula";
  typeOptions: {
    formulaTextParsed: string;
    dependencies: {
      referencedColumnIdsForValue: Array<string>;
    };
    resultType: AirtableColumnType;
  };
}

export interface AirtableAutoNumberColumn extends AirtableBaseColumn {
  type: "autoNumber";
  typeOptions: {
    maxUsedAutoNumber: number;
  };
}

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
