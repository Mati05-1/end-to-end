import { Page, Locator } from '@playwright/test';

export class Encabezado {
  readonly contador: Locator;
  readonly enlaceCarrito: Locator;
  readonly cerrarSesion: Locator;

  constructor(readonly page: Page) {
    this.contador = page.getByTestId('contador-carrito');
    this.enlaceCarrito = page.getByTestId('enlace-carrito');
    this.cerrarSesion = page.getByTestId('cerrar-sesion');
  }
}
