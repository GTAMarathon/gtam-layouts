import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import NodeCG from 'vite-nodecg-plugin'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'strict',
    },
  },
  plugins: [
    react(),
    checker({ typescript: { tsconfigPath: './tsconfig.browser.json' } }),
    NodeCG({
      inputs: {
        'browser/graphics/*.{js,ts,tsx}': './src/browser/graphics/template.html',
        'browser/dashboard/*.{js,ts,tsx}': './src/browser/dashboard/template.html',
      },
    }),
  ],
})
