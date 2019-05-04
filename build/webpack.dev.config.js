/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'web',
    entry: {
        index: './src/entry/index',
    },
    output: {
        path: path.join(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000 // receiver 收到的图片有问题，开发过程全部inline
                    }
                }],
            },
            {
                test: /\.svg/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        minetype: 'image/svg+xml'
                    }
                }]
            }, {
                test: /\.mp3/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        minetype: 'image/svg+xml'
                    }
                }]
            }, {
                test: /\.woff|woff2|eot|ttf|otf$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/templates/index.html'
        })
    ]
    /*optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true
                },
                lottie: {
                    chunks: 'initial',
                    name: 'lottie',
                    test: 'lottie',
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }*/
};
