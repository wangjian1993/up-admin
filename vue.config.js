let path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const {getThemeColors, modifyVars} = require('./src/utils/themeUtil')
const {resolveCss} = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'
// vue.config.js
const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    nprogress: 'NProgress',
    clipboard: 'ClipboardJS',
    '@antv/data-set': 'DataSet',
    'js-cookie': 'Cookies'
  },
  css: [
  ],
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
    '//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
    '//cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',
    '//cdn.jsdelivr.net/npm/@antv/data-set@0.11.4/build/data-set.min.js',
    '//cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js'
  ]
}

module.exports = {
  // devServer: {
  //   proxy: {
  //     '/': { //此处要与 /services/api.js 中的 API_PROXY_PREFIX 值保持一致
  //       target:"http://218.17.19.58:7003/",
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
    }
  },

  configureWebpack: config => {
    config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
    config.performance = {
      hints: false
    }
    config.plugins.push(
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getThemeColors(),
        injectCss: true,
        resolveCss
      })
    )
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    // 生产环境下将资源压缩成gzip格式
    if (isProd) {
      // add `CompressionWebpack` plugin to webpack plugins
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
    // if prod, add externals
    if (isProd) {
      config.externals = assetsCDN.externals
    }
  },

  chainWebpack: config => {
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (isProd) {
      config.plugin('optimize-css')
        .tap(args => {
            args[0].cssnanoOptions.preset[1].colormin = false
          return args
        })
    }
    // 生产环境下使用CDN
    if (isProd) {
      config.plugin('html')
        .tap(args => {
          args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#13c2c2',
            'primary-1': '#e6fffb',
            'primary-2': '#b5f5ec',
            'primary-3': '#87e8de',
            'primary-4': '#5cdbd3',
            'primary-5': '#36cfc9',
            'primary-6': '#13c2c2',
            'primary-7': '#08979c',
            'primary-8': '#006d75',
            'primary-9': '#00474f',
            'primary-10': '#002329',
            'info-color': '#13c2c2',
            'success-color': '#52c41a',
            'warning-color': '#faad14',
            'error-color': '#f5222f',
            'alert-info-bg-color': '#e6fffb',
            'alert-info-border-color': '#87e8de',
            'alert-success-bg-color': '#f6ffed',
            'alert-success-border-color': '#b7eb8f',
            'alert-warning-bg-color': '#fffbe6',
            'alert-warning-border-color': '#ffe58f',
            'alert-error-bg-color': '#fff1f0',
            'alert-error-border-color': '#ffa19e',
            'processing-color': '#13c2c2',
            'menu-dark-submenu-bg': '#010e0e',
            'layout-header-background': '#032121',
            'layout-trigger-background': '#053434',
            'btn-danger-bg': '#ff4d52',
            'btn-danger-border': '#ff4d52',
            'layout-body-background': '#f0f2f5',
            'body-background': '#fff',
            'component-background': '#fff',
            'heading-color': 'rgba(0, 0, 0, 0.85)',
            'text-color': 'rgba(0, 0, 0, 0.85)',
            'text-color-inverse': '#fff',
            'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
            'shadow-color': 'rgba(0, 0, 0, 0.15)',
            'border-color-split': '#f0f0f0',
            'background-color-light': '#fafafa',
            'background-color-base': '#f5f5f5',
            'table-selected-row-bg': '#fafafa',
            'table-expanded-row-bg': '#fbfbfb',
            'checkbox-check-color': '#fff',
            'disabled-color': 'rgba(0, 0, 0, 0.25)',
            'menu-dark-color': 'rgba(254, 254, 254, 0.65)',
            'menu-dark-highlight-color': '#fefefe',
            'menu-dark-arrow-color': '#fefefe',
            'btn-primary-color': '#fff'
          },
          javascriptEnabled: true
        }
      }
    }
  },

  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
}
