# Playwright Self-Healing Demo

This project demonstrates a conservative locator self-healing flow for Playwright click actions. If the original selector fails, the engine inspects interactive DOM elements across tags, ranks them against the selector's identifying value, and clicks a replacement only when the best candidate is sufficiently distinct.

## Run

```sh
npm test
npm run test:healing
```

The healing tests use local HTML fixtures. The contact-us test demonstrates a broken `input` XPath healing to the page's submit control.

## Use

```js
const { clickWithHealing } = require('./self-healing/healingEngine');

const record = await clickWithHealing(page, "//input[@value='SUBMI']", {
	onEvent: event => console.log('Locator action:', event)
});
```

`clickWithHealing` first tries the original selector. If that fails, it returns a record with `status` (`original` or `healed`), success, original and replacement selectors, candidate details, and confidence scores. An optional `onEvent` callback receives the same record. If the candidate is ambiguous or the replacement action fails, the function throws and attaches the record as `error.healingResult`.

The inspector considers `input`, `button`, `textarea`, `select`, `a`, and elements with button/link roles. It extracts XPath attribute selectors, CSS attribute/id selectors, and common text selectors. Candidate matching compares the target against identifying attributes and visible text using normalized edit-distance similarity. Healing requires a score of at least 0.75 and a lead of at least 0.08 over the runner-up; the source tag is only a small tie-breaking hint, not a candidate filter.

This is a demonstration framework, not a replacement for stable test locators. Keep healing scoped to actions where an automatic replacement is acceptable, and review recorded healed selectors before treating them as permanent test updates.