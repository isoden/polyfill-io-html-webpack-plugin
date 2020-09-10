# @isoden/polyfill-io-html-webpack-plugin

## Installation

```
$ npm install @isoden/polyfill-io-html-webpack-plugin --save-dev
```

## Usage

```js
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin')
const PolyfillIoHtmlWebpackPlugin = require('@isoden/polyfill-io-html-webpack-plugin')

module.exports = (env) => {
  ...
  plugins: [
    new HtmlWebpackPlugin(),
    new PolyfillIoHtmlWebpackPlugin({
      disabled: !env.production // it will only work in production build
    }),
  ]
}
```
