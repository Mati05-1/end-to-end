import { Page, Locator } from '@playwright/test';
import { Encabezado } from './Encabezado';

export class CarritoPage {
  readonly encabezado: Encabezado;
  readonly lineas: Locator;
  readonly vacio: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly continuar: Locator;

  constructor(readonly page: Page) {
    this.encabezado = new Encabezado(page);
    this.lineas = page.getByTestId('linea');
    this.vacio = page.getByTestId('vacio');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal');
    this.continuar = page.getByTestId('continuar');
  }

  async abrir() {
    await this.page.goto('/carrito');
  }

  linea(id: string) {
    return this.page.locator(`[data-test=linea][data-id="${id}"]`);
  }

  async cambiarCantidad(id: string, cantidad: string) {
    const input = this.page.getByTestId(`cantidad-${id}`);
    await input.fill(cantidad);
    await input.dispatchEvent('change');
  }

  async continuarAlPago() {
    await this.continuar.click();
  }
}
