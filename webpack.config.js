const path = require('path')

module.exports = {
  entry: './client/index.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'client/dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/, use: 'babel-loader'
      },
      {
        test: /\.css$/, use: ['style-loader', 'css-loader']
      }
    ]
  }
}
