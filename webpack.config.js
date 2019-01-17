var path = require("path");
var webpack = require("webpack");
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: Object.assign(
                {},
                { publicPath: '../../' }
            ),
        },
        {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        },
        {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                        stage: 3,
                    }),
                ],
                sourceMap: true,
            },
        },
    ];
    if (preProcessor) {
        loaders.push({
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: true,
            },
        });
    }
    return loaders;
};

module.exports = {
    target: "web",
    entry: {
        main: "./src/main.ts",
        configuration: "./src/configuration.ts"
    },
    output: {
        filename: "[name].js",
        libraryTarget: "amd"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    resolve: {
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [path.resolve("./src"), "node_modules"],
        alias: {
            react: path.resolve('node_modules/react'),
        },
    },
    module: {
        rules: [
            {
                oneOf: [
                    { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        loader: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: true,
                        }),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true,
                    },
                    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
                    // using the extension .module.css
                    {
                        test: cssModuleRegex,
                        loader: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: true,
                            modules: true,
                            getLocalIdent: getCSSModuleLocalIdent,
                        }),
                    },
                    // Opt-in support for SASS. The logic here is somewhat similar
                    // as in the CSS routine, except that "sass-loader" runs first
                    // to compile SASS files into CSS.
                    // By default we support SASS Modules with the
                    // extensions .module.scss or .module.sass
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        loader: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: true,
                            },
                            'sass-loader'
                        ),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true,
                    },
                    // Adds support for CSS Modules, but using SASS
                    // using the extension .module.scss or .module.sass
                    {
                        test: sassModuleRegex,
                        loader: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: true,
                                modules: true,
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                            'sass-loader'
                        ),
                    },
                    // Process application JS with Babel.
                    // The preset includes JSX, Flow, and some ESnext features.
                    {
                        test: /\.(js|mjs|jsx)$/,
                        // include: "src/",

                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),

                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                                            },
                                        },
                                    },
                                ],
                            ],
                            cacheDirectory: true,
                            // Save disk space when time isn't as important
                            cacheCompression: true,
                            compact: true,
                        },
                    },
                    // Compile .tsx?
                    {
                        test: /\.(ts|tsx)$/,
                        // include: "src/",
                        loader: require.resolve('ts-loader'),
                        options: {
                            transpileOnly: true,      // disable type checker to speed up compilation - we will use it in fork plugin
                            configFile: "tsconfig.json",
                        },
                    },
                    // Process any JS outside of the app with Babel.
                    // Unlike the application JS, we only compile the standard ES features.
                    {
                        test: /\.(js|mjs)$/,
                        exclude: /@babel(?:\/|\\{1,2})runtime/,
                        loader: require.resolve('babel-loader'),
                        options: {
                            babelrc: false,
                            configFile: false,
                            compact: false,
                            presets: [
                                [
                                    require.resolve('babel-preset-react-app/dependencies'),
                                    { helpers: true },
                                ],
                            ],
                            cacheDirectory: true,
                            // Save disk space when time isn't as important
                            cacheCompression: true,

                            // If an error happens in a package, it's possible to be
                            // because it was compiled. Thus, we don't want the browser
                            // debugger to show the original code. Instead, the code
                            // being evaluated would be much more helpful.
                            sourceMaps: false,
                        },
                    },
                    // "file" loader makes sure assets end up in the `build` folder.
                    // When you `import` an asset, you get its filename.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        loader: require.resolve('file-loader'),
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise be processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ]
            }
        ]
    },
    plugins: [
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: false,
            meta: false,
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        })
    ],
}