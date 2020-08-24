const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app/client/main.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './client/public/js'),
  }
};