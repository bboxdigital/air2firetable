import path from "path";
import { readJson, writeJson } from "fs-extra";
import dotenv from "dotenv";
import { AirtableSchema } from "./types/airtable";
import { AirtableRecords } from "./types/airtable-records";
import { FiretableSchema } from "./types/firetable";
import { FiretableRecords } from "./types/firetable-records";
import { AlgoliaIndex } from "./types/algolia";
dotenv.config();

export const getEnv = (name: "AIRTABLE_BASE_ID" | "AIRTABLE_API_KEY" | "FIREBASE_ADMINSDK"): string | never =>
  process.env[name] ??
  (() => {
    throw new Error(`undefined .env variable: ${name}`);
  })();

export enum Prefix {
  Airtable = "airtable",
  Firetable = "firetable",
  Algolia = "algolia",
}

export const getFilePath = (prefix: Prefix, id: string) => path.resolve("data", `${prefix}-${id}.json`);

export const loadFile = (prefix: Prefix, id: string) => readJson(getFilePath(prefix, id));

type Data = AirtableSchema | AirtableRecords | FiretableSchema | FiretableRecords | AlgoliaIndex;

type SaveFile = {
  (prefix: Prefix.Airtable, id: string, data: AirtableSchema | AirtableRecords): Promise<void>;
  (prefix: Prefix.Firetable, id: string, data: FiretableSchema | FiretableRecords): Promise<void>;
  (prefix: Prefix.Algolia, id: string, data: AlgoliaIndex): Promise<void>;
};

export const saveFile: SaveFile = (prefix: Prefix, id: string, data: Data) => writeJson(getFilePath(prefix, id), data);
