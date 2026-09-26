const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('Dropdowns handling', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToDropdownPage();
    await loginPage.selectCourse('Python');
    await expect(loginPage.courseDropdown).toBeVisible();
    await expect(loginPage.courseDropdown).toHaveValue('python');

    await loginPage.selectIde('junit');
    await expect(loginPage.ideDropdown).toHaveValue('junit');

    await loginPage.selectFrontend('javascript');
    await expect(loginPage.frontendDropdown).toHaveValue('javascript');

    await loginPage.selectYellowRadio();
    await expect(loginPage.yellowRadio).toBeChecked();

    await loginPage.checkOptionOne();
    await expect(loginPage.optionOne).toBeChecked();

    await loginPage.checkOptionTwo();
    await expect(loginPage.optionTwo).toBeChecked();

    await expect(loginPage.cabbageRadio).toBeDisabled();
    await expect(loginPage.fruitSelect).toBeVisible();
});

