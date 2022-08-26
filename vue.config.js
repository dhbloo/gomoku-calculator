module.exports = {
  configureWebpack: (config) => {
    require('vux-loader').merge(config, {
      options: {},
      plugins: [
        'vux-ui',
        'duplicate-style',
        {
          name: 'less-theme',
          path: 'src/theme.less',
        },
      ],
    })
  },

  chainWebpack: (config) => {
    // set worker-loader
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end()

    // 解决：worker 热更新问题
    config.module.rule('js').exclude.add(/\.worker\.js$/)
  },

  devServer: {
    https: false,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-site',
    },
  },

  pluginOptions: {
    i18n: {
      localeDir: 'locales',
      enableInSFC: false,
    },
  },

  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
}
