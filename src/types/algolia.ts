import { FiretableRecordDocumentSelect } from "./firetable-records";

export type AlgoliaIndex = {
  config: AlgoliaConfig;
  entries: {
    [objectID: string]: FiretableRecordDocumentSelect;
  };
};

export type AlgoliaConfig = {
  name: string; // "[collection]"
  subTable?: string; // "[subcollection]"
  fieldsToSync: Array<string>;
  requiredFields?: Array<string>;
  indices?: Array<{
    name: string;
    fieldsToSync: Array<string>;
  }>;
};
