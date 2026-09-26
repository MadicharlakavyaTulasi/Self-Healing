const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('contactus Page valid Test', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goToContactUs();

    await loginPage.fillContactUsForm({
        firstName: 'Kavya',
        lastName: 'Tulasi',
        email: 'kavya23@gmail.com',
        comments: 'hello'
    });

    await loginPage.submitContactUs();
    await expect(loginPage.successMessage).toContainText('Thank You for your Message!');

    await page.waitForTimeout(5000);
});