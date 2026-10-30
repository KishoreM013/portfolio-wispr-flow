import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

async function shot(name, viewport, path, action) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:5173${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  if (action) await action(page)
  await page.screenshot({ path: `/tmp/opencode/${name}.png` })
  await context.close()
}

await shot('final-entrance-mobile', { width: 390, height: 844 }, '/')
await shot('final-hall-desktop', { width: 1440, height: 900 }, '/hall')
await shot('final-skills-desktop', { width: 1440, height: 900 }, '/skills')
await shot('final-map-mobile', { width: 390, height: 844 }, '/hall', async (page) => {
  await page.getByRole('button', { name: /open the museum map/i }).click()
  await page.waitForTimeout(400)
})
await shot('final-hall-mobile', { width: 390, height: 844 }, '/hall')

await browser.close()
