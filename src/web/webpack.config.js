var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var rootPath = path.join(__dirname, '/app');
var distPath = path.join(__dirname, '/dist');

var webPackConfig = {
    context: rootPath,
    entry: [
        'whatwg-fetch',
        './App.js'
    ],
    output: {
        filename: 'App.js',
        path: distPath
    },
    resolve: {
        root: [rootPath, path.join(rootPath, '/js')],
        extensions: ['', '.js', '.jsx', '.less']
    },
    module: {
        loaders: [
            {
                test: /\.js(x)?$/,
                exclude: /node_modules|static/,
                loaders: ['react-hot-loader/webpack', 'babel-loader'],
            },
            {
                test: /\.less$|\.css$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/,
                loader: 'file-loader'
            }
        ],
        noParse: [
            /sinon|bindings/
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: 'static' }])
    ],
    devServer: {
        port: 8081,
        quiet: false,
        noInfo: false,

        lazy: false,
        contentBase: '/',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        open: true,
        proxy: {
            '/api': {
                //target: 'https://z5bo-qa.oxagile.com',
                target: 'http://localhost:22222/',
                prependPath: false,
                secure: false,
                bypass: function(req) {
                  console.log('By passed request:', req.path);
                },
                changeOrigin: true
            }
        }
    }
};

module.exports = webPackConfig;
