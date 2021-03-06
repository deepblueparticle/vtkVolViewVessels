const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const entry = path.join(__dirname, 'src', 'index.js');
const sourcePath = path.join(__dirname, 'src');
const outputPath = path.join(__dirname, 'dist');
const eslintrcPath = path.join(__dirname, '.eslintrc.js');

module.exports = {
  entry,
  output: {
    path: outputPath,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vt[ip]$/,
        use: 'raw-loader',
      },
      {
        test: /\.glsl$/i,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'shader-loader',
      },
      {
        test: /\.js$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        use: [
          { loader: 'babel-loader', options: { presets: ['es2015'] } },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'stage-2', 'react'],
          plugins: [
            'transform-decorators-legacy',
            ['import', { libraryName: 'antd', style: true }]
          ],
        },
      },
      {
        test: /\.js$/,
        include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
        use: [
          { loader: 'babel-loader', options: { presets: ['es2015'] } },
        ],
      },
      { test: /\.(png|jpg)$/, use: 'url-loader?limit=81920' },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.mcss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { localIdentName: '[sha512:hash:5]-[name]-[local]', modules: true } },
          { loader: 'postcss-loader', options: { plugins: () => [autoprefixer('last 3 version', 'ie >= 10')] } },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=60000&mimetype=application/font-woff',
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=60000',
        include: /fonts/,
      },
      /*{
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [
          /node_modules/,
          /deps\/wslink/,
        ],
        enforce: 'pre',
        options: { configFile: eslintrcPath }
      },*/
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
    alias: {
      PVWStyle: path.join(__dirname, 'node_modules', 'paraviewweb', 'style'),
    },
  },
  externals: [
    (function() {
      var IGNORES = [
        'electron',
      ];
      return function(context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, `require('${request}')`);
        }
        return callback();
      };
    })()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 9999,
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: false,
    quiet: false,
    noInfo: false,
    stats: {
      colors: true,
    },
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module, count) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    }),
  ],
};
