const workboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/global/global.scss";`
      }
    }
  },

  configureWebpack: {
    plugins: [
      new workboxPlugin.GenerateSW({
        swDest:       'service-worker.js',
        clientsClaim: true,
        skipWaiting:  true,
      })
    ]
  }
}