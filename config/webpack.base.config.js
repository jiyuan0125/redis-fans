//const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool:
    process.env.NODE_ENV === 'production'
      ? 'inline-source-map'
      : 'inline-source-map',
  plugins: [
    //new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ELECTORN_RENDERER_PORT: JSON.stringify(
          process.env.ELECTORN_RENDERER_PORT
        ),
      },
    }),
  ],
};
