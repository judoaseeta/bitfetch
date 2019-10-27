const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
require('dotenv').config();

module.exports = {
    mode: 'development',
        name: 'server',
        entry: {
            server: './src/server/index.tsx',
        },
        output: {
            path: __dirname + '/dev/server',
            filename: `[name].js`
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        // ts-loader will convert ts(x) to js first.
                        {
                            loader: "ts-loader"
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: require.resolve('css-loader/locals'),
                            options: {
                                importLoaders: 2,
                                modules: {
                                    mode: 'local',
                                    localIdentName: '[path][name]__[local]--[hash:base64:5]',
                                },
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
                        },
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
        externals: [nodeExternals()],
        devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.jpg', '.png', '.scss'],
        alias: {
            Components: path.resolve(__dirname, 'src/components/'),
            Containers: path.resolve(__dirname, 'src/containers/'),
            Utils: path.resolve(__dirname, 'src/utils/')
        }
    },
    plugins: [
        new NodemonPlugin({
            watch: './dev/server',
            script: './dev/server/server.js',
            ext: 'js'
        }),
    ],
    target:'node',
};