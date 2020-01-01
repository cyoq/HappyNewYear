
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjectPlugin = require('html-webpack-inject-plugin').default;
const HtmlWebpackInjector = require('html-webpack-injector');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJS = require("uglify-es");

module.exports = {
    mode: 'production',
    entry: {
      main_head: path.resolve(__dirname, 'src/js/index.js'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].vendor.bundle.js',
      publicPath: 'dist/',
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
            test: /\.patt$/i,
            use: {
              loader: 'file-loader',
              options: {
                outputPath: "assets/patterns/",
                esModule: false,
              }
            }
          },
          {
            test: /\.glb$/i,
            use: {
              loader: 'file-loader',
              options: {
                outputPath: "assets/models/",
                esModule: false,
              }
            }
          },
          {
            test: /\.dat$/,
            use: {
              loader: 'file-loader',
              options: {
                outputPath: "assets/data/",
                esModule: false,
              }
            }
          }
          
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
            template: "./src/templates/index.html",
            filename: "./../index.html",
            inject: true,
        }),
        new HtmlWebpackInjector(),
        new CopyPlugin([
          { 
            from: './src/third_party/aframe-ar.js', 
            to: './third_party/aframe-ar.js', 
            transform: function (content, path) {               
              return UglifyJS.minify(content.toString()).code;  
            },    
          },
        ]),
        new HtmlWebpackInjectPlugin({
          externals: [
            {
              tag: 'script',
              attrs: {
                src: './dist/third_party/aframe-ar.js',
                type: 'text/javascript'
              }
            }
          ],
          parent: 'head', // default is head
          prepend: false // default is false
        })
    ],
    node: {fs: 'empty'}, 
};
