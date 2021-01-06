import { AirtableField, FiretableField } from "./types";

export const fieldMap: { [field in AirtableField]: FiretableField } = {
  // see: https://github.com/AntlerVC/firetable/blob/master/www/src/constants/fields.tsx
  autoNumber: "NUMBER", // automatically generates a unique, automatically incremented number
  text: "SIMPLE_TEXT",
  number: "NUMBER",
  select: "SINGLE_SELECT",
  multilineText: "LONG_TEXT",
  multiSelect: "MULTI_SELECT",
  richText: "RICH_TEXT",
  foreignKey: "JSON", // [ 'recxLter7QYPTgaKq' ],
  multipleAttachment:
    "JSON" /* [
                {
                  id: 'att4eybld3qlhFfIK',
                  url: 'https://cdn.filestackcontent.com/F94oVb05QbmCZlMZeWeJ',
                  filename: 'Briser_le_code_document_enseignant.pdf',
                  type: 'application/pdf'
                }
              ] */,
  lookup: "JSON", // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
  date: "DATE",
  rollup: "JSON", // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
  checkbox: "CHECK_BOX",
  formula: "JSON", // described in column.typeOptions, value is pre-calculated column.typeOptions.resultType
};
Object.freeze(fieldMap);
