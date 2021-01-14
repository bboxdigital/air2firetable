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
