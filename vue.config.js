const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
      port: 7000
  }
})

module.exports = {
  chainWebpack: config =>{
      config.plugin('html')
        .tap(args => {
          args[0].title = "ktpQuery";
          args[0].keywords = "课堂派查询";
          args[0].description = "实现了简单的课堂派查询功能";
          return args;
        })
    },
};