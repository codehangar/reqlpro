'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'electron-renderer',
  devtool: 'eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.join(__dirname, 'public/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dev/'),
    filename: 'dist.js',
    publicPath: 'http://localhost:3001/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: 'public/about.html',
      inject: 'body',
      filename: 'about.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  eslint: {
    configFile: '.eslintrc',
    failOnWarning: false,
    failOnError: false
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel",
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?name=./dist_files/[hash].[ext]&limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader?name=./dist_files/[name].[ext]"
    }, {
      test: /\.(jpg|jpeg|gif|png|ico|svg|xml)$/,
      exclude: /node_modules/,
      loader: 'file-loader?name=[path][name].[ext]&context=./public'
    }, {
      test: /\.(json)$/,
      loader: 'json-loader'
    }]
  }
};
