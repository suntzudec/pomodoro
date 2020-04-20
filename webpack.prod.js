const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const workboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
    mode: 'production', 
    devtool: 'source-map',
    module: {
        rules: [ 
			{
				test: /\.sass$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader", 
					"sass-loader" 
				]
			} 
		]
    },
    plugins: [
        new CleanWebpackPlugin({ 
			exclude: [ 'dist/css','dist/js' ]
		}),
		new MiniCssExtractPlugin({              
            filename: "css/[name].css"
        }),
		new workboxPlugin.GenerateSW({
			swDest: 'sw.js',
			clientsClaim: true,
			skipWaiting: true
		})
	]
})