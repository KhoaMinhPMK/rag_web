import { test, expect } from '@playwright/test'

test.describe('Basic Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /RAG Y Tế Nhi Khoa/i })).toBeVisible()
  })
})
