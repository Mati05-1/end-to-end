import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CLAVE } from './flujo';

test.describe('Regla: Ingreso | Particiones de equivalencia', () => {
  const invalidos = [
    { caso: 'usuario vacío', usuario: '', clave: CLAVE },
    { caso: 'contraseña vacía', usuario: 'estandar', clave: '' },
    { caso: 'contraseña incorrecta', usuario: 'estandar', clave: 'otra' },
    { caso: 'usuario inexistente', usuario: 'nadie', clave: CLAVE },
    { caso: 'usuario bloqueado', usuario: 'bloqueado', clave: CLAVE },
  ];

  for (const d of invalidos) {
    test(`Ingreso - EP inválida: ${d.caso} muestra error y no entra`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.abrir();
      await login.entrar(d.usuario, d.clave);
      await expect(login.error, `Regla Ingreso: ${d.caso} debe mostrar error`).not.toBeEmpty();
      await expect(page, `Regla Ingreso: ${d.caso} no debe dejar entrar`).not.toHaveURL(/catalogo/);
    });
  }

  for (const usuario of ['estandar', 'problema']) {
    test(`Ingreso - EP válida: ${usuario} entra al catálogo`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.abrir();
      await login.entrar(usuario, CLAVE);
      await expect(page, `Regla Ingreso: ${usuario} debe entrar`).toHaveURL(/catalogo/);
    });
  }

  test('Ingreso - EP válida: lento entra sin esperas fijas', async ({ page }) => {
    const login = new LoginPage(page);
    await login.abrir();
    await login.entrar('lento', CLAVE);
    await expect(page, 'Regla Ingreso: lento debe entrar').toHaveURL(/catalogo/, { timeout: 10000 });
  });
});
