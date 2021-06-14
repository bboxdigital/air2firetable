#!/usr/bin/env node

import firebase from "firebase-admin";
import { readJsonSync } from "fs-extra";
import { getEnv } from "./utils";
const firebaseAdminSDK = process.env.FIREBASE_ADMINSDK || getEnv("FIREBASE_ADMINSDK");
if (!firebaseAdminSDK) {
  throw new Error("Unable to determine Firebase Admin SDK file!");
}
// console.log(`Using: ${firebaseAdminSDK}`);
const serviceAccount = readJsonSync(firebaseAdminSDK);
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

import { hooks } from "./hooks";
import { plugin } from "./plugins/air2firetable-tqec/plugin";
for (const hook of Object.keys(plugin)) {
  // @ts-ignore
  for (const handler of plugin[hook]) {
    // @ts-ignore
    hooks[hook].push(handler);
  }
}

import { fetchSchema } from "./fetch-schema";
import { fetchTables } from "./fetch-tables";
import { processAlgolia } from "./process-algolia";
import { processSchema } from "./process-schema";
import { processTables } from "./process-tables";
import { importSchema } from "./import-schema";
import { importTables } from "./import-tables";

const runOrder: Array<[string, () => Promise<any>]> = [
  // ["fetchSchema", async () => await fetchSchema(getEnv("AIRTABLE_BASE_ID"), getEnv("AIRTABLE_EMAIL"), getEnv("AIRTABLE_PASSWORD"))],
  ["fetchTables", async () => fetchTables(getEnv("AIRTABLE_BASE_ID"), getEnv("AIRTABLE_API_KEY"))],
  ["processAlgolia", async () => processAlgolia(getEnv("AIRTABLE_BASE_ID"))],
  ["processSchema", async () => processSchema(getEnv("AIRTABLE_BASE_ID"))],
  ["processTables", async () => processTables(getEnv("AIRTABLE_BASE_ID"))],
  ["importSchema", async () => importSchema(getEnv("AIRTABLE_BASE_ID"), firebase.firestore())],
  ["importTables", async () => importTables(getEnv("AIRTABLE_BASE_ID"), firebase.firestore())],
];

const run = async () => {
  const firestore = firebase.firestore();
  const stateDoc = firestore.collection("_AIR2FIRETABLE_").doc("state");
  const state = await stateDoc.get().then((doc) => doc.data());
  if (state && state.value === "RUN") {
    for (const item of runOrder) {
      console.log(`RUNNING: ${item[0]}`);
      await stateDoc.set({ value: `RUNNING: ${item[0]}` });
      await item[1]();
    }
    await stateDoc.set({ value: "DONE" });
    console.log("DONE");
  }
};

run();
