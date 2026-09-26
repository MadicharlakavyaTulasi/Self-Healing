const { test, expect } = require('@playwright/test');
 
test("Frames Test",async ({page})=>{
    await page.goto("https://www.hyrtutorials.com/p/frames-practice.html");
 
    // Switch to Frame 1
    const frame1 = page.frameLocator("xpath=//iframe[@id='frm1']");
    const course_dd = frame1.locator("xpath=//select[@id='course']"); // frame is selected and the element will be searched within the frame as per locator
    await course_dd.selectOption('Python');
    await expect(course_dd).toBeVisible('Python');
 
    // switch to main frame
    page.mainFrame();
    const textBox = page.locator("xpath=//input[@id='name']");
    await textBox.fill('frame1 is verified');
    //console.log(await textBox.innerText());
});
 
test("Actions Test",async({page})=>{
    await page.goto("https://webdriveruniversity.com/Actions/index.html#");
 
    // Drag and Drop
    const source = page.locator("xpath=//div[@id='draggable']");
    const target = page.locator("xpath=//div[@id='droppable']");
    await source.dragTo(target);
 
    // Double-Click
    await page.locator("xpath=//div[@id='double-click']").dblclick();
 
    // Mouse Hover
    await page.getByRole('button',{name : 'Hover Over Me First!'}).hover();
    page.once('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();  
    });
    await page.getByRole('link',{name : 'Link'}).click();
});
