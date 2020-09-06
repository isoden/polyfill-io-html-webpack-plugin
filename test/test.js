const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MemoryFileSystem = require('memory-fs')

const PolyfillIoHtmlWebpackPlugin = require('../')

exports.compile = function compile(options, handler) {
  const compiler = webpack(
    {
      entry: path.join(__dirname, './fixture/index.js'),
      output: {
        path: path.join(__dirname, 'dist'),
      },
      plugins: [new HtmlWebpackPlugin(), new PolyfillIoHtmlWebpackPlugin(options)],
    },
    handler,
  )

  compiler.outputFileSystem = new MemoryFileSystem()
}
