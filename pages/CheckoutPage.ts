import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly nombre: Locator;
  readonly apellido: Locator;
  readonly cp: Locator;
  readonly cupon: Locator;
  readonly error: Locator;
  readonly continuar: Locator;
  readonly cancelar: Locator;

  constructor(readonly page: Page) {
    this.nombre = page.getByTestId('nombre');
    this.apellido = page.getByTestId('apellido');
    this.cp = page.getByTestId('cp');
    this.cupon = page.getByTestId('cupon');
    this.error = page.getByTestId('error');
    this.continuar = page.getByTestId('continuar');
    this.cancelar = page.getByTestId('cancelar');
  }

  async llenar(datos: { nombre?: string; apellido?: string; cp?: string; cupon?: string }) {
    await this.nombre.fill(datos.nombre ?? '');
    await this.apellido.fill(datos.apellido ?? '');
    await this.cp.fill(datos.cp ?? '');
    await this.cupon.fill(datos.cupon ?? '');
    await this.continuar.click();
  }
}
