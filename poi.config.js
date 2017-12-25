module.exports = {
  env: {
    VERSION: require('vue-template-compiler/package').version
  },
  transformModules: ['vue-template-es2015-compiler'],
  presets: [
    require('poi-preset-offline')({
      pluginOptions: {
        excludes: ['_redirects']
      }
    })
  ]
}
