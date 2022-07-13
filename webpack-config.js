/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

const WebPackIgnorePlugin = {
  checkResource: function (resource) {
    const lazyImports = [
      '@nestjs/microservices',
      '@nestjs/platform-express',
      'cache-manager',
      'class-validator',
      'class-transformer',
    ];

    if (!lazyImports.includes(resource)) return false;

    try {
      require.resolve(resource);
    } catch (err) {
      return true;
    }

    return false;
  },
};

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
            path.resolve(__dirname, 'test'),
          ],
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin(WebPackIgnorePlugin),
  ],
  optimization: {
    minimize: true,
  },
  performance: {
    maxEntrypointSize: 1000000000,
    maxAssetSize: 1000000000,
  },
};
