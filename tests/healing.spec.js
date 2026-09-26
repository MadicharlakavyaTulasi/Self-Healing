const { test, expect } = require('@playwright/test');
const { clickWithHealing, fillWithHealing } = require('../self-healing/healingEngine');

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

test('heals an unsupported selector using an explicit hint', async ({ page }) => {
    await page.setContent('<button id="submit-action" onclick="document.body.dataset.clicked = \'yes\'">SUBMIT</button>');

    const result = await clickWithHealing(page, 'button.old-submit:nth-child(2)', {
        hint: 'SUBMIT',
        timeout: 1000
    });

    expect(result.status).toBe('healed');
    expect(result.hint).toBe('SUBMIT');
    expect(result.candidate.tagName).toBe('BUTTON');
    expect(await page.locator('body').getAttribute('data-clicked')).toBe('yes');
});

test('accepts a Playwright Locator with an explicit hint', async ({ page }) => {
    await page.setContent('<button id="submit-action">SUBMIT</button>');

    const result = await clickWithHealing(page, page.locator('button.old-submit'), {
        hint: 'SUBMIT',
        timeout: 1000
    });

    expect(result.status).toBe('healed');
    expect(result.originalLocator).toBe('<Playwright Locator>');
    expect(result.candidate.tagName).toBe('BUTTON');
});

test('heals a broken placeholder locator and fills its matching input', async ({ page }) => {
    await page.setContent('<input id="first-name" placeholder="First Name">');

    const result = await fillWithHealing(
        page,
        page.locator('//input[@placeholder="First Na"]'),
        'Kavya',
        { hint: 'First Name', timeout: 1000 }
    );

    expect(result.status).toBe('healed');
    expect(result.action).toBe('fill');
    expect(result.candidate.tagName).toBe('INPUT');
    expect(await page.locator('#first-name').inputValue()).toBe('Kavya');
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