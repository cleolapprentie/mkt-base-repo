const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const resolve = (dir) => path.join(__dirname, '.', dir)
const projectPath = `./${process.env.PROJECT}${process.env.BASE_URL}`
const buildPath = `dist/${getBranchName()}_${process.env.PROJECT}`

module.exports = {
  publicPath: `.${process.env.BASE_URL}`,
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
  pages: {
    index: {
      // page 的入口
      entry: `${process.env.PROJECT}/src/main.js`,
      // 模板来源
      template: `${process.env.PROJECT}/public/index.html`,
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  configureWebpack: (config) => {
    const customConfig = {
      mode: process.env.BUILD ? 'production' : 'development',
      resolve: {
        alias: {
          '@': resolve(`${projectPath}/src`)
        }
      },
      plugins: [
        new CopyWebpackPlugin([{
          from: resolve(`${process.env.PROJECT}/public/`),
          to: resolve(buildPath)
        }]),
        new StyleLintPlugin({
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
          inject: true,
          headless: false
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
