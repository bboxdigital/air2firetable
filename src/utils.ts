import path from "path";
import { readJson, writeJson } from "fs-extra";
import dotenv from "dotenv";
import { AirtableData, FiretableSchema, AirtableSchema } from "./types";
dotenv.config();

export const getEnv = (name: "BASE_ID" | "AIRTABLE_KEY"): string | never =>
  process.env[name] ??
  (() => {
    throw new Error(`undefined .env variable: ${name}`);
  })();

export enum Prefix {
  Air = "air",
  Fire = "fire",
}

export const getFilePath = (prefix: Prefix, id: string) =>
  path.resolve("data", `${prefix}-${id}.json`);

export const loadData = (prefix: Prefix, id: string) => readJson(getFilePath(prefix, id));

type Data = AirtableSchema | AirtableData | FiretableSchema | AirtableData;

export const saveData = (prefix: Prefix, id: string, data: Data) =>
  writeJson(getFilePath(prefix, id), data);
