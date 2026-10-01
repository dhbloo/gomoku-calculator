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
      // Keep the engine (build/) out of the precache: precaching downloads every engine variant
      // and the 40MB rapfi.data again with a __WB_REVISION__ query on first visit, although the
      // page has already fetched the one it needs. The runtime cache below caches it on demand.
      // Setting exclude replaces @vue/cli-plugin-pwa's defaults, so the first four are kept.
      exclude: [/\.map$/, /img\/icons\//, /favicon\.ico$/, /^manifest.*\.js?$/, /^build\//],
      runtimeCaching: [
        {
          // engine files: cache only the variant this browser actually loads
          urlPattern: /\/build\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'engine-cache',
            expiration: {
              maxEntries: 40,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year; ship engine updates under a new file name or path
              purgeOnQuotaError: true
            },
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
        {
          // match all resources except HTML files
          urlPattern: /^(?!.*\.html$).*$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'all-resources-cache',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 15, // 15天
              purgeOnQuotaError: true
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          // HTML files use StaleWhileRevalidate strategy
          urlPattern: /\.html$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'html-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
  },
}
