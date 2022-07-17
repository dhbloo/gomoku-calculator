module.exports = {
  configureWebpack: config => {
    require('vux-loader').merge(config, {
      options: {},
      plugins: [
        'vux-ui',
        'duplicate-style',
        {
          name: 'less-theme',
          path: 'src/theme.less'
        }
      ]
    })
  },

  devServer: {
    https: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-site'
    }
  },

  pluginOptions: {
    i18n: {
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/'
}
