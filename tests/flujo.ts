import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CatalogoPage } from '../pages/CatalogoPage';
import { CarritoPage } from '../pages/CarritoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ResumenPage } from '../pages/ResumenPage';

export const CLAVE = 'calidad2026';

export const q = (n: number) => 'Q' + n.toFixed(2);

export async function iniciarSesion(page: Page, usuario = 'estandar') {
  const login = new LoginPage(page);
  await login.abrir();
  await login.entrar(usuario, CLAVE);
  await page.waitForURL(/catalogo/);
}

export async function armarCarrito(page: Page, items: Record<string, number>) {
  const catalogo = new CatalogoPage(page);
  for (const id of Object.keys(items)) await catalogo.agregar(id);
  const carrito = new CarritoPage(page);
  await carrito.abrir();
  for (const [id, n] of Object.entries(items)) {
    if (n !== 1) await carrito.cambiarCantidad(id, String(n));
  }
  return carrito;
}

export async function irAResumen(
  page: Page,
  items: Record<string, number>,
  cp: string,
  cupon = '',
  usuario = 'estandar'
) {
  await iniciarSesion(page, usuario);
  const carrito = await armarCarrito(page, items);
  await carrito.continuarAlPago();
  await new CheckoutPage(page).llenar({ nombre: 'Ana', apellido: 'López', cp, cupon });
  const resumen = new ResumenPage(page);
  await resumen.esperar();
  return resumen;
}
