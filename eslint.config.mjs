// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  formatters: {
    css: true,
    html: true,
  },
  typescript: {
    overrides: {
      'ts/no-require-imports': ['off', 'always'],
      'no-restricted-syntax': ['off', 'TSExportAssignment'],
      'no-console': ['off'],
      'dot-notation': ['off'],
      'react-hooks/exhaustive-deps': ['off'],
    },
  },
  javascript: {
    overrides: {
      'no-console': ['off'],
    },
  },
})
