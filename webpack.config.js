var webpack = require('webpack');

module.exports = {
    entry: "./public/main.js",
    output: {
        path: './public',
        filename: "dist.js"
    },
    module: {
        loaders: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        }, {
          test: /\.scss$/,
          loaders: ["style", "css", "sass"]
        }, {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?name=./dist_files/[hash].[ext]&limit=10000&mimetype=application/font-woff"
        }, {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file-loader?name=./dist_files/[hash].[ext]"
        }]
    },
    plugins: [
        // Keep this off for deving
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
        new webpack.OldWatchingPlugin() // For some reason this fixed watch not working properly
    ]
};
