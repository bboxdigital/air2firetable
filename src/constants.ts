import { AirtableColumnType } from "./types/airtable-columns";
import { FiretableColumnType } from "./types/firetable-columns";

export const fieldMap: { [field in AirtableColumnType]: FiretableColumnType } = {
  autoNumber: "NUMBER",
  text: "SIMPLE_TEXT",
  number: "NUMBER",
  select: "SINGLE_SELECT",
  multilineText: "LONG_TEXT",
  multiSelect: "MULTI_SELECT",
  richText: "RICH_TEXT",
  foreignKey: "DOCUMENT_SELECT",
  multipleAttachment: "FILE",
  lookup: "JSON", // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
  date: "DATE",
  rollup: "JSON", // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
  checkbox: "CHECK_BOX",
  formula: "JSON", // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
};
Object.freeze(fieldMap);
