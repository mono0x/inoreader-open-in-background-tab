import path from 'path'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ChromeExtensionReloader from 'webpack-chrome-extension-reloader'

export default {
  entry: {
    background: path.join(__dirname, 'src', 'scripts', 'background.js'),
    content: path.join(__dirname, 'src', 'scripts', 'content.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'scripts/[name].js'
  },
  target: 'web',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(__dirname, 'dist')
      ]
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'manifest.json'),
          to: path.join(__dirname, 'dist'),
          transform: (content, path) => {
            return Buffer.from(JSON.stringify({
              ...JSON.parse(content.toString()),
              version: process.env.npm_package_version
            }))
          }
        }
      ]
    }),
    ...(process.env.NODE_ENV === 'development'
      ? [
          new ChromeExtensionReloader({
            entries: {
              background: 'background',
              contentScript: [
                'content'
              ]
            }
          })
        ]
      : []
    )
  ]
}
