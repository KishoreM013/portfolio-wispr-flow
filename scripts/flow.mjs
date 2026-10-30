import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const viewport = { width: 1440, height: 900 }

async function newPage() {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  return { context, page, errors }
}

{
  const { context, page, errors } = await newPage()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(1400)
  console.log('auto-enter', page.url(), errors)
  await page.goBack()
  await page.waitForTimeout(600)
  console.log('back-to-entrance', page.url(), await page.evaluate(() => window.scrollY))
  await context.close()
}

{
  const { context, page, errors } = await newPage()
  await page.getByRole('button', { name: /enter the museum/i }).click()
  await page.waitForTimeout(1000)
  console.log('hint-click', page.url(), errors)
  await context.close()
}

{
  const { context, page, errors } = await newPage()
  await page.getByRole('button', { name: /skip intro/i }).click()
  await page.waitForTimeout(500)
  console.log('skip', page.url(), errors)
  await page.getByRole('button', { name: /^map/i }).click()
  await page.waitForTimeout(300)
  await page.getByRole('link', { name: /skills/i }).click()
  await page.waitForTimeout(500)
  console.log('room', page.url())
  await page.goBack()
  await page.waitForTimeout(500)
  console.log('back-to-hall', page.url())
  await page.getByRole('button', { name: /^map/i }).click()
  await page.waitForTimeout(300)
  const counter = await page.locator('text=/You have seen/').innerText()
  console.log('counter', counter, errors)
  await context.close()
}

await browser.close()
