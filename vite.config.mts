import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import NodeCG from 'vite-nodecg-plugin'
import checker from 'vite-plugin-checker'
import pluginPurgeCss from 'vite-plugin-purgecss-updated-v5'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: { tsconfigPath: './tsconfig.browser.json' } }),
    NodeCG({
      bundleName: 'gtam-layouts',
      graphics: './src/browser/graphics/*.tsx',
      dashboard: './src/browser/dashboard/*.tsx',
      template: { dashboard: './src/browser/dashboard/template.html', graphics: './src/browser/graphics/template.html' },
    }),
    pluginPurgeCss({ variables: true }),
  ],
})
