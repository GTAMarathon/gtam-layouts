import type { ReactNode } from 'react'
import { createTheme, ThemeProvider } from '@mui/material'

interface Props {
  children: ReactNode
}

export function DashboardThemeProvider({ children }: Props) {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
