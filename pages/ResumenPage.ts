import { Page, Locator } from '@playwright/test';

export class ResumenPage {
  readonly subtotal: Locator;
  readonly descuentoPct: Locator;
  readonly descuento: Locator;
  readonly envio: Locator;
  readonly total: Locator;
  readonly confirmar: Locator;

  constructor(readonly page: Page) {
    this.subtotal = page.getByTestId('subtotal');
    this.descuentoPct = page.getByTestId('descuento-pct');
    this.descuento = page.getByTestId('descuento');
    this.envio = page.getByTestId('envio');
    this.total = page.getByTestId('total');
    this.confirmar = page.getByTestId('confirmar');
  }

  async esperar() {
    await this.page.waitForURL(/resumen/);
  }
}
