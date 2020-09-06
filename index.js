const fs = require('fs').promises
const { spawnSync } = require('child_process')

module.exports = class PolyfillIoHtmlWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      cwd: process.cwd(),
      ...options,
    }
  }

  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, async (compilation) => {
      /** @type {import('html-webpack-plugin').Hooks['alterAssetTags']} */
      const hook =
        compilation.hooks.htmlWebpackPluginAlterAssetTags ||
        require('html-webpack-plugin').getHooks(compilation).alterAssetTags

      hook.tapAsync(this.constructor.name, async (htmlPlugin, callback) => {
        const cwd = this.options.cwd
        const TMP_DIR = '.tmp-polyfill-io-html-webpack-plugin'
        const FILENAME = 'source.js'

        try {
          await fs.mkdir(`${cwd}/${TMP_DIR}`)

          const file = compilation.chunks
            .map((chunk) =>
              chunk.files
                .filter((filename) => /\.js$/.test(filename))
                .map((file) => compilation.assets[file].source())
                .join(';'),
            )
            .join('')

          await fs.writeFile(`${cwd}/${TMP_DIR}/${FILENAME}`, file, 'utf-8')

          const result = spawnSync(
            `npx`,
            [`create-polyfill-service-url`, `analyse`, `--file`, `${TMP_DIR}/${FILENAME}`],
            {
              cwd: cwd,
            },
          )

          if (result.error) {
            throw result.error
          }

          htmlPlugin.assetTags.scripts.unshift({
            tagName: 'script',
            selfClosingTag: false,
            attributes: {
              src: result.stdout,
            },
          })

          callback(null, htmlPlugin)
        } catch (error) {
          callback(error, htmlPlugin)
        } finally {
          await fs.rmdir(`${cwd}/${TMP_DIR}`, { recursive: true })
        }
      })
    })
  }
}
