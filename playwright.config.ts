import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    testIdAttribute: 'data-test',
  },
  webServer: {
    command: 'npx serve tienda -l 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
  },
});
