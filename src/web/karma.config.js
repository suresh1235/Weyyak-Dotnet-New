var webpack = require('webpack');

var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';
webpackConfig.externals = webpackConfig.externals || {};

const externals = webpackConfig.externals;
externals.cheerio = 'window';
externals['react/addons'] = true;
externals['react/lib/ExecutionEnvironment'] = true;
externals['react/lib/ReactContext'] = true;

module.exports = function (config) {
    webpackConfig.plugins.push(new webpack.DefinePlugin({__env__: config.env}));

    config.set({
        browsers: [ 'PhantomJS', 'Chrome' ],
        files: [
            './node_modules/whatwg-fetch/fetch.js',
            './node_modules/babel-polyfill/dist/polyfill.js',
            './tests/tests.bundle.js'
        ],
        frameworks: [ 'chai', 'mocha', 'sinon' ],
        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-chai',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-sinon'
        ],
        preprocessors: {
            'tests/tests.bundle.js': [ 'webpack', 'sourcemap' ]
        },
        reporters: [ 'dots' ],
        singleRun: true,
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};