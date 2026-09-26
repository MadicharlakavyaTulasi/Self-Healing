const { test, expect } = require('@playwright/test');
const path = require('path');
const { LoginPage } = require('../pages/LoginPage');

test('Uploading file', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToUploadPage();
    await loginPage.fileUpload.click();
    await loginPage.fileUpload.setInputFiles(path.join(__dirname, 'sample.txt'));

    await page.screenshot({ path: 'fileupload_ss.png' });
    await loginPage.fileUpload.screenshot({ path: 'elementscreenshot.png' });

    page.once('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
    });

    await loginPage.submitUpload();
    await page.screenshot({ path: 'fullscreenshot.png', fullPage: true });
});
