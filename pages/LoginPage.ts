import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly usuario: Locator;
  readonly clave: Locator;
  readonly ingresar: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.usuario = page.getByTestId('usuario');
    this.clave = page.getByTestId('clave');
    this.ingresar = page.getByTestId('ingresar');
    this.error = page.getByTestId('error');
  }

  async abrir() {
    await this.page.goto('/');
  }

  async entrar(usuario: string, clave: string) {
    await this.usuario.fill(usuario);
    await this.clave.fill(clave);
    await this.ingresar.click();
  }
}
