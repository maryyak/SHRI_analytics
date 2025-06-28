import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

test.describe('Полный пользовательский путь', () => {
  test('Генерация csv файла → Аналитика по сгенерированному файлу → Файл добавлен в историю', async ({ page }) => {
    await page.goto('/csv-generator');
    const genBtn = page.getByRole('button', { name: /начать генерацию/i });
    await expect(genBtn).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      genBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.csv$/i);

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const filePath = path.resolve(__dirname, 'tmp', download.suggestedFilename());
    await download.saveAs(filePath);

    await page.goto('/csv-analyst');
    const fileInput = page.getByLabel('Загрузить файл');
    await fileInput.setInputFiles(filePath);

    await page.getByRole('button', { name: /отправить/i }).click();
    await expect(page.getByText(/готово!/i)).toBeVisible();

    await page.getByRole('link', { name: /История/i }).click();
    await expect(page.getByText(download.suggestedFilename())).toBeVisible();
  });
});
