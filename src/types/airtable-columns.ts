export interface AirtableColumn {
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

export interface AirtableTextColumn extends AirtableColumn {
  type: "text";
  typeOptions: {
    validatorName: "url" | "email" | string;
  } | null;
}

export interface AirtableMultilineTextColumn extends AirtableColumn {
  type: "multilineText";
  typeOptions: null;
}

export interface AirtableCheckboxColumn extends AirtableColumn {
  type: "checkbox";
  typeOptions: {
    color: AirtableColor;
    icon: "check" | string;
  };
}

export interface AirtableNumberColumn extends AirtableColumn {
  type: "number";
  typeOptions: {
    format: "integer" | string;
    negative: boolean;
    validatorName?: "positive" | string;
  };
}

export interface AirtableDateColumn extends AirtableColumn {
  type: "date";
  typeOptions: {
    isDateTime: boolean;
    dateFormat: "ISO" | string;
  };
}

export interface AirtableMultipleAttachmentColumn extends AirtableColumn {
  type: "multipleAttachment";
  typeOptions: {
    unreversed: boolean;
  };
}

export interface AirtableSelectColumn extends AirtableColumn {
  type: "select";
  typeOptions: AirtableSelectTypeOptions;
}

export interface AirtableMultiSelectColumn extends AirtableColumn {
  type: "multiSelect";
  typeOptions: AirtableSelectTypeOptions;
}

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

export interface AirtableForeignKeyColumn extends AirtableColumn {
  type: "foreignKey";
  typeOptions: {
    foreignTableId: string;
    symmetricColumnId: string;
    relationship: "many" | "one";
    unreversed: boolean;
  };
  foreignTable: string; // id
}

export interface AirtableLookupColumn extends AirtableColumn {
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

export interface AirtableRichTextColumn extends AirtableColumn {
  type: "richText";
  typeOptions: null;
}

export interface AirtableRollupColumn extends AirtableColumn {
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

export interface AirtableFormulaColumn extends AirtableColumn {
  type: "formula";
  typeOptions: {
    formulaTextParsed: string;
    dependencies: {
      referencedColumnIdsForValue: Array<string>;
    };
    resultType: AirtableColumnType;
  };
}

export interface AirtableAutoNumberColumn extends AirtableColumn {
  type: "autoNumber";
  typeOptions: {
    maxUsedAutoNumber: number;
  };
}

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
