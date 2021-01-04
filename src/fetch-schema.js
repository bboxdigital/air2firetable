const puppeteer = require('puppeteer');
const { saveRawSchema } = require('./utils');

const dataScript = () => {
  const data = {...application.tablesById};
  Object.keys(data).forEach(key => {
    data[key] = {...data[key]};
    data[key].columns = [...data[key].columns.map(column => { return {...column}; })];
    data[key].columns.forEach(column => {
      if (column.foreignTable && column.foreignTable.id) {
        column.foreignTable = column.foreignTable.id;
      }
    });
  });
  return data;
};

const fetchSchema = async (baseId, email, password) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`https://airtable.com/login?continue=/${baseId}/api/docs`);
  await page.waitForSelector('#sign-in-form-fields-root > div > label > div');
  await page.type(
    '#sign-in-form-fields-root > div > label > input[name="email"]',
    email
  );
  await page.type(
    '#sign-in-form-fields-root > div > label > input[name="password"]',
    password
  );
  await page.click(
    '#sign-in-form-fields-root > div > label > input[type="submit"]'
  );

  await page.waitForSelector('.docs > .languageTabs > .tab');
  const data = await page.evaluate(dataScript);
  await browser.close();

  await saveRawSchema(baseId, data);
};

module.exports = {
  fetchSchema
};