import { test, expect } from '@playwright/test';
import { CatalogoPage } from '../pages/CatalogoPage';
import { iniciarSesion } from './flujo';

const POR_NOMBRE = [
  'Café de Antigua 500 g',
  'Café de Huehuetenango 250 g',
  'Filtros de papel (100)',
  'Molino manual',
  'Prensa francesa',
  'Taza de barro',
];
const PRECIOS = [25, 60, 75, 140, 225, 350];

for (const usuario of ['estandar', 'problema']) {
  test.describe(`Regla: Catálogo (${usuario}) | Particiones de equivalencia`, () => {
    test.beforeEach(async ({ page }) => {
      await iniciarSesion(page, usuario);
    });

    test(`Catálogo - EP orden inicial es nombre A a Z (${usuario})`, async ({ page }) => {
      const catalogo = new CatalogoPage(page);
      await expect(catalogo.orden).toHaveValue('az');
      expect(await catalogo.nombres(), 'Regla Catálogo: al entrar el orden es A a Z').toEqual(POR_NOMBRE);
    });

    test(`Catálogo - EP orden nombre Z a A (${usuario})`, async ({ page }) => {
      const catalogo = new CatalogoPage(page);
      await catalogo.ordenar('za');
      expect(await catalogo.nombres(), 'Regla Catálogo: orden Z a A').toEqual([...POR_NOMBRE].reverse());
    });

    test(`Catálogo - EP orden precio menor a mayor (${usuario})`, async ({ page }) => {
      const catalogo = new CatalogoPage(page);
      await catalogo.ordenar('precio-asc');
      expect(await catalogo.precios(), 'Regla Catálogo: orden precio menor a mayor').toEqual(PRECIOS);
    });

    test(`Catálogo - EP orden precio mayor a menor (${usuario})`, async ({ page }) => {
      const catalogo = new CatalogoPage(page);
      await catalogo.ordenar('precio-desc');
      expect(await catalogo.precios(), 'Regla Catálogo: orden precio mayor a menor').toEqual([...PRECIOS].reverse());
    });
  });
}
