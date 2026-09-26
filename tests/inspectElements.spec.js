const { test } = require('@playwright/test');

const {
    inspectElements
} = require('../utils/domInspector');


test('Inspect page elements', async ({ page }) => {

    await page.goto(
        'https://www.webdriveruniversity.com/Contact-Us/contactus.html'
    );

    const elements = await inspectElements(page);

    console.log(elements);
});