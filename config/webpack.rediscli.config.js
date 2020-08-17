const base = require('./webpack.base.config');
const path = require('path');
const merge = require('webpack-merge');

const src = path.resolve(__dirname, '../src/rediscli');
const dist = path.resolve(__dirname, '../build/rediscli');

module.exports = merge(base, {
  entry: path.resolve(src, 'main.ts'),
  output: {
    path: dist,
    filename: 'rediscli.bundle.js',
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
  target: 'node',
});
