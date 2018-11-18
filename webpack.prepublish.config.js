/*** webpack.config.js ***/

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

const merge = require('webpack-merge')

const libraryName = 'MyComponent' // const pkg = require('./package.json'); // pkg.name;

module.exports = {
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'index.js',
    library: libraryName,
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true
  },
  entry: path.join(__dirname, 'src/index.js'),
  mode: 'development',
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: true
            },
          },
        ]
      //   use: ["style-loader", "css-loader"]
      },
      {
        test: /\.styl$/,
        use: [
          // ExtractCssChunks.loader,
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: true
            },
          }, 'stylus-loader']
        // ,ExtractTextPlugin.extract(
          // 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!stylus?resolve url'),
        // loader: 'style!css!stylus?resolve url',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
  ],

  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils/'),
      ui: path.resolve(__dirname, 'src/ui/'),
      enums: path.resolve(__dirname, 'src/enums/'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    extensions: ['.js', '.jsx', '.styl', '.css'],
  },
  externals: {
      // Don't bundle react or react-dom
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM'
      },
  },
};
