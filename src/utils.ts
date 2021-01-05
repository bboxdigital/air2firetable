import path from 'path';
import { readJson, writeJson } from 'fs-extra';
import dotenv from 'dotenv';
dotenv.config();

export const getEnv = (name: string): string | never => process.env[name] ??
                                                 (() => { throw new Error(`undefined .env variable: ${name}`); })();

type kindType = 'raw' | 'out';

export const getFilePath = (kind: kindType, id: string) => path.resolve('data', `${kind}-${id}.json`);

export const loadData = (kind: kindType, id: string) => readJson(getFilePath(kind, id));
export const saveData = (kind: kindType, id: string, data: object) => writeJson(getFilePath(kind, id), data);