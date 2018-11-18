const path = require('path')

const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const parts = require('./webpack.parts.config.js')

const pluginsConfig = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "examples/src/index.html"),
      filename: "./index.html"
    })
  ]
})

const moduleConfig = () => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        include: [path.resolve(__dirname, 'examples/src')]
      },
    ]
  }
})

const resolveConfig = () => ({resolve: {extensions: ['.js', '.jsx', '.css']}})

const devServerConfig = () => (merge([
  {devServer: {contentBase: path.join(__dirname, 'dist')}},
  {devServer: parts.statsConfig()}
]))

const config = merge([
  {
    entry: path.resolve(__dirname, './examples/src/index.js'),
    output: {
      path: __dirname + '/dist.dev',
      filename: '[name].js'
    },
    mode: 'development',
    devtool: 'cheap-eval-source-map',
  },
  moduleConfig(),
  resolveConfig(),
  pluginsConfig(),
  devServerConfig()
])

module.exports = config
