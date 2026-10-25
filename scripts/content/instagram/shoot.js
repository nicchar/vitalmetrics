const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch();
  for (const j of jobs) {
    const ctx = await b.newContext({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto('file://' + j.html);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    await p.screenshot({ path: j.png });
    await ctx.close();
  }
  await b.close();
})();
