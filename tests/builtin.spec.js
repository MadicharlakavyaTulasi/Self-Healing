const { test, expect } = require('@playwright/test');

test('Built-in Locators' ,async ({page})=>{
    //alt-text
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    const logo = await page.getByAltText('company-branding');
    await expect(logo).toBeVisible();
    //placeholder
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    //role
    await page.getByRole('button',{type: 'submit'}).click();
    //checking
    const successmsg = await page.locator('//h6');
    console.log(await successmsg.textContent());
    await soft.expect(successmsg).toBeVisible('Dashboard');
    await soft.expect(await page.getByText('Thanh Vo')).toBeVisible();
    const name = await page.locator('//p[@class="oxd-userdropdown-name"]').textContent();
    console.log(name);
    await expect(await page.getByText(name)).toBeVisible();
    try{
        await expect(await page.getByText('Thanhdfsd')).toBeVisible();
    
    }
    catch(error){
        console.log(error);
    }

});
