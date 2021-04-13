const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const resolve = (dir) => path.join(__dirname, '.', dir)
const projectPath = `./${process.env.PROJECT}${process.env.BASE_URL}`
const buildPath = `dist/${getBranchName()}_${process.env.PROJECT}`

module.exports = {
  publicPath: `./${process.env.BASE_URL}`,
  outputDir: resolve(buildPath),
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    // 編譯錯誤時瀏覽器overlay顯示警告和錯誤
    overlay: {
      warnings: true,
      errors: true
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @use "@/assets/style/abstract/_index.scss" as *;
        `
      }
    }
  },
  configureWebpack: (config) => {
    const customConfig = {
      mode: process.env.BUILD ? 'production' : 'development',
      resolve: {
        alias: {
          '~': resolve(`${projectPath}/src`),
          '@': resolve(`${projectPath}/src`)
        }
      },
      plugins: [
        new StyleLintPlugin({
          files: ['*/src/**/*.{vue,scss}']
        })
      ],
      optimization: {}
    }

    if (process.env.BUILD === 'true') {
      const renderRoutes = getRouterRoutes()

      const prerender = new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: resolve(buildPath),
        outputDir: resolve(buildPath),
        indexPath: resolve(`${buildPath}`),
        // Required - Routes to render.
        routes: renderRoutes,
        renderer: new Renderer({
          // -> 打事件決定渲染時機
          // -> eg. `document.dispatchEvent(new Event('render-event'))`
          // renderAfterDocumentEvent: 'render-event',

          // -> Prerender時window.__PRERENDER_PROCESSING === true
          injectProperty: '__PRERENDER_PROCESSING',
          inject: true,
          headless: true
        })
        // postProcess (context) {
        //   if (context.route.endsWith('.html')) {
        //     context.outputPath = resolve(
        //       `${buildPath}/${context.route}`
        //     )
        //   }

        //   return context
        // }
      })

      customConfig.plugins.push(prerender)

      // 壓縮 css
      customConfig.optimization.minimize = true
      customConfig.optimization.minimizer = [new CssMinimizerPlugin()]

      // gzip
      customConfig.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|.\css/,
          threshold: 10240,
          deleteOriginalAssets: false
        })
      )
    }

    return customConfig
  }
}

function getBranchName () {
  return require('child_process')
    .execSync('git symbolic-ref --short HEAD')
    .toString().trim()
}

function getRouterRoutes () {
  const reg = /(?<=path: ')(\/.*)(?=')/
  const routesConfig = require('fs')
    .readFileSync(resolve(`${projectPath}/src/router/index.js`), 'utf8')
    .toString().split('\n')

  return routesConfig.reduce((acc, line) => {
    const result = line.match(reg)
    result && acc.push(result[0])
    return acc
  }, [])
}
