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

type Kind = "raw" | "out";

export const getFilePath = (kind: Kind, id: string) => path.resolve("data", `${kind}-${id}.json`);

export const loadData = (kind: Kind, id: string) => readJson(getFilePath(kind, id));

type Data = AirtableSchema | AirtableData | FiretableSchema | AirtableData;

export const saveData = (kind: Kind, id: string, data: Data) =>
  writeJson(getFilePath(kind, id), data);
