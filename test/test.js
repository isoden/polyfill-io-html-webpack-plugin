const path = require('path')
const MemoryFileSystem = require('memory-fs')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PolyfillIoHtmlWebpackPlugin = require('../')

it('embed script tag', function (done) {
  const compiler = webpack(
    {
      entry: path.join(__dirname, './fixture/index.js'),
      output: {
        path: path.join(__dirname, 'dist'),
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new PolyfillIoHtmlWebpackPlugin({
          cwd: __dirname,
        }),
      ],
    },
    (err, result) => {
      if (err) {
        return done(err)
      }

      if (result.compilation.errors && result.compilation.errors.length) {
        return done(result.compilation.errors)
      }

      const html = result.compilation.assets['index.html'].source()

      expect(typeof html).toBe('string')
      expect(html).toContain(
        '<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.from,console,IntersectionObserver,Promise,Symbol,Symbol.toStringTag"></script>',
      )

      done()
    },
  )
  compiler.outputFileSystem = new MemoryFileSystem()
})
