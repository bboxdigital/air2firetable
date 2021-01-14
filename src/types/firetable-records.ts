export type FiretableRecords = Array<FiretableRecord>;

export type FiretableRecord = {
  id: string;
  fields: {
    [columnName: string]: FiretableRecordValue;
  };
};

export type FiretableRecordDocumentSelect = Array<{
  docPath: string; // '[collection]/[docId]'
  snapshot: {
    objectID: string; // '[docId]'
    [columnName: string]: FiretableRecordValue; // fieldsToSync from Algolia
  };
}>;

export type FiretableRecordFile = Array<{
  name: string; // fileName
  type: string; // MIME type
  ref: string; // '[collection]/[recordId]/[fieldName]/[fileName]',
  downloadURL: string; // 'https://firebasestorage.googleapis.com/v0/b/firetable-dev-985ff.appspot.com/o/test%2FfOSjlKe1U4OUOjND1fft%2Ffile%2FMy-Ideal-Week.pdf?alt=media&token=78612bf4-19d0-4adc-9418-c5fe624d5d38',
  lastModifiedTS: number; // 1583464757401
}>;

export type FiretableRecordValue =
  | FiretableRecordFile
  | string
  | number
  | boolean
  | object
  | Array<string | number>
  | null;
