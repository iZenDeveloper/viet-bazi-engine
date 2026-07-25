import { expect,test } from '@playwright/test';

test('calculates, localizes, compares and exports structured data',async({page})=>{
  await page.goto('/demo/');
  await expect(page.locator('#status')).toHaveClass('success');
  await expect(page.locator('#chart svg')).toHaveCount(1);
  await expect(page.locator('#summary article')).toHaveCount(4);
  const chart=JSON.parse(await page.locator('#output').textContent());
  expect(chart).toMatchObject({schemaVersion:'1.7',pillars:{day:{stem:{code:'REN'}}}});
  await page.locator('#locale').selectOption('en');
  await expect(page.locator('#status')).toHaveText('Calculation completed entirely offline.');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('#facts li[data-code="DAY_MASTER"]')).toContainText('Day Master');
  await page.locator('#compare').click();
  await expect(page.locator('#compatibility-result')).toContainText('/100');
  await expect(page.locator('#compatibility-factors article')).toHaveCount(4);
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#download-json').click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe('viet-bazi-result.json');
});

test('uses the cached demo and calculates without network',async({page,context,browserName})=>{
  await page.goto('/demo/');
  await expect(page.locator('#status')).toHaveClass('success');
  await page.evaluate(()=>navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.locator('#status')).toHaveClass('success');
  const cached=await page.evaluate(async()=>{const cache=await caches.open('viet-bazi-demo-v16');return Promise.all(['../demo/','../demo/app.js','../dist/index.js'].map(async path=>Boolean(await cache.match(path))));});
  expect(cached).toEqual([true,true,true]);
  await context.setOffline(true);
  if(browserName!=='webkit')await page.reload();
  await expect(page.locator('#status')).toHaveClass('success');
  await expect(page.locator('#chart svg')).toHaveCount(1);
  await page.locator('#localDateTime').fill('2000-01-07T12:00');
  await page.locator('#birth-form button[type="submit"]').click();
  await expect(page.locator('#output')).toContainText('"schemaVersion": "1.7"');
});
