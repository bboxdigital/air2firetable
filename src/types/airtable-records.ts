export type AirtableRecords = Array<AirtableRecord>;

export type AirtableRecord = {
  id: string;
  fields: {
    [columnName: string]: AirtableRecordValue;
  };
};

export type AirtableRecordForeignKey = Array<string>; // [ 'recxLter7QYPTgaKq' ]

export type AirtableRecordMultipleAttachment = Array<{
  id: string; // 'attH2tyCFfHElsBx3'
  url: string;
  filename: string;
  size: number; // 1220205 (bytes)
  type: string; // MIME type
  thumbnails?: {
    small: AirtableRecordThumbnail;
    large: AirtableRecordThumbnail;
  };
}>;

export type AirtableRecordThumbnail = {
  url: string;
  width: number;
  height: number;
};

export type AirtableRecordValue =
  | AirtableRecordForeignKey
  | AirtableRecordMultipleAttachment
  | string
  | number
  | boolean
  | object
  | Array<string | number>
  | null;
