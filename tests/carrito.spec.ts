import { test, expect } from '@playwright/test';
import { CatalogoPage } from '../pages/CatalogoPage';
import { CarritoPage } from '../pages/CarritoPage';
import { iniciarSesion, armarCarrito, q } from './flujo';

const IDS = ['cafe-250', 'cafe-500', 'taza', 'prensa', 'molino', 'filtros'];

for (const usuario of ['estandar', 'problema']) {
  test.describe(`Regla: Carrito (${usuario}) | Particiones de equivalencia`, () => {
    for (const id of IDS) {
      test(`Carrito - EP agregar ${id} pone ese producto en el carrito (${usuario})`, async ({ page }) => {
        await iniciarSesion(page, usuario);
        const catalogo = new CatalogoPage(page);
        await catalogo.agregar(id);
        await expect(catalogo.quitar(id), `Regla Carrito: ${id} debe quedar agregado`).toBeVisible();
        const carrito = new CarritoPage(page);
        await carrito.abrir();
        await expect(carrito.lineas).toHaveCount(1);
        await expect(carrito.linea(id), `Regla Carrito: la línea debe ser ${id}`).toBeVisible();
      });
    }
  });
}

test.describe('Regla: Carrito | Transición de estados', () => {
  test('Carrito - el contador muestra el total de unidades', async ({ page }) => {
    await iniciarSesion(page);
    const carrito = await armarCarrito(page, { 'cafe-250': 3, taza: 2 });
    await expect(carrito.encabezado.contador, 'Regla Carrito: contador = total de unidades').toHaveText('5');
    await expect(carrito.subtotal).toHaveText(q(75 * 3 + 60 * 2));
  });

  test('Carrito - agregar y quitar desde el catálogo', async ({ page }) => {
    await iniciarSesion(page);
    const catalogo = new CatalogoPage(page);
    await catalogo.agregar('prensa');
    await expect(catalogo.encabezado.contador).toHaveText('1');
    await catalogo.quitar('prensa').click();
    await expect(catalogo.encabezado.contador, 'Regla Carrito: quitar debe dejar el contador en 0').toHaveText('0');
  });
});

test.describe('Regla: Cantidad | Análisis de valores límite y particiones', () => {
  const invalidas = ['0', '6', '-1', '2.5', '-3'];
  const validas = ['1', '2', '4', '5'];

  for (const n of invalidas) {
    test(`Cantidad - valor inválido ${n} muestra error y bloquea el pago`, async ({ page }) => {
      await iniciarSesion(page);
      const carrito = await armarCarrito(page, { 'cafe-250': 1 });
      await carrito.cambiarCantidad('cafe-250', n);
      await expect(carrito.error, `Regla Cantidad: ${n} debe mostrar error`).not.toBeEmpty();
      await expect(carrito.continuar, `Regla Cantidad: ${n} no debe dejar continuar`).toBeDisabled();
    });
  }

  for (const n of validas) {
    test(`Cantidad - valor válido ${n} se acepta`, async ({ page }) => {
      await iniciarSesion(page);
      const carrito = await armarCarrito(page, { 'cafe-250': 1 });
      await carrito.cambiarCantidad('cafe-250', n);
      await expect(carrito.error, `Regla Cantidad: ${n} no debe mostrar error`).toBeEmpty();
      await expect(carrito.continuar).toBeEnabled();
      await expect(carrito.encabezado.contador).toHaveText(n);
      await expect(carrito.subtotal).toHaveText(q(75 * Number(n)));
    });
  }
});
