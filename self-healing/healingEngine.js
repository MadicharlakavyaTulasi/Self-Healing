const {
    inspectElements,
    parseLocator,
    findCandidates,
    findBestCandidate,
    isConfident,
    generateLocator
} = require('../utils/domInspector');

function getLocator(page, locator) {
    return typeof locator === 'string' ? page.locator(locator) : locator;
}

async function performAction(target, action, value, timeout) {
    if (action === 'click') {
        await target.click({ timeout });
        return;
    }
    if (action === 'fill') {
        await target.fill(value, { timeout });
        return;
    }

    throw new Error(`Unsupported healing action: ${action}`);
}

async function tryOriginalAction(page, locator, action, value, timeout) {
    try {
        await performAction(getLocator(page, locator), action, value, timeout);
        return true;
    } catch (error) {
        return false;
    }
}

async function tryOriginalLocator(page, locator, timeout = 3000) {
    return tryOriginalAction(page, locator, 'click', undefined, timeout);
}

async function healAction(page, originalLocator, action, value, options = {}) {
    const locatorInfo = options.hint
        ? { tag: options.tag?.toLowerCase() || null, attribute: 'text', value: options.hint }
        : parseLocator(originalLocator);
    const originalLabel = typeof originalLocator === 'string' ? originalLocator : '<Playwright Locator>';
    const elements = await inspectElements(page);
    const candidates = findCandidates(elements, locatorInfo);
    const bestMatch = findBestCandidate(candidates, locatorInfo);
    const confident = isConfident(bestMatch.score, bestMatch.runnerUpScore);

    if (!confident || !bestMatch.candidate) {
        return {
            status: 'not-healed',
            success: false,
            action,
            originalLocator: originalLabel,
            hint: options.hint || null,
            healedLocator: null,
            score: bestMatch.score,
            runnerUpScore: bestMatch.runnerUpScore,
            candidate: bestMatch.candidate
        };
    }

    const healedLocator = generateLocator(bestMatch.candidate);
    try {
        await performAction(page.locator(healedLocator), action, value, options.timeout ?? 3000);
        return {
            status: 'healed',
            success: true,
            action,
            originalLocator: originalLabel,
            hint: options.hint || null,
            healedLocator,
            score: bestMatch.score,
            runnerUpScore: bestMatch.runnerUpScore,
            candidate: bestMatch.candidate
        };
    } catch (error) {
        return {
            status: 'failed',
            success: false,
            action,
            originalLocator: originalLabel,
            hint: options.hint || null,
            healedLocator,
            score: bestMatch.score,
            runnerUpScore: bestMatch.runnerUpScore,
            candidate: bestMatch.candidate,
            error: error.message
        };
    }
}

async function healLocator(page, originalLocator, options = {}) {
    return healAction(page, originalLocator, 'click', undefined, options);
}

async function performWithHealing(page, locator, action, value, options = {}) {
    const timeout = options.timeout ?? 3000;
    const originalLabel = typeof locator === 'string' ? locator : '<Playwright Locator>';
    let result;

    if (await tryOriginalAction(page, locator, action, value, timeout)) {
        result = {
            status: 'original',
            success: true,
            action,
            originalLocator: originalLabel,
            hint: options.hint || null,
            healedLocator: null,
            score: 1,
            candidate: null
        };
    } else {
        result = await healAction(page, locator, action, value, options);
    }

    if (typeof options.onEvent === 'function') {
        await options.onEvent({ ...result });
    }

    if (!result.success) {
        const detail = result.error ? `: ${result.error}` : '';
        const error = new Error(`Locator action failed: ${result.status} for ${originalLabel}${detail}`);
        error.healingResult = result;
        throw error;
    }

    return result;
}

async function clickWithHealing(page, locator, options = {}) {
    return performWithHealing(page, locator, 'click', undefined, options);
}

async function fillWithHealing(page, locator, value, options = {}) {
    return performWithHealing(page, locator, 'fill', value, options);
}

module.exports = {
    tryOriginalLocator,
    healLocator,
    clickWithHealing,
    fillWithHealing
};