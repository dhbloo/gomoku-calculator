module.exports = {
  configureWebpack: (config) => {
    require('vux-loader').merge(config, {
      options: {},
      plugins: [
        'vux-ui',
        {
          name: 'duplicate-style',
          options: {
            assetNameRegExp: /^(?!css\/font-awesome\.min\.css$).*\.css$/g,
          },
        },
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

  pwa: {
    name: 'Gomoku Calculator',
    themeColor: '#2E86C1',
    msTileColor: '#2E86C1',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    manifestOptions: {
      short_name: 'Gomocalc',
      icons: [
        {
          src: './icon.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './favicon.png',
          sizes: '32x32',
          type: 'image/png',
        },
      ],
    },
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'icon.png',
      msTileImage: 'icon.png',
      maskIcon: null,
    },

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local',
      skipWaiting: true,
      clientsClaim: false,
      offlineGoogleAnalytics: true,
      cleanupOutdatedCaches: true,
    },
  },
}
