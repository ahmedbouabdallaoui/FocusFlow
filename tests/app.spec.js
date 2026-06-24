import { test, expect } from '@playwright/test'

test.describe('Focus Flow', () => {

  test('loads the timer view by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=20:00')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible()
  })

  test('timer displays Space Grotesk font', async ({ page }) => {
    await page.goto('/')
    const font = await page.locator('text=20:00').evaluate((el) => getComputedStyle(el).fontFamily)
    expect(font.toLowerCase()).toContain('space grotesk')
  })

  test('starts and pauses the timer', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Start' }).click()
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
    await page.waitForTimeout(1500)
    await page.getByRole('button', { name: 'Pause' }).click()
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible()
  })

  test('navigates to tasks view', async ({ page }) => {
    await page.goto('/')
    await page.locator('button').filter({ hasText: '✓' }).first().click()
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible()
    await expect(page.getByRole('button', { name: '+' })).toBeVisible()
  })

  test('navigates to stats view', async ({ page }) => {
    await page.goto('/')
    await page.locator('button').filter({ hasText: '◈' }).first().click()
    await expect(page.getByRole('heading', { name: 'Focus Activity' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Stats' })).toBeVisible()
  })

  test('stats shows empty state when no sessions', async ({ page }) => {
    await page.goto('/')
    await page.locator('button').filter({ hasText: '◈' }).first().click()
    await expect(page.locator('text=Complete your first focus session')).toBeVisible()
  })

  test('navigates to calendar view', async ({ page }) => {
    await page.goto('/')
    await page.locator('button').filter({ hasText: '☐' }).first().click()
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible()
  })

  test('theme panel shows mode and accent options', async ({ page }) => {
    await page.goto('/')
    await page.locator('button').filter({ has: page.locator('svg') }).first().click()
    await expect(page.getByText('Mode')).toBeVisible()
    await expect(page.getByText('Accent')).toBeVisible()
  })

  test('sidebar FF logo is present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=FF').first()).toBeVisible()
  })

  test('ambient panel renders on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await expect(page.locator('[title="Rain"]')).toBeVisible()
    await expect(page.locator('[title="Coffee"]')).toBeVisible()
    await expect(page.locator('[title="Lofi"]')).toBeVisible()
  })

})
