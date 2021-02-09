const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'cppParser',
    libraryTarget: 'umd',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { 'loose': true }],
              ['@babel/plugin-proposal-optional-chaining', { 'loose': true }],
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-transform-async-to-generator'
            ]
          }
        }
      },
      {
        test: /\.(cpp|c|hpp|h)$/,
        use: 'raw-loader',
      },
    ]
  }
};