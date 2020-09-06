const { compile } = require('../test')

it("don't embed script tag", function (done) {
  compile(
    {
      cwd: __dirname,
    },
    (err, result) => {
      if (err) {
        return done(err)
      }

      if (result.compilation.errors && result.compilation.errors.length) {
        return done(result.compilation.errors)
      }

      const html = result.compilation.assets['index.html'].source()

      expect(html).not.toContain('<script src="https://polyfill.io/v3/polyfill.min.js')

      done()
    },
  )
})
