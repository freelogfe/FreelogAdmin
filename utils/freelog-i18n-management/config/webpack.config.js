
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const CWD = process.cwd()
const appName = require(path.join(CWD, 'package.json')).name
const [ appEntry, appOutputPath ] = [ path.join(CWD, 'src/main.js'), path.join(CWD, 'dist') ]
const { name } = require('../package');

module.exports = {
  mode: 'development',
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  entry: `${appEntry}`, 
  output: {
    path: `${appOutputPath}`,
    filename: `${appName}.js`,
    publicPath: '/',
    // 把子应用打包成 umd 库格式
    library: `${name}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${name}`,
  },
  resolve: {
    extensions: [ '.mjs', '.js', '.vue', '.jsx','.json', '.wasm' ],
  },
  module: { 
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          }
        }],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.m?jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.((c|sa|sc|le)ss)$/i,
        use: [ 
          'style-loader', 
          'vue-style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'sass-loader',
          'less-loader', 
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 138192,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'assets/fonts/[name].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: {
                loader: 'file-loader',
                otpions: {
                  name: 'assets/images/[name].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              otpions: {
                name: 'assets/images/[name].[ext]'
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'assets/media/[name].[ext]'
                }
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '"/"'
        }
      }
    ),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
