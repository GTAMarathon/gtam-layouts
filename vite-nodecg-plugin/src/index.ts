import type { InputOptions, OutputOptions, RollupOptions, RollupWatcher, RollupWatcherEvent, RollupWatchOptions } from 'rollup'
import type { Manifest, Plugin, ResolvedConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'
import { deleteSync } from 'del'
import getPort from 'get-port'
import { globbySync } from 'globby'
import {

  rollup,

  watch as rollupWatch,

} from 'rollup'

async function setupExtensionBuild(options: RollupOptions) {
  const inputOptions: InputOptions = {
    ...options,
  }

  const outputOptions: OutputOptions = {
    dir: './extension',
    format: 'cjs',
    sourcemap: true,
    interop: 'auto',
    ...options.output,
  }

  const watchOptions: RollupWatchOptions = {
    ...options,
    watch: {
      clearScreen: false,
      ...options.watch,
    },
    output: {
      dir: './extension',
      format: 'cjs',
      sourcemap: true,
      interop: 'auto',
      ...options.output,
    },
  }

  let watcher: RollupWatcher
  const watchEventHandler = (event: RollupWatcherEvent) => {
    if (event.code === 'BUNDLE_END' || event.code === 'ERROR') {
      event.result?.close()
    }
  }

  return {
    watch: () => {
      watcher = rollupWatch(watchOptions)
      watcher.on('event', watchEventHandler)
    },
    unwatch: () => {
      watcher.off('event', watchEventHandler)
      watcher.close()
    },
    build: async () => {
      const bundle = await rollup(inputOptions)
      await bundle.write(outputOptions)
      await bundle.close()
    },
  }
}

interface PluginConfig {
  bundleName: string
  graphics?: string | string[]
  dashboard?: string | string[]
  extension?: string | RollupOptions
  template?: string | { graphics: string, dashboard: string }
}

export default async ({
  bundleName,
  graphics = [],
  dashboard = [],
  extension,
  template = './src/template.html',
}: PluginConfig): Promise<Plugin> => {
  let config: ResolvedConfig
  let protocol: string
  let host: string
  let port: number

  const extensionRollup
    = typeof extension === 'string'
      ? await setupExtensionBuild({ input: extension })
      : typeof extension === 'object'
        ? await setupExtensionBuild(extension)
        : extension

  const graphicsInputs = globbySync(graphics)
  const dashboardInputs = globbySync(dashboard)
  const inputs = [...graphicsInputs, ...dashboardInputs]

  console.log('vite-nodecg: Found the following inputs: ', inputs)

  const generateHtmlFiles = async () => {
    const graphicsTemplate
      = typeof template === 'string' ? template : template.graphics
    const dashboardTemplate
      = typeof template === 'string' ? template : template.dashboard

    const graphicsTemplateHtml = fs.readFileSync(
      path.join(config.root, graphicsTemplate),
      'utf-8',
    )
    const dashboardTemplateHtml = fs.readFileSync(
      path.join(config.root, dashboardTemplate),
      'utf-8',
    )

    const graphicsOutdir = path.join(config.root, 'graphics')
    const dashboardOutdir = path.join(config.root, 'dashboard')

    deleteSync([`${graphicsOutdir}/**`, `${dashboardOutdir}/**`])
    fs.mkdirSync(graphicsOutdir, { recursive: true })
    fs.mkdirSync(dashboardOutdir, { recursive: true })

    for (const input of inputs) {
      const templateHtml = graphicsInputs.includes(input)
        ? graphicsTemplateHtml
        : dashboardTemplateHtml
      const $ = cheerio.load(templateHtml)
      const head = $('head')

      if (config.command === 'serve') {
        const address = `${protocol}://${host}:${port}`
        head.append(`
					<script type="module">
						import RefreshRuntime from '${new URL(
              path.join(config.base, '@react-refresh'),
              address,
            )}'
						RefreshRuntime.injectIntoGlobalHook(window)
						window.$RefreshReg$ = () => {}
						window.$RefreshSig$ = () => (type) => type
						window.__vite_plugin_react_preamble_installed__ = true
					</script>
				`)
        head.append(
          `<script type="module" src="${new URL(
            path.join(config.base, '@vite/client'),
            address,
          )}"></script>`,
        )
        head.append(
          `<script type="module" src="${new URL(
            path.join(config.base, input),
            address,
          )}"></script>`,
        )
      }

      if (config.command === 'build') {
        const inputName = input.replace(/^\.\//, '')
        const manifest: Manifest = JSON.parse(
          fs.readFileSync(
            path.join(config.build.outDir, 'manifest.json'),
            'utf-8',
          ),
        )
        const entryChunk = manifest[inputName]

        if (entryChunk?.css) {
          for (const css of entryChunk.css) {
            head.append(
              `<link rel="stylesheet" href="${path.join(config.base, css)}">`,
            )
          }
        }

        if (entryChunk?.file) {
          head.append(
            `<script type="module" src="${path.join(
              config.base,
              entryChunk.file,
            )}"></script>`,
          )
        }
      }

      const newHtml = $.html()
      const dir = graphicsInputs.includes(input)
        ? graphicsOutdir
        : dashboardOutdir
      const name = path.basename(input, path.extname(input))
      fs.writeFileSync(path.join(dir, `${name}.html`), newHtml)
    }
  }

  return {
    name: 'nodecg',

    config: async (baseConfig, { command }) => {
      protocol = baseConfig.server?.https ? 'https' : 'http'
      host
        = typeof baseConfig.server?.host === 'string'
          ? baseConfig.server.host
          : 'localhost'
      port = baseConfig.server?.port ?? (await getPort())

      return {
        appType: 'mpa',
        base:
          command === 'serve'
            ? `/bundles/${bundleName}`
            : `/bundles/${bundleName}/shared/dist`,
        server: {
          host,
          port,
          origin: `${protocol}://${host}:${port}`,
        },
        build: {
          rollupOptions: {
            input: inputs,
          },
          manifest: 'manifest.json',
          outDir: './shared/dist',
          assetsDir: '.',
        },
        clearScreen: baseConfig.clearScreen ?? false,
      }
    },

    configResolved: (resolvedConfig) => {
      config = resolvedConfig
    },

    buildStart: async () => {
      if (config.command === 'serve') {
        generateHtmlFiles()
        extensionRollup?.watch()
      }
      if (config.command === 'build') {
        await extensionRollup?.build()
      }
    },

    writeBundle: () => {
      if (config.command === 'build') {
        generateHtmlFiles()
      }
    },

    buildEnd: () => {
      if (config.command === 'serve') {
        extensionRollup?.unwatch()
      }
    },
  }
}
