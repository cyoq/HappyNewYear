
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: path.resolve(__dirname, 'index.js'),
  },
  output: {
    // path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    // chunkFilename: '[name].vendor.bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        //IMAGE LOADER
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: "assets/images/"
          }
        }
      },
      {
        // HTML LOADER
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
            }
          }
        ],

      },
     
      {
        test: /\.glb$/i,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: "assets/"
          }
        }
      },
      {
        test: /\.ogg$/i,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: "assets/"
          }
        }
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
  devServer: {
    https: true,
    hot: true,
    contentBase: "./src/",
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    publicPath: '/',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  },
  node: { fs: 'empty' },
};
