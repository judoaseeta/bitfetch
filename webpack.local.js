const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals');
require('dotenv').config();
const client = require('./webpack.client.dev');
module.exports = [
    client,
    {
        entry: {
            server: './src/server/index.tsx',
        },
        output: {
            path: __dirname + '/dist',
            filename: `[name].js`
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: `[name].${process.env.CSS_VERSION}.css`
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(ts| tsx)$/,
                    use:{
                        loader: "ts-loader"
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                                modules: true,
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                                sourceMap: true
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                // Necessary for external CSS imports to work
                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9', // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009',
                                    }),
                                ],
                            },
                        },
                        {
                            loader: require.resolve('sass-loader'),
                            options: {
                                // 나중에 입력
                            }
                        }
                    ],
                },
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx','.ts', '.tsx'],
        },
        target: 'node',
        externals: [nodeExternals()],
        devtool: 'cheap-module-source-map'
    }
];