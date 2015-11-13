
var config = {
  cache: true,
  context: __dirname + '/src',
  entry: './mindex.es6',
  output: {
    path: __dirname + '/dist',
    filename: 'mindex.js',
    libraryTarget: 'umd',
    library: 'mindex'
  },
  module: {
    preLoaders: [
      {
        test: /\.es6$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6', '.json']
  }
}

module.exports = config
