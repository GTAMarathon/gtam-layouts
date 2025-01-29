import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import NodeCG from 'vite-nodecg-plugin'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: { tsconfigPath: './tsconfig.browser.json' } }),
    NodeCG({
      bundleName: 'gtam-layouts',
      graphics: './src/browser/graphics/*.tsx',
      dashboard: './src/browser/dashboard/*.tsx',
      template: './src/browser/template.html',
    }),
  ],
})
