export async function expandAccordions(page) {
  // Framer accordions react to real pointer/tap gestures, not a synthetic
  // element.click() dispatched from page.evaluate — that leaves the answer
  // text unrendered. Playwright's ElementHandle.click() drives the mouse for
  // real, which the Framer gesture handlers do pick up.
  //
  // A broad selector matches a question row's own wrapper *and* several of
  // its descendants (icon, label) with the same textContent, so naively
  // clicking every match toggles the same row open/closed several times in
  // a row. `opened` remembers which question text has already been clicked
  // so each row is only opened once, while still allowing later passes to
  // catch rows that only appear after an earlier click (nested accordions).
  const opened = new Set();
  for (let pass = 0; pass < 3; pass++) {
    const candidates = await page.$$("div[role='button'], button, div[tabindex='0'], [data-framer-name*='ccordion' i]");
    let clicked = 0;
    for (const handle of candidates) {
      const text = ((await handle.textContent()) || "").trim();
      if (!text.endsWith("?") || text.length >= 140 || opened.has(text)) continue;
      opened.add(text);
      try {
        await handle.click({ timeout: 2000 });
        clicked++;
        await page.waitForTimeout(250); // let the open animation settle before the next click
      } catch {
        // element became detached or covered after an earlier click — skip it
      }
    }
    if (!clicked) break;
  }
  await page.waitForTimeout(500);
}
