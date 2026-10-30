/** Browser QA against the production build, without starting a local HTTP server. */
import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const profiles = [
  { name: 'small-phone', width: 320, height: 568 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'large-phone', width: 430, height: 932 },
  { name: 'phone-landscape', width: 844, height: 390 },
  { name: 'tablet', width: 768, height: 1024 },
]
const routes = ['/', '/hall', '/skills', '/projects', '/volunteering', '/contributions', '/writing', '/accounts', '/hobbies', '/achievements', '/vip', '/management', '/basement', '/corridor/skills', '/missing-gallery']
if (process.argv.includes('--list')) {
  console.log(`${profiles.length * routes.length} route/viewport checks, plus map, gallery directory, skill cards, exhibit panels, rotation, reduced motion and drag/swipe interactions.`)
  console.log(profiles.map(p => `${p.name}: ${p.width}×${p.height}`).join('\n'))
  process.exit(0)
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' }
const errors = [], failures = []
const artifacts = '/tmp/museum-responsive-qa'
await mkdir(artifacts, { recursive: true })
async function fits(locator, page, label) {
  const box = await locator.boundingBox()
  assert.ok(box && box.width > 0 && box.height > 0, `${label} is visible`)
  const { width, height } = page.viewportSize()
  assert.ok(box.x >= -1 && box.y >= -1 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1, `${label} fits the viewport: ${JSON.stringify(box)}`)
}
async function noOverflow(page) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }))
  assert.ok(dimensions.scrollWidth <= dimensions.width + 1, `Horizontal overflow: ${JSON.stringify(dimensions)}`)
}
try {
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 })
    await context.route('http://museum.test/**', async route => {
      const pathname = decodeURIComponent(new URL(route.request().url()).pathname)
      const file = path.extname(pathname) ? pathname : '/index.html'
      const resolved = path.resolve('dist', '.' + file)
      if (!resolved.startsWith(path.resolve('dist') + path.sep)) return route.fulfill({ status: 403, body: '' })
      try { await route.fulfill({ body: await readFile(resolved), contentType: mime[path.extname(file)] || 'application/octet-stream' }) }
      catch { await route.fulfill({ status: 404, body: '' }) }
    })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(`${profile.name} ${page.url()}: ${error.message}`))
    for (const route of routes) {
      try {
        await page.goto(`http://museum.test${route}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(350)
        await noOverflow(page)
        const mapButton = page.getByRole('button', { name: 'Open the museum map', exact: true })
        await fits(mapButton, page, 'Map button')
        const buttonBox = await mapButton.boundingBox()
        assert.ok(buttonBox.width >= 44 && buttonBox.height >= 44, 'Map is a sufficient touch target')
        await mapButton.click()
        await fits(page.getByRole('dialog', { name: 'Museum Map', exact: true }), page, 'Museum map')
        await page.getByRole('button', { name: 'Close map', exact: true }).click()
        if (route === '/hall') {
          const dock = page.getByRole('navigation', { name: 'Explore the museum' })
          await fits(dock, page, 'Hall dock')
          for (const button of await dock.getByRole('button').all()) { const box = await button.boundingBox(); assert.ok(box.height >= 44, 'Hall buttons have a sufficient height') }
          await dock.getByRole('button', { name: 'Galleries', exact: true }).click()
          await fits(page.getByRole('dialog', { name: 'Gallery directory' }), page, 'Gallery directory')
          await page.getByRole('button', { name: 'Close gallery directory' }).click()
        }
        if (route === '/skills') {
          await page.getByRole('button', { name: 'Skill catalogue', exact: true }).click()
          await fits(page.getByRole('dialog', { name: 'Skill catalogue', exact: true }), page, 'Skill catalogue')
          assert.equal(await page.locator('.skill-row').count(), 27)
          await page.getByRole('button', { name: 'Tools', exact: true }).click()
          assert.ok(await page.locator('.skill-row').count() < 27)
          await page.getByRole('button', { name: /All skills/ }).click()
          await page.locator('.skill-row').first().click()
          await fits(page.getByRole('region', { name: 'Python details' }), page, 'Skill details')
          await page.getByRole('button', { name: 'Close skill details' }).click()
        }
        if (['/projects', '/volunteering', '/contributions', '/accounts', '/vip', '/management'].includes(route)) {
          await page.getByRole('button', { name: 'Exhibit information', exact: true }).click()
          await fits(page.locator('.gallery-exhibit-card'), page, 'Exhibit card')
          const scrollArea = await page.locator('.gallery-exhibit-scroll').boundingBox()
          assert.ok(scrollArea.height >= 70, 'Information panel retains usable reading space')
          await page.getByRole('button', { name: 'Close exhibit information' }).click()
          await fits(page.getByRole('navigation', { name: 'Browse exhibits' }), page, 'Exhibit navigation')
          await page.getByRole('button', { name: 'Next exhibit' }).click()
          assert.ok((await page.locator('.gallery-exhibit-navigation').innerText()).includes('Right wall'))
          await page.getByRole('button', { name: 'Close exhibit information' }).click()
        }
        await noOverflow(page)
        if (['/hall', '/skills', '/projects'].includes(route)) await page.screenshot({ path: path.join(artifacts, `${profile.name}-${route.slice(1)}.png`) })
        console.log(`PASS ${profile.name} ${route}`)
      } catch (error) {
        failures.push(`${profile.name} ${route}: ${error.message}`)
        await page.screenshot({ path: path.join(artifacts, `FAIL-${profile.name}-${route.replaceAll('/', '_') || 'entrance'}.png`) }).catch(() => {})
      }
    }
    // Resize the existing scene, so orientation changes exercise responsive hooks.
    await page.goto('http://museum.test/hall', { waitUntil: 'networkidle' })
    await page.setViewportSize({ width: profile.height, height: profile.width })
    await page.waitForTimeout(200)
    await noOverflow(page)
    await fits(page.getByRole('navigation', { name: 'Explore the museum' }), page, 'Dock after rotation')
    await context.close()
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', hasTouch: true, isMobile: true })
  // Reuse an established asset route for the reduced-motion and gesture pass.
  await context.route('http://museum.test/**', async route => {
    const pathname = new URL(route.request().url()).pathname
    const file = path.extname(pathname) ? pathname : '/index.html'
    try { await route.fulfill({ body: await readFile(path.join(process.cwd(), 'dist', file)), contentType: mime[path.extname(file)] || 'application/octet-stream' }) }
    catch { await route.fulfill({ status: 404, body: '' }) }
  })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(`reduced motion: ${error.message}`))
  await page.goto('http://museum.test/', { waitUntil: 'networkidle' })
  await fits(page.getByRole('button', { name: 'Enter the museum', exact: true }), page, 'Reduced-motion entrance')
  await page.goto('http://museum.test/skills', { waitUntil: 'networkidle' })
  assert.ok(await page.getByRole('button', { name: 'Motion reduced' }).isDisabled())
  await page.goto('http://museum.test/projects', { waitUntil: 'networkidle' })
  const canvas = page.locator('canvas')
  await page.waitForTimeout(500)
  const before = await canvas.screenshot()
  await page.mouse.move(190, 350); await page.mouse.down(); await page.mouse.move(290, 350, { steps: 10 }); await page.mouse.up()
  await page.waitForTimeout(100)
  assert.ok(!before.equals(await canvas.screenshot()), 'Drag changes the room view')
  assert.equal(await page.locator('.gallery-exhibit-card').count(), 0, 'Dragging does not activate an exhibit')
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 430 }] })
  for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y: 430 - i * 25 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await noOverflow(page)
  await context.close()
} finally { await browser.close() }
assert.equal(errors.length, 0, errors.join('\n'))
assert.equal(failures.length, 0, failures.join('\n'))
console.log(`Responsive browser QA passed. Screenshots: ${artifacts}`)
