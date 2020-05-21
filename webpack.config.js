const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		main: ['@babel/polyfill', './src/index.js']
	},
	output: {
		path: path.join(__dirname, 'public'),	
		filename: './js/[name].js'
	},
	target: 'web',
	mode: 'development',
	resolve: { alias: { vue: 'vue/dist/vue.esm.js' } },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.html$/,
				use: [
					{loader: 'html-loader'}
				]
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader']
			},
			{
			test: /\.s(c|a)ss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					{
						loader: 'sass-loader',
						// Requires sass-loader@^7.0.0
						options: {
							implementation: require('sass'),
							fiber: require('fibers'),
							indentedSyntax: true // optional
						},
						// Requires sass-loader@^8.0.0
						options: {
							implementation: require('sass'),
							sassOptions: {
								fiber: require('fibers'),
								indentedSyntax: true // optional
							},
						},
					},
				],
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.php',
			filename: 'index.php',
			
		}),
		new MiniCssExtractPlugin(),
		new CopyPlugin({
		  patterns: [
			{ from: './src/plugins', to: './plugins' }
		  ],
		}),
	]
};