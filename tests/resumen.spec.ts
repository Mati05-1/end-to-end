import { test, expect } from '@playwright/test';
import { ConfirmacionPage } from '../pages/ConfirmacionPage';
import { irAResumen, q } from './flujo';

test.describe('Regla: Descuento y Total | Análisis de valores límite', () => {
  const casos = [
    { sub: 195, items: { 'cafe-250': 1, taza: 2 }, pct: 0, desc: 0, envio: 25 },
    { sub: 200, items: { 'cafe-500': 1, taza: 1 }, pct: 5, desc: 10, envio: 25 },
    { sub: 495, items: { molino: 1, taza: 2, filtros: 1 }, pct: 5, desc: 24.75, envio: 0 },
    { sub: 500, items: { molino: 1, 'cafe-250': 2 }, pct: 10, desc: 50, envio: 0 },
  ];

  for (const c of casos) {
    test(`Descuento - subtotal Q${c.sub} da ${c.pct} %`, async ({ page }) => {
      const resumen = await irAResumen(page, c.items, '01001');
      await expect(resumen.subtotal).toHaveText(q(c.sub));
      await expect(resumen.descuentoPct, `Regla Descuento: Q${c.sub} debe dar ${c.pct} %`).toHaveText(String(c.pct));
      await expect(resumen.descuento).toHaveText('-' + q(c.desc));
      await expect(resumen.envio).toHaveText(q(c.envio));
      await expect(resumen.total, 'Regla Total: subtotal - descuento + envío').toHaveText(q(c.sub - c.desc + c.envio));
    });
  }
});

test.describe('Regla: Envío gratis | Análisis de valores límite', () => {
  test('Envío gratis - subtotal con descuento Q299.25 paga envío', async ({ page }) => {
    const resumen = await irAResumen(page, { 'cafe-500': 1, 'cafe-250': 2, filtros: 1 }, '01001');
    await expect(resumen.envio, 'Regla Envío gratis: menos de Q300 paga envío').toHaveText(q(25));
    await expect(resumen.total).toHaveText(q(324.25));
  });

  test('Envío gratis - subtotal con descuento Q304 no paga envío', async ({ page }) => {
    const resumen = await irAResumen(page, { 'cafe-500': 1, taza: 3 }, '01001');
    await expect(resumen.envio, 'Regla Envío gratis: Q300 o más no paga envío').toHaveText(q(0));
    await expect(resumen.total).toHaveText(q(304));
  });
});

test.describe('Regla: Envío | Particiones de equivalencia', () => {
  const casos = [
    { cp: '01010', envio: 25 },
    { cp: '02010', envio: 40 },
    { cp: '10010', envio: 40 },
  ];

  for (const c of casos) {
    test(`Envío - CP ${c.cp} cuesta Q${c.envio}`, async ({ page }) => {
      const resumen = await irAResumen(page, { 'cafe-250': 1 }, c.cp);
      await expect(resumen.envio, `Regla Envío: CP ${c.cp} debe costar Q${c.envio}`).toHaveText(q(c.envio));
      await expect(resumen.total).toHaveText(q(75 + c.envio));
    });
  }
});

test.describe('Regla: Envío gratis con cupón | Tabla de decisión', () => {
  const casos = [
    { cupon: 'ENVIOGRATIS', cp: '01010', envio: 0 },
    { cupon: 'ENVIOGRATIS', cp: '02010', envio: 0 },
    { cupon: '', cp: '01010', envio: 25 },
    { cupon: '', cp: '02010', envio: 40 },
  ];

  for (const c of casos) {
    test(`Envío gratis - cupón "${c.cupon}" y CP ${c.cp} cuesta Q${c.envio}`, async ({ page }) => {
      const resumen = await irAResumen(page, { 'cafe-250': 1 }, c.cp, c.cupon);
      await expect(resumen.envio, `Regla Envío gratis: cupón "${c.cupon}" con CP ${c.cp} debe costar Q${c.envio}`).toHaveText(q(c.envio));
    });
  }
});

test.describe('Regla: Confirmación | Transición de estados', () => {
  test('Confirmación - muestra pedido de 6 dígitos y vacía el carrito', async ({ page }) => {
    const resumen = await irAResumen(page, { 'cafe-250': 1 }, '01001');
    await resumen.confirmar.click();
    const confirmacion = new ConfirmacionPage(page);
    await expect(confirmacion.pedido, 'Regla Confirmación: número de 6 dígitos').toHaveText(/^\d{6}$/);
    await expect(confirmacion.encabezado.contador, 'Regla Confirmación: carrito vacío').toHaveText('0');
  });
});
