const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
require('dotenv').config({ path: 'config/env/.env' })

const resolve = (dir) => path.join(__dirname, '.', dir)

const projectName = process.env.PROJECT
const projectBaseUrl = process.env.PROJECT_BASE_URL
const buildPath = `dist/${getBranchName()}_${projectName}`

module.exports = {
  publicPath: './',
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
      },
      postcss: require(resolve('config/postcss.config.js'))
    }
  },
  pages: {
    index: {
      entry: resolve(`${projectBaseUrl}/src/main.js`),
      template: resolve(`${projectBaseUrl}/public/index.html`)
    }
  },
  configureWebpack: (config) => {
    const customConfig = {
      mode: process.env.BUILD ? 'production' : 'development',
      resolve: {
        alias: {
          '@': resolve(`${projectBaseUrl}/src`)
        }
      },
      plugins: [
        new CopyWebpackPlugin([{
          from: resolve(`${projectBaseUrl}/public/`),
          to: resolve(buildPath)
        }]),
        new StyleLintPlugin({
          configFile: resolve('config/lint/stylelint.config.js'),
          files: ['**/src/**/*.{vue,scss}']
        })
      ],
      optimization: {}
    }

    if (process.env.BUILD === 'true') {
      const renderRoutes = [
        ...getRouterRoutes()
        // 如有動態param請完整定義在這裡
        // eg. `/user/:id` -> `/user/alex`
      ]

      const prerender = new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: resolve(buildPath),
        outputDir: resolve(buildPath),
        indexPath: resolve(`${buildPath}/`),
        // Required - Routes to render.
        routes: renderRoutes,
        renderer: new Renderer({
          // -> 打事件決定渲染時機
          // -> eg. `document.dispatchEvent(new Event('render-event'))`
          renderAfterDocumentEvent: 'render-event',

          // -> Prerender時window.__PRERENDER_PROCESSING === true
          injectProperty: '__PRERENDER_PROCESSING',
          inject: true
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
    .readFileSync(resolve(`${projectBaseUrl}/src/router/index.js`), 'utf8')
    .toString().split('\n')

  function validateRoute (path) {
    if (!path.includes('/:')) return path
    else return null
  }

  return routesConfig.reduce((acc, line) => {
    const path = line.match(reg)
    if (path) {
      const result = validateRoute(path[0])
      result && acc.push(result)
    }

    return acc
  }, [])
}
