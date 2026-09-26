const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('Built-in Locators', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToAlertsPage();

    page.once('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
    });
    await loginPage.clickAlertButton();

    page.once('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
    });
    await loginPage.clickConfirmButton();
    console.log(await loginPage.confirmMessage.textContent());

    await loginPage.clickModalButton();
    await expect(loginPage.modalHeading).toBeVisible();
    await expect(loginPage.modalText).toBeVisible();
    await loginPage.closeModal();
});
