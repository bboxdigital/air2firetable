import path from "path";
import { readJson, writeJson } from "fs-extra";
import dotenv from "dotenv";
import { AirtableRecords, AirtableSchema } from "./types/airtable";
import { FiretableSchema, FiretableRecords } from "./types/firetable";
dotenv.config();

export const getEnv = (name: "BASE_ID" | "AIRTABLE_KEY"): string | never =>
  process.env[name] ??
  (() => {
    throw new Error(`undefined .env variable: ${name}`);
  })();

export enum Prefix {
  Airtable = "airtable",
  Firetable = "firetable",
}

export const getFilePath = (prefix: Prefix, id: string) =>
  path.resolve("data", `${prefix}-${id}.json`);

export const loadFile = (prefix: Prefix, id: string) => readJson(getFilePath(prefix, id));

type Data = AirtableSchema | AirtableRecords | FiretableSchema | FiretableRecords;

type SaveFile = {
  (prefix: Prefix.Airtable, id: string, data: AirtableSchema | AirtableRecords): Promise<void>;
  (prefix: Prefix.Firetable, id: string, data: FiretableSchema | FiretableRecords): Promise<void>;
};

export const saveFile: SaveFile = (prefix: Prefix, id: string, data: Data) =>
  writeJson(getFilePath(prefix, id), data);
