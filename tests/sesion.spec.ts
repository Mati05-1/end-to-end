import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CatalogoPage } from '../pages/CatalogoPage';
import { iniciarSesion } from './flujo';

test.describe('Regla: Sesión | Transición de estados', () => {
  for (const ruta of ['/catalogo', '/carrito', '/checkout', '/resumen', '/confirmacion']) {
    test(`Sesión - sin sesión, ${ruta} lleva al ingreso`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page, `Regla Sesión: ${ruta} sin sesión debe llevar al ingreso`).toHaveURL(/\/(index)?(\?sesion)?$/);
      await expect(new LoginPage(page).ingresar).toBeVisible();
    });
  }

  test('Sesión - cerrar sesión vacía el carrito', async ({ page }) => {
    await iniciarSesion(page);
    const catalogo = new CatalogoPage(page);
    await catalogo.agregar('taza');
    await expect(catalogo.encabezado.contador).toHaveText('1');
    await catalogo.encabezado.cerrarSesion.click();
    await expect(new LoginPage(page).ingresar).toBeVisible();
    await iniciarSesion(page);
    await expect(catalogo.encabezado.contador, 'Regla Sesión: cerrar sesión debe vaciar el carrito').toHaveText('0');
  });
});
