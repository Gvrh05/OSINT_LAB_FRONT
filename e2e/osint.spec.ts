import { expect, test } from '@playwright/test';

const api = 'http://127.0.0.1:43120/api';

test('frontend y backend OSINT responden juntos', async ({ page, request }) => {
  const health = await request.get(`${api}/health`);
  expect(health.ok()).toBeTruthy();
  expect(await health.json()).toEqual({ status: 'ok' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Datos abiertos/i })).toBeVisible();
});

test('navega a fuentes y muestra los tres módulos OSINT', async ({ page, request }) => {
  expect((await request.get(`${api}/oij`)).ok()).toBeTruthy();
  await page.goto('/fuentes');
  await expect(page.getByRole('heading', { name: 'Estadísticas Policiales' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Padrón Nacional Electoral' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Explorador territorial' })).toBeVisible();
});

test('realiza una búsqueda OSINT desde el formulario', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Busca un delito, provincia, cantón o término...').fill('robo');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page).toHaveURL(/\/buscar\?q=robo/);
  await expect(page.getByRole('heading', { name: /Resultados para.*robo/i })).toBeVisible();
  // El resultado depende de datos públicos externos; no se simulan respuestas ni registros.
});
