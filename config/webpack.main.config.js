const base = require('./webpack.base.config');
const path = require('path');
const merge = require('webpack-merge');

const src = path.resolve(__dirname, '../src/main');
const dist = path.resolve(__dirname, '../build/main');

module.exports = merge(base, {
  entry: path.resolve(src, 'main.ts'),
  output: {
    path: dist,
    filename: 'main.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'electron-main',
});
