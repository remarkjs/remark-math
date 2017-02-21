module.exports = {
  entry: {
    main: './examples/webpack/entry.js'
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    publicPath: 'http://localhost:8080/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  devServer: {
    publicPath: 'http://localhost:8080/',
    contentBase: 'examples/webpack/assets',
    stats: 'errors-only'
  }
}
