const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const path = require('path');
const argv = require('yargs').argv;

const extractSass = new ExtractTextPlugin({
    filename: "style.css"
});

const isDev = argv.env !== 'production';
const hot = !!argv.hot;

const assetsNames = isDev ? '[name]' : '[name]-[hash]';

let plugins = [
    extractSass,
    new webpack.ProvidePlugin({}),
    new HtmlWebpackPlugin({
        title: 'React Image Editor',
        template: './src/index.html',
        filename: 'index.html'
    })
];

if (hot) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (!isDev) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    plugins.push(new webpack.optimize.AggressiveMergingPlugin());
    plugins.push(
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js|css)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

module.exports = {
    watch: true,
    entry: [
        './src/index.tsx',
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: assetsNames + '.js'
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.yml$/,
                loader: 'json-loader!yaml-loader',
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader", options: {
                            sourceMap: isDev,
                            importLoaders: true,
                            minimize: !isDev,
                            module: true,
                            localIdentName: '[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader', options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        browsers: ['last 2 versions', 'ie >= 9'],
                                        cascade: true
                                    })
                                ];
                            }
                        }
                    }, {
                        loader: "sass-loader", options: {
                            sourceMap: isDev
                        }
                    }]
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&publicPath=&name=images/' + assetsNames + '.[ext]'
                ]
            },
            {
                test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?publicPath=&name=fonts/' + assetsNames + '.[ext]'
            }
        ],
    },
    stats: {
        colors: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            styles: path.join(__dirname, 'src/styles')
        },
    },

    devtool: isDev ? 'source-map' : '',

    devServer: {
        hot: true,
        watchContentBase: true,
        stats: 'errors-only',
    },
};
