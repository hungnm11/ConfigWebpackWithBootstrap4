const path = require('path');
// const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';


const extractSass = new ExtractTextPlugin({
  filename: '[name].style.css',
  allChunks: true,
  disable: !isProd
});
const extractCSS = new ExtractTextPlugin({
  filename: '[name].bundle.css',
  allChunks: true,
  disable: !isProd
});

const cssDev = [{
  loader: 'style-loader', // inject CSS to page
}, {
  loader: 'css-loader', // translates CSS into CommonJS modules
}, {
  loader: 'postcss-loader', // Run post css actions
  options: {
    plugins: function () { // post css plugins, can be exported to postcss.config.js
      return [
        require('precss'),
        require('autoprefixer')
      ];
    }
  }
}, {
  loader: 'sass-loader' // compiles SASS to CSS
}]

const cssProd = extractSass.extract({
  use: [{
    loader: 'css-loader'
  }, {
    loader: 'sass-loader'
  }],
  fallback: 'style-loader',
  publicPath: '/dist'
})

const cssConfig = isProd ? cssProd : cssDev;
const portConfig = isProd ? 9000 : 8080;

// const extractSass = new ExtractTextPlugin({
//     filename: "[name].[contenthash].css",
//     disable: process.env.NODE_ENV === "development"
// });

module.exports = {
  entry: {
    app: './src/index.js',
    vendor: ['lodash'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    extractCSS,
    extractSass,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // In case you imported plugins individually, you must also require them here:
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            presets: ['es2015','react']
        }
      },
      {
        test: /\.less$/,
        use: [ 'style-loader', 'css-loader', 'less-loader' ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: { limit: 1000 }
        }]
      },
      {
        test: /\.(sass|scss)$/,
        use: cssConfig
      },
       {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [{
            loader: 'css-loader',
          }],
          fallback: 'style-loader'
        })
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: portConfig,
    noInfo: true,
    watchContentBase: true,
    hot: false,
    // inline: false,
    // open: true
  },
  devtool: "cheap-eval-source-map",
  devtool: "inline-source-map"
};