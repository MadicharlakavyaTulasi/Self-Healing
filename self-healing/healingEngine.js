const {
    inspectElements,
    parseLocator,
    findCandidates,
    findBestCandidate,
    isConfident,
    generateLocator
} = require('../utils/domInspector');

async function tryOriginalLocator(page, locator, timeout = 3000) {
    try {
        await page.locator(locator).click({ timeout });
        return true;
    } catch (error) {
        return false;
    }
}

async function healLocator(page, originalLocator, options = {}) {
    const locatorInfo = parseLocator(originalLocator);
    const elements = await inspectElements(page);
    const candidates = findCandidates(elements, locatorInfo);
    const bestMatch = findBestCandidate(candidates, locatorInfo);
    const confident = isConfident(bestMatch.score, bestMatch.runnerUpScore);

    if (!confident || !bestMatch.candidate) {
        return {
            status: 'not-healed',
            success: false,
            originalLocator,
            healedLocator: null,
            score: bestMatch.score,
            runnerUpScore: bestMatch.runnerUpScore,
            candidate: bestMatch.candidate
        };
    }

    const healedLocator = generateLocator(bestMatch.candidate);
    try {
        await page.locator(healedLocator).click({ timeout: options.timeout ?? 3000 });
        return {
            status: 'healed',
            success: true,
            originalLocator,
            healedLocator,
            score: bestMatch.score,
            runnerUpScore: bestMatch.runnerUpScore,
            candidate: bestMatch.candidate
        };
    } catch (error) {
        return {
            status: 'failed',
            success: false,
            originalLocator,
            healedLocator,
            score: bestMatch.score,
            runnerUpScore: bestMatch.runnerUpScore,
            candidate: bestMatch.candidate,
            error: error.message
        };
    }
}

async function clickWithHealing(page, locator, options = {}) {
    const timeout = options.timeout ?? 3000;
    let result;

    if (await tryOriginalLocator(page, locator, timeout)) {
        result = {
            status: 'original',
            success: true,
            originalLocator: locator,
            healedLocator: null,
            score: 1,
            candidate: null
        };
    } else {
        result = await healLocator(page, locator, options);
    }

    if (typeof options.onEvent === 'function') {
        await options.onEvent({ ...result });
    }

    if (!result.success) {
        const detail = result.error ? `: ${result.error}` : '';
        const error = new Error(`Locator action failed: ${result.status} for ${locator}${detail}`);
        error.healingResult = result;
        throw error;
    }

    return result;
}

module.exports = {
    tryOriginalLocator,
    healLocator,
    clickWithHealing
};