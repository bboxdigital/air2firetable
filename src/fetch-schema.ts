import puppeteer from "puppeteer";
import { getAirtableSchema } from "./puppeteer-scripts";
import { RawSchema } from "./types";
import { saveData } from "./utils";

export const fetchSchema = async (baseId: string, email: string, password: string) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`https://airtable.com/login?continue=/${baseId}/api/docs`);
  await page.waitForSelector("#sign-in-form-fields-root > div > label > div");
  await page.type('#sign-in-form-fields-root > div > label > input[name="email"]', email);
  await page.type('#sign-in-form-fields-root > div > label > input[name="password"]', password);
  await page.click('#sign-in-form-fields-root > div > label > input[type="submit"]');

  await page.waitForSelector(".docs > .languageTabs > .tab");
  const rawSchema: RawSchema = await page.evaluate(getAirtableSchema);
  await browser.close();

  await saveData("raw", baseId, rawSchema);
};
