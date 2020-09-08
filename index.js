const fs = require('fs').promises
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

const ERROR_MESSAGE_DONT_NEED_POLYFILL =
  'You do not need to use polyfill.io as all your supported browsers support all the features your website currently uses.'

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
                .join('\n;'),
            )
            .join('\n;')

          await fs.writeFile(`${cwd}/${TMP_DIR}/${FILENAME}`, file, 'utf-8')

          // 処理に成功しても、 `stderr` が空じゃないことが多々ある
          const { stdout, stderr } = await execAsync(
            `npx create-polyfill-service-url analyse --file ${TMP_DIR}/${FILENAME}`,
            {
              cwd,
            },
          )

          if (stdout) {
            htmlPlugin.assetTags.scripts.unshift({
              tagName: 'script',
              selfClosingTag: false,
              attributes: {
                src: stdout,
              },
            })

            return callback(null, htmlPlugin)
          }

          if (stderr) {
            if (stderr.includes(ERROR_MESSAGE_DONT_NEED_POLYFILL)) {
              return callback(null, htmlPlugin)
            }

            throw new Error(stderr)
          }

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
