import * as Webpack from 'webpack';
import {Configuration} from 'webpack';
const autoprefixer = require('autoprefixer');
const path = require('path');
require('dotenv').config();

const config: Configuration = {
    mode: 'development',
    entry: {
        client: ['webpack-hot-middleware/client','./src/client/index.tsx']
    },
    output: {
        path: __dirname + '/dev',
        filename: `client-bundle.js`,
        publicPath: '/static'
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    // 2. apply react-loadable prefer way.
                    // ts-loader will convert ts(x) to js first.
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
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
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader",
                },
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.jpg', '.png'],
        alias: {
            Components: path.resolve(__dirname, 'src/components/'),
            Containers: path.resolve(__dirname, 'src/containers/'),
            Utils: path.resolve(__dirname, 'src/utils/')
        }
    },
    devtool: 'inline-cheap-module-source-map',
    target: 'web',
    name: 'client'
};

export default config;