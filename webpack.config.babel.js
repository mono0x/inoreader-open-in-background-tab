import path from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
  entry: {
    background: path.join(__dirname, 'src', 'scripts', 'background.js'),
    content: path.join(__dirname, 'src', 'scripts', 'content.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'scripts/[name].js',
  },
  target: 'web',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: { loader: 'babel-loader' },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(__dirname, 'dist'),
    ]),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'src', 'manifest.json'),
        to: path.join(__dirname, 'dist'),
        transform: (content, path) => {
          var manifest = JSON.parse(content.toString());
          manifest.version = process.env.npm_package_version;
          return Buffer.from(JSON.stringify(manifest));
        },
      },
    ]),
  ],
};
