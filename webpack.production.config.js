'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  target: 'electron-renderer',
  entry: [
    path.join(__dirname, 'app/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'dist-[hash].js',
    publicPath: ''
  },
  plugins: [
    // webpack gives your modules and chunks ids to identify them. Webpack can vary the
    // distribution of the ids to get the smallest id length for often used ids with
    // this plugin
    new webpack.optimize.OccurenceOrderPlugin(),

    // handles creating an index.html file and injecting assets. necessary because assets
    // change name because the hash part changes. We want hash name changes to bust cache
    // on client browsers.
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: 'app/about.html',
      filename: 'about.html'
    }),
    // handles uglifying js
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    // creates a stats.json
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    // plugin for passing in data to the js, like what NODE_ENV we are in.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  module: {
    // loaders handle the assets, like transforming sass to css or jsx to js.
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.(css|scss)$/,
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
      loader: 'file-loader?name=[path][name].[ext]&context=./app'
    }, {
      test: /\.(json)$/,
      loader: 'json-loader'
    }, {
      test: /\.node$/,
      loader: 'node-loader'
    }]
  }
};
