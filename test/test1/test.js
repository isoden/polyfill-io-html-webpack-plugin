const { compile } = require('../test')

it('embed script tag', function (done) {
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

      expect(html).toContain(
        '<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.from,console,IntersectionObserver,Promise,Symbol,Symbol.toStringTag"></script>',
      )

      done()
    },
  )
})
