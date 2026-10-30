import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

async function shoot(name, viewport, scrollFraction = 0, action) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  if (scrollFraction > 0) {
    await page.evaluate((fraction) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo(0, max * fraction)
    }, scrollFraction)
    await page.waitForTimeout(700)
  }
  if (action) await action(page)
  await page.screenshot({ path: `/tmp/opencode/${name}.png`, fullPage: false })
  await context.close()
  console.log(name, 'done')
}

const desktop = { width: 1440, height: 900 }
const mobile = { width: 390, height: 844 }

await shoot('entrance-desktop-0', desktop, 0)
await shoot('entrance-desktop-30', desktop, 0.3)
await shoot('entrance-desktop-55', desktop, 0.55)
await shoot('entrance-desktop-80', desktop, 0.8)
await shoot('entrance-desktop-94', desktop, 0.94)
await shoot('entrance-mobile-0', mobile, 0)
await shoot('entrance-mobile-45', mobile, 0.45)
await shoot('entrance-mobile-85', mobile, 0.85)

const context = await browser.newContext({ viewport: desktop })
const page = await context.newPage()
await page.goto('http://127.0.0.1:5173/hall', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/opencode/hall-desktop.png' })
await page.getByRole('button', { name: /open the map/i }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: '/tmp/opencode/map-desktop.png' })
await context.close()

const mctx = await browser.newContext({ viewport: mobile })
const mpage = await mctx.newPage()
await mpage.goto('http://127.0.0.1:5173/hall', { waitUntil: 'networkidle' })
await mpage.waitForTimeout(800)
await mpage.screenshot({ path: '/tmp/opencode/hall-mobile.png' })
await mpage.getByRole('button', { name: /open the map/i }).click()
await mpage.waitForTimeout(500)
await mpage.screenshot({ path: '/tmp/opencode/map-mobile.png' })
await mctx.close()

await browser.close()
