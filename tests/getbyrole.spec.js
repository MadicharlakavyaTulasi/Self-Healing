const { test, expect } = require('@playwright/test');

test('Built-in Locators' ,async ({page})=>{
    //alert
    await page.goto("https://www.apollopharmacy.in/");
    const title = await page.title();
    console.log('title',title);
    const url = await page.url();
    console.log('url',url)
    await page.pause();
    await page.locator('a').filter({hasText:"Health"}).first().click();
        await page.waitForTimeout(5000)

     await page.getByRole('link', { name: 'Nutritional Drinks & Supplements' }).click();
     await page.getByText('Apollo Products').click();
     await page.getByLabel('Delivery Address');
    await page.waitForTimeout(2000)
    await page.screenshot({path:'screenshots/Delivery Address.png'})
    await page.locator('a').filter({hasNot})
});
