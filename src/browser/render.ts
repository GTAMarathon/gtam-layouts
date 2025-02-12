import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

export function render(app: ReactNode) {
  const container = document.getElementById('root')
  if (container) {
    createRoot(container).render(app)
  }
  else {
    throw new Error('#root element not found')
  }
}
