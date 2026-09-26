const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx'); // Import the xlsx library
const { readExcelData_withoutheaders } = require('../Utils/excelUtils'); // Import Excel utility functions



test("multi dropdown with Excel values", async ({ page }) => {
    // Go to the webpage
    await page.goto("https://gotranscript.com/text-compare");
    //type
    await page.type('[name="text1"]','hi hello');
    //ctrl+A
    await page.keyboard.press('Control+A');
    //ctrl+C
    await page.keyboard.press('Control+C');
    //tab
    await page.keyboard.down('Tab');
    //ctrl+v
    await page.keyboard.press('Control+V');   
});


