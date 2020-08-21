const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const port = 3000;

const MODE = process.env.NODE_ENV;

if (MODE === 'production') {
  console.log('production 모드입니다.');
} else if (MODE === 'development') {
  console.log('development 모드입니다.');
} else {
  throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}

module.exports = {
  node: {
    fs: 'empty',
  },
  mode: MODE,
  entry: './src/index.tsx',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle_[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.ts|tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // 오른쪽에서 왼쪽 순서로 실행됨
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/assets/favicon.ico',
    }),
    new Dotenv({
      path:
        MODE === 'production'
          ? path.resolve(__dirname, './.env.production')
          : path.resolve(__dirname, './.env.development'),
    }),
    new webpack.EnvironmentPlugin(['GOOGLE_CLIENT_ID', 'SERVER_URL']),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: 'localhost',
    port,
    open: true,
    historyApiFallback: true,
    hot: true,
    contentBase: `${__dirname}/dist`,
    inline: true,
  },
};
