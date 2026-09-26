const { test, expect } = require('@playwright/test');
const { clickWithHealing } = require('../self-healing/healingEngine');

test('heals a broken input locator to a matching button and records the result', async ({ page }) => {
    await page.setContent('<button id="submit-action" onclick="document.body.dataset.clicked = \'yes\'">SUBMIT</button>');
    const events = [];

    const result = await clickWithHealing(page, "//input[@value='SUBMI']", {
        timeout: 1000,
        onEvent: event => events.push(event)
    });

    expect(result.status).toBe('healed');
    expect(result.candidate.tagName).toBe('BUTTON');
    expect(result.healedLocator).toBe("//button[@id='submit-action']");
    expect(await page.locator('body').getAttribute('data-clicked')).toBe('yes');
    expect(events).toHaveLength(1);
    expect(events[0].status).toBe('healed');
});

test('does not heal when the top candidates are ambiguous', async ({ page }) => {
    await page.setContent('<button>SUBMIT</button><a>SUBMIT</a>');
    const events = [];

    await expect(clickWithHealing(page, "//input[@value='SUBMI']", {
        timeout: 1000,
        onEvent: event => events.push(event)
    })).rejects.toThrow('Locator action failed: not-healed');

    expect(events[0].score).toBe(events[0].runnerUpScore);
});