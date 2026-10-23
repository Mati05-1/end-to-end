import { test, expect, Page } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { iniciarSesion, armarCarrito } from './flujo';

const validos = { nombre: 'Ana', apellido: 'López', cp: '01001' };

async function abrirCheckout(page: Page, usuario = 'estandar') {
  await iniciarSesion(page, usuario);
  const carrito = await armarCarrito(page, { 'cafe-250': 1 });
  await carrito.continuarAlPago();
  return new CheckoutPage(page);
}

test.describe('Regla: Datos de envío | Particiones de equivalencia', () => {
  const faltantes = [
    { caso: 'sin nombre', datos: { ...validos, nombre: '' } },
    { caso: 'sin apellido', datos: { ...validos, apellido: '' } },
    { caso: 'sin código postal', datos: { ...validos, cp: '' } },
    { caso: 'código postal con letras', datos: { ...validos, cp: '0100a' } },
  ];

  for (const f of faltantes) {
    test(`Datos de envío - EP inválida: ${f.caso} muestra error`, async ({ page }) => {
      const checkout = await abrirCheckout(page);
      await checkout.llenar(f.datos);
      await expect(checkout.error, `Regla Datos de envío: ${f.caso} debe mostrar error`).not.toBeEmpty();
      await expect(page).toHaveURL(/checkout/);
    });
  }

  for (const usuario of ['estandar', 'problema']) {
    test(`Datos de envío - EP válida: datos completos pasan al resumen (${usuario})`, async ({ page }) => {
      const checkout = await abrirCheckout(page, usuario);
      await checkout.llenar(validos);
      await expect(page, 'Regla Datos de envío: datos completos deben pasar al resumen').toHaveURL(/resumen/);
    });
  }
});

test.describe('Regla: Código postal | Análisis de valores límite', () => {
  for (const cp of ['0100', '010012']) {
    test(`Código postal - ${cp.length} dígitos es inválido`, async ({ page }) => {
      const checkout = await abrirCheckout(page);
      await checkout.llenar({ ...validos, cp });
      await expect(checkout.error, `Regla Datos de envío: CP de ${cp.length} dígitos debe dar error`).not.toBeEmpty();
    });
  }

  test('Código postal - 5 dígitos es válido', async ({ page }) => {
    const checkout = await abrirCheckout(page);
    await checkout.llenar({ ...validos, cp: '01001' });
    await expect(page, 'Regla Datos de envío: CP de 5 dígitos es válido').toHaveURL(/resumen/);
  });
});

test.describe('Regla: Cupón | Particiones de equivalencia', () => {
  for (const cupon of ['', 'ENVIOGRATIS', 'enviogratis', '  EnvioGratis  ']) {
    test(`Cupón - EP válida: "${cupon}" se acepta`, async ({ page }) => {
      const checkout = await abrirCheckout(page);
      await checkout.llenar({ ...validos, cupon });
      await expect(page, `Regla Cupón: "${cupon}" debe aceptarse`).toHaveURL(/resumen/);
    });
  }

  for (const cupon of ['ENVIOGRATISS', 'XENVIOGRATIS', 'ENVIO GRATIS', 'DESCUENTO']) {
    test(`Cupón - EP inválida: "${cupon}" da "El cupón no existe."`, async ({ page }) => {
      const checkout = await abrirCheckout(page);
      await checkout.llenar({ ...validos, cupon });
      await expect(checkout.error, `Regla Cupón: "${cupon}" debe dar error`).toHaveText('El cupón no existe.');
    });
  }
});
