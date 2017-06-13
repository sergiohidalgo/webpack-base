const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const BuildManifestPlugin = require('./src/webpack-plugins/BuildManifestPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var inProduction = (process.env.NODE_ENV == 'production');

module.exports = {
	entry: {
		app: ['./src/main.js', './src/bootstrap/bootstrap', './src/bootstrap/import.sass', './src/main.sass'],
		vendor: ['jquery', 'tether', 'bootstrap'],
	},
	output: {
		path: path.resolve(__dirname, './app'),
		filename: '[name].[chunkhash].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ['css-loader', 'sass-loader']
				}),
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ['css-loader']
				}),
			},
			{
				test: /\.(svg|eot|ttf|woff|woff2)$/,
				loader: 'file-loader'
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				loaders: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[hash].[ext]',
							limit: 10000
						}
					},
					'img-loader'
				]
			},
			{
				test: /\.js/,
				exclude: '/node_modules/',
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['app'], {
			root: __dirname,
			verbose: true,
			dry: false,
			exclude: ['.gitkeep']
		}),
		new BuildManifestPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			minify : { collapseWhitespace : inProduction}
		}),
		new ExtractTextPlugin('[name].[chunkhash].css'),
		new webpack.LoaderOptionsPlugin({
			minimize: inProduction
		}),
		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, 'src/index.html')),
			minimize: inProduction
		})
	]
};