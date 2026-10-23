import { Page, Locator } from '@playwright/test';
import { Encabezado } from './Encabezado';

export class ConfirmacionPage {
  readonly encabezado: Encabezado;
  readonly pedido: Locator;

  constructor(readonly page: Page) {
    this.encabezado = new Encabezado(page);
    this.pedido = page.getByTestId('pedido');
  }
}
