import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import vue from '@vitejs/plugin-vue';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import NodeCGPlugin from 'vite-plugin-nodecg';

// Getting __dirname with ES Modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173, // Temp workaround for vite-plugin-nodecg having the wrong default
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify(),
    checker({ vueTsc: { tsconfigPath: 'tsconfig.browser.json' } }),
    NodeCGPlugin(),
  ],
  resolve: {
    alias: {
      '@gtam-layouts': `${__dirname}/src/`,
    },
  },
});
