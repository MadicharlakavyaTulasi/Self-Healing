const {test, expect } = require('@playwright/test');

test('Assertions Practice', async ({page})=>{
    await page.goto("https://demo.nopcommerce.com/register");
    //1.expect(page).toHaveURL("link")
    //1.1 expect(page).not.toHaveURL("link")

    await expect(page).toHaveURL("https://demo.nopcommerce.com/register");
    //to find url
    const a = page.url()
    console.log("page url:",a)
    //2.expect(page).toHaveTitle("text")
    await expect(page).toHaveTitle("nopCommerce demo store. Register");
    const b = await page.title();
    console.log("title:",b);
    //3.expect(locator).toBeVisible
    const c = await page.locator(".header-logo")
    await expect(c).toBeVisible();
    //4.expect("locator").toBeEnabled()
    const d = await page.locator("#small-searchterms")
    await expect(d).toBeEnabled();
    console.log(d)
    //5.expect("locator").tobeChecked
    const e = await page.locator("#gender-male");
    await e.click();
    await expect(e).toBeChecked();
    //check box
    const f =  await page.locator("#Newsletter");
    // await f.click();
    await expect(f).toBeChecked();
    //6.expect("loc").toHaveAttribute()
    const g = await page.locator("#Password");
    await expect(g).toHaveAttribute('name','Password')
    //7.expect("loc").toHaveText()
    const h = await page.locator("//div[@class='page-title']/h1")
    await expect(h).toHaveText('Register')
    //8.expect("loc").toContainText()
    await expect(h).toContainText('Reg')
    //9.expect("loc").toHaveValue()
    // const i = await page.locator("#Email")
    // await i.fill('sample@gmail.com');
    //10.await expect(i).toHaveValue()
    //
    const i = await page.locator("select[name='DateOfBirthMonth'] option")
    await expect(i).toHaveCount(13);
});
