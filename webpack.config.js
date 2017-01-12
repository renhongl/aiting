const path = require('path');
module.exports = {
    entry: path.resolve(__dirname, 'app/app.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js|jsx$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }, 
        {
            test: /\.less$/,
            loader: 'style!css!less'
        },
        {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=25000'
        },
        {
            test: /\.css$/,
            loader: 'style!css'
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    }
};