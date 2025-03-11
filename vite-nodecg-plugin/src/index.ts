/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable node/prefer-global/process */
import type { InputOptions } from 'rollup'
import type {
  Manifest,
  ManifestChunk,
  Plugin,
  ResolvedConfig,
  UserConfig,
} from 'vite'

import fs from 'node:fs'
import path from 'node:path'

import { globbySync } from 'globby'
import { minimatch } from 'minimatch'

export interface PluginConfig {
  /**
   * Use to map input files to template paths
   *
   * @default {
        'graphics/*.{js,ts}': './src/graphics/template.html',
        'dashboard/*.{js,ts}': './src/dashboard/template.html',
    }
   */
  inputs?: { [key: string]: string } | undefined

  /**
   * Base directory for input-file paths
   * @default './src'
   */
  srcDir?: string | undefined
}

export default function viteNodeCGPlugin(pluginConfig: PluginConfig): Plugin {
  const bundleName = path.basename(process.cwd())

  const inputConfig = pluginConfig?.inputs ?? {
    'graphics/*.{js,ts}': './src/graphics/template.html',
    'dashboard/*.{js,ts}': './src/dashboard/template.html',
  }

  const srcDir = pluginConfig?.srcDir ?? './src'

  const inputPatterns = [
    ...Object.keys(inputConfig).map(matchPath =>
      path.posix.join(srcDir, matchPath),
    ),
    '!**.d.ts',
  ]

  // string array of paths to all input files (always ignore ts declaration files)
  const inputs = globbySync(inputPatterns)

  if (!inputs || !inputs.length) {
    console.error('vite-plugin-nodecg: No inputs were found! Exiting')
    process.exit(1)
  }
  else {
    console.log('vite-plugin-nodecg: Found the following inputs: ', inputs)
  }

  // now we know which inputs actually exist, lets clean up unused inputConfig entries so we don't load templates we don't need
  // useful in the case the default inputsConfig is used, but the nodecg bundle has only dashboards or only graphics (or no inputs at all)
  Object.keys(inputConfig).forEach((matchPath) => {
    if (
      !inputs.some(input =>
        minimatch(input, path.posix.join(srcDir, matchPath)),
      )
    ) {
      delete inputConfig[matchPath]
    }
  })

  // map from template paths to file buffers
  const templates = {} as { [key: string]: string }
  Object.values(inputConfig).forEach((templatePath) => {
    if (templates[templatePath])
      return // skip if already read
    const fullPath = path.posix.join(process.cwd(), templatePath)
    templates[templatePath] = fs.readFileSync(fullPath, 'utf-8')
  })

  let config: ResolvedConfig
  let reactPreamble: string
  let dSrvProtocol: string
  let dSrvHost: string
  let assetManifest: Manifest

  let resolvedInputOptions: InputOptions

  // take the template html and inject script and css assets into <head>
  function injectAssetsTags(html: string, entry: string) {
    const tags = []

    if (config.mode === 'development') {
      // Add React fast refresh script for development
      if (reactPreamble) {
        tags.push(
          `<script type="module">${reactPreamble.replace(/__BASE__/g, `${dSrvProtocol}://${path.posix.join(
            dSrvHost,
            'bundles',
            bundleName,
          )}/`)}</script>`,
        )
      }

      tags.push(
        `<script type="module" src="${dSrvProtocol}://${path.posix.join(
          dSrvHost,
          'bundles',
          bundleName,
          '@vite/client',
        )}"></script>`,
      )
      tags.push(
        `<script type="module" src="${dSrvProtocol}://${path.posix.join(
          dSrvHost,
          'bundles',
          bundleName,
          entry,
        )}"></script>`,
      )
    }
    else if (config.mode === 'production' && assetManifest) {
      const entryChunk = assetManifest[entry]

      function generateCssTags(
        chunk: ManifestChunk,
        alreadyProcessed: string[] = [],
      ) {
        chunk.css?.forEach((cssPath) => {
          if (alreadyProcessed.includes(cssPath))
            return // de-dupe assets

          tags.push(
            `<link rel="stylesheet" href="${path.posix.join(
              config.base,
              cssPath,
            )}" />`,
          )

          alreadyProcessed.push(cssPath)
        })

        // recurse
        chunk.imports?.forEach((importPath) => {
          generateCssTags(assetManifest[importPath], alreadyProcessed)
        })
      }

      generateCssTags(entryChunk)

      tags.push(
        `<script type="module" src="${path.posix.join(
          config.base,
          entryChunk.file,
        )}"></script>`,
      )
    }

    const newHtml = html.includes('</head>')
      ? html.replace('</head>', `${tags.join('\n')}\n</head>`)
      : `${tags.join('\n')}\n${html}`

    return newHtml
  }

  // Determine the output directory based on the input path pattern matching
  function determineOutputDir(inputPath: string): string {
    // Check if it's a graphics file based on the input config patterns
    const isGraphics = Object.keys(inputConfig).some((matchPath) => {
      return matchPath.includes('graphics')
        && minimatch(inputPath, path.posix.join(srcDir, matchPath))
    })

    // Check if it's a dashboard file based on the input config patterns
    const isDashboard = Object.keys(inputConfig).some((matchPath) => {
      return matchPath.includes('dashboard')
        && minimatch(inputPath, path.posix.join(srcDir, matchPath))
    })

    if (isGraphics) {
      return 'graphics'
    }
    else if (isDashboard) {
      return 'dashboard'
    }
    else {
      // Use the original directory if not matched
      return path.dirname(path.relative(srcDir, inputPath))
    }
  }

  // for each input (graphics & dashboard panels) create an html doc and emit to disk
  function generateHTMLFiles() {
    let resolvedInputs: string[]
    const input = resolvedInputOptions.input

    if (!input)
      return

    // populate inputs, taking into account "input" can come in 3 forms
    if (typeof input === 'string') {
      resolvedInputs = [input]
    }
    else if (Array.isArray(input)) {
      resolvedInputs = input
    }
    else {
      resolvedInputs = Object.values(input)
    }

    const htmlDocs = {} as { [key: string]: string }

    // generate string html for each input
    resolvedInputs.forEach((inputPath) => {
      // find first template that has a match path that this input satisfies
      const matchPath = Object.keys(inputConfig).find((matchPath) => {
        return minimatch(inputPath, path.posix.join(srcDir, matchPath))
      })

      if (!matchPath)
        return

      const templatePath = inputConfig[matchPath]
      const template = templates[templatePath]

      // check template was found in the inputConfig and we loaded it from disk, otherwise skip this input
      if (!template) {
        console.error(
          `vite-plugin-nodecg: No template found to match input "${inputPath}". This probably means the input file was manually specified in the vite rollup config, and the graphic/dashboard will not be built.`,
        )
        return
      }

      // add asset tags to template
      const html = injectAssetsTags(
        templates[templatePath],
        inputPath.replace(/^(\.\/)/, ''),
      )

      // Get the appropriate output directory
      const outputDir = determineOutputDir(inputPath)
      const name = path.basename(inputPath, path.extname(inputPath))
      const filePath = path.join(outputDir, `${name}.html`)

      htmlDocs[filePath] = html
    })

    // write each html doc to disk
    for (const [filePath, htmlDoc] of Object.entries(htmlDocs)) {
      const fullFilePath = path.join(process.cwd(), filePath)
      const dir = path.dirname(fullFilePath)

      try {
        fs.mkdirSync(dir, { recursive: true })
      }
      catch (e) {
        console.error(
          `vite-plugin-nodecg: Could not create directory ${dir} for input ${filePath}. Skipping...`,
        )
        continue
      }

      fs.writeFile(fullFilePath, htmlDoc, () => {
        console.log(
          `vite-plugin-nodecg: Wrote input ${filePath} to disk`,
        )
      })
    }
  }

  return {
    name: 'nodecg',

    // validate and setup defaults in user's vite config
    config: (_config, { mode }): UserConfig => {
      return {
        build: {
          manifest: 'manifest.json',
          outDir: 'shared/dist',
          rollupOptions: {
            input: inputs,
          },
        },
        base: `/bundles/${bundleName}/${
          mode === 'development' ? '' : 'shared/dist/'
        }`,
      }
    },

    async configResolved(resolvedConfig: ResolvedConfig) {
      // Capture resolved config for use in injectAssets
      config = resolvedConfig
      // Check to see if one of the plugins is vite:react-refresh
      if (resolvedConfig.plugins.find(plugin => plugin.name === 'vite:react-refresh')) {
        // If it is, import it and get the preamble code from it if possible
        reactPreamble = (await import('@vitejs/plugin-react'))?.default?.preambleCode
        if (!reactPreamble) {
          console.warn('Unable to get React refresh preamble')
        }
      }
    },

    buildStart(options: InputOptions) {
      // capture inputOptions for use in generateHtmlFiles in both dev & prod
      resolvedInputOptions = options
    },

    writeBundle() {
      if (!resolvedInputOptions?.input || config.mode !== 'production')
        return

      try {
        // would be nice to not have to read the asset manifest from disk but I don't see another way
        // relevant: https://github.com/vitejs/vite/blob/a9dfce38108e796e0de0e3b43ced34d60883cef3/packages/vite/src/node/ssr/ssrManifestPlugin.ts
        assetManifest = JSON.parse(
          fs
            .readFileSync(
              path.posix.join(
                process.cwd(),
                config.build.outDir,
                'manifest.json',
              ),
            )
            .toString(),
        )
      }
      catch (err) {
        console.error(
          'vite-plugin-nodecg: Failed to load manifest.json from build directory. HTML files won\'t be generated.',
        )
        return
      }

      // prod inject
      generateHTMLFiles()
    },

    configureServer(server) {
      if (!server.httpServer)
        return

      server.httpServer.on('listening', () => {
        dSrvProtocol = server.config.server.https ? 'https' : 'http'
        dSrvHost = `${server.config.server.host ?? 'localhost'}:${
          server.config.server.port ?? '5173'
        }`

        // fix dev server origin
        server.config.server.origin = `${dSrvProtocol}://${dSrvHost}`

        // dev inject
        generateHTMLFiles()
      })
    },
  }
}
