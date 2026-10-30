import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const desktop = { width: 1440, height: 900 }
const mobile = { width: 390, height: 844 }

async function open(viewport, path = '/', reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, reducedMotion })
  const page = await context.newPage()
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`http://127.0.0.1:5173${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  return { context, page, errors }
}

async function report(label, page, errors) {
  const dims = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    title: document.title,
  }))
  console.log(label, JSON.stringify({ ...dims, errors }))
}

{
  const { context, page, errors } = await open(desktop)
  await page.screenshot({ path: '/tmp/opencode/check-entrance-desktop.png' })
  await report('desktop entrance', page, errors)
  await context.close()
}

{
  const { context, page, errors } = await open(mobile)
  await page.screenshot({ path: '/tmp/opencode/check-entrance-mobile.png' })
  await report('mobile entrance', page, errors)
  await context.close()
}

{
  const { context, page, errors } = await open(desktop, '/', 'reduce')
  await page.screenshot({ path: '/tmp/opencode/check-reduced.png' })
  await report('reduced entrance', page, errors)
  await context.close()
}

{
  const { context, page, errors } = await open(desktop, '/skills')
  await page.waitForTimeout(500)
  await page.screenshot({ path: '/tmp/opencode/check-skills.png' })
  await page.getByRole('button', { name: /open the map/i }).click()
  await page.waitForTimeout(400)
  const counter = await page.locator('text=/You have seen/').innerText()
  await page.screenshot({ path: '/tmp/opencode/check-map-visited.png' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  const dialogGone = (await page.getByRole('dialog').count()) === 0
  await page.goBack()
  await page.waitForTimeout(500)
  console.log('skills/map', JSON.stringify({ counter, dialogGone, backUrl: page.url(), errors }))
  await context.close()
}

{
  const { context, page, errors } = await open(mobile, '/hall')
  await page.screenshot({ path: '/tmp/opencode/check-hall-mobile.png' })
  await report('mobile hall', page, errors)
  await context.close()
}

await browser.close()
