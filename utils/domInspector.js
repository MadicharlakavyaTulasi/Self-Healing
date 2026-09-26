const INSPECTABLE_SELECTOR = 'input, button, textarea, select, a, [role="button"], [role="link"]';
const MATCH_ATTRIBUTES = ['id', 'name', 'value', 'placeholder', 'ariaLabel', 'title', 'text'];

async function inspectElements(page) {
    const elements = await page.locator(INSPECTABLE_SELECTOR).evaluateAll(nodes =>
        nodes.map(element => ({
            tagName: element.tagName,
            id: element.getAttribute('id'),
            name: element.getAttribute('name'),
            className: element.getAttribute('class'),
            type: element.getAttribute('type'),
            value: element.getAttribute('value') || element.value || null,
            placeholder: element.getAttribute('placeholder'),
            ariaLabel: element.getAttribute('aria-label'),
            title: element.getAttribute('title'),
            testId: element.getAttribute('data-testid'),
            role: element.getAttribute('role'),
            text: (element.innerText || element.textContent || '').trim()
        }))
    );

    return elements;
}

async function inspectInputs(page) {
    return (await inspectElements(page)).filter(element => element.tagName.toLowerCase() === 'input');
}

function parseLocator(locator) {
    if (typeof locator !== 'string') {
        return null;
    }

    const xpathMatch = locator.match(/\/\/([\w-]+)\s*\[\s*@([\w:-]+)\s*=\s*(['"])(.*?)\3\s*\]/);
    if (xpathMatch) {
        return { tag: xpathMatch[1].toLowerCase(), attribute: xpathMatch[2], value: xpathMatch[4] };
    }

    const attributeMatch = locator.match(/\[([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\]]+))\]/);
    if (attributeMatch) {
        return {
            tag: (locator.match(/^\s*([\w-]+)/) || [])[1]?.toLowerCase() || null,
            attribute: attributeMatch[1],
            value: (attributeMatch[2] ?? attributeMatch[3] ?? attributeMatch[4]).trim()
        };
    }

    const idMatch = locator.match(/#([\w-]+)/);
    if (idMatch) {
        return { tag: null, attribute: 'id', value: idMatch[1] };
    }

    const textMatch = locator.match(/(?:text=|:has-text\(['"])([^'")]+)['"]?\)?/);
    if (textMatch) {
        return { tag: (locator.match(/^\s*([\w-]+)/) || [])[1]?.toLowerCase() || null, attribute: 'text', value: textMatch[1].trim() };
    }

    return null;
}

function findCandidates(elements, locatorInfo) {
    if (!locatorInfo?.value) {
        return [];
    }

    return elements.filter(element => MATCH_ATTRIBUTES.some(attribute =>
        typeof element[attribute] === 'string' && element[attribute].trim().length > 0
    ));
}

function calculateSimilarity(originalValue, candidateValue) {
    if (typeof originalValue !== 'string' || typeof candidateValue !== 'string') {
        return 0;
    }

    const original = originalValue.trim().toLowerCase();
    const candidate = candidateValue.trim().toLowerCase();
    if (!original || !candidate) {
        return 0;
    }

    const previous = Array.from({ length: candidate.length + 1 }, (_, index) => index);
    for (let row = 1; row <= original.length; row++) {
        const current = [row];
        for (let column = 1; column <= candidate.length; column++) {
            current[column] = Math.min(
                current[column - 1] + 1,
                previous[column] + 1,
                previous[column - 1] + (original[row - 1] === candidate[column - 1] ? 0 : 1)
            );
        }
        previous.splice(0, previous.length, ...current);
    }

    return 1 - previous[candidate.length] / Math.max(original.length, candidate.length);
}

function candidateScore(candidate, locatorInfo) {
    const fields = locatorInfo.attribute === 'text'
        ? ['text', ...MATCH_ATTRIBUTES.filter(attribute => attribute !== 'text')]
        : [locatorInfo.attribute, ...MATCH_ATTRIBUTES].filter((attribute, index, all) => all.indexOf(attribute) === index);
    let score = 0;

    for (const field of fields) {
        const candidateValue = candidate[field] ?? (field === 'aria-label' ? candidate.ariaLabel : null);
        score = Math.max(score, calculateSimilarity(locatorInfo.value, candidateValue));
    }

    if (locatorInfo.tag && candidate.tagName.toLowerCase() === locatorInfo.tag) {
        score = Math.min(1, score + 0.02);
    }

    return score;
}

function findBestCandidate(candidates, locatorInfo) {
    const info = typeof locatorInfo === 'string'
        ? { tag: null, attribute: 'value', value: locatorInfo }
        : locatorInfo;
    if (!info?.value) {
        return { candidate: null, score: 0, runnerUpScore: 0, margin: 0 };
    }

    const ranked = candidates
        .map(candidate => ({ candidate, score: candidateScore(candidate, info) }))
        .sort((left, right) => right.score - left.score);
    const best = ranked[0];
    const runnerUpScore = ranked[1]?.score || 0;

    return {
        candidate: best?.candidate || null,
        score: best?.score || 0,
        runnerUpScore,
        margin: (best?.score || 0) - runnerUpScore
    };
}

function isConfident(score, runnerUpScore = 0, threshold = 0.75, minimumMargin = 0.08) {
    return score >= threshold && score - runnerUpScore >= minimumMargin;
}

function xpathLiteral(value) {
    if (!value.includes("'")) return `'${value}'`;
    if (!value.includes('"')) return `"${value}"`;
    return `concat(${value.split("'").map((part, index) => `${index ? `, \"'\", ` : ''}'${part}'`).join('')})`;
}

function generateLocator(candidate) {
    const tag = candidate.tagName.toLowerCase();
    const attributes = ['data-testid', 'id', 'aria-label', 'name', 'placeholder', 'value'];
    const values = {
        'data-testid': candidate.testId,
        id: candidate.id,
        'aria-label': candidate.ariaLabel,
        name: candidate.name,
        placeholder: candidate.placeholder,
        value: candidate.value
    };
    const attribute = attributes.find(name => values[name]);

    if (attribute) {
        return `//${tag}[@${attribute}=${xpathLiteral(values[attribute])}]`;
    }
    if (candidate.text) {
        return `//${tag}[normalize-space(.)=${xpathLiteral(candidate.text)}]`;
    }
    return `//${tag}`;
}

module.exports = {
    inspectElements,
    inspectInputs,
    parseLocator,
    findCandidates,
    calculateSimilarity,
    findBestCandidate,
    isConfident,
    generateLocator
};