import { Page, Locator } from '@playwright/test';
import { Encabezado } from './Encabezado';

export class CatalogoPage {
  readonly encabezado: Encabezado;
  readonly orden: Locator;
  readonly productos: Locator;

  constructor(readonly page: Page) {
    this.encabezado = new Encabezado(page);
    this.orden = page.getByTestId('orden');
    this.productos = page.getByTestId('producto');
  }

  async abrir() {
    await this.page.goto('/catalogo');
  }

  async ordenar(valor: 'az' | 'za' | 'precio-asc' | 'precio-desc') {
    await this.orden.selectOption(valor);
  }

  async nombres() {
    return this.productos.locator('h2').allTextContents();
  }

  async precios() {
    const textos = await this.productos.getByTestId('precio').allTextContents();
    return textos.map((t) => Number(t.replace('Q', '')));
  }

  async agregar(id: string) {
    await this.page.getByTestId(`agregar-${id}`).click();
  }

  quitar(id: string) {
    return this.page.getByTestId(`quitar-${id}`);
  }
}
