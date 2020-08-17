const base = require('./webpack.base.config');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');

const src = path.resolve(__dirname, '../src/renderer');
const dist = path.resolve(__dirname, '../build/renderer');

module.exports = merge(base, {
  entry: path.resolve(src, 'main.tsx'),
  output: {
    path: dist,
    filename: 'renderer.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.lua$/,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@src': path.resolve(__dirname, '../src/renderer'),
    },
  },
  plugins: [
    new webpack.IgnorePlugin(/^hiredis$/),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: path.resolve(src, 'index.html'), to: dist }],
    }),
  ],
  devServer: {
    inline: true,
    hot: true,
    stats: 'minimal',
    contentBase: dist,
    overlay: true,
    port: process.env.ELECTORN_RENDERER_PORT,
  },
  target: 'electron-renderer',
  // externals: [nodeExternals()]
});
