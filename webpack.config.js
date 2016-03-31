var webpack = require('webpack');

module.exports = {
    entry: "./public/main.js",
    output: {
        path: './public/scripts/',
        filename: "app.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
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
