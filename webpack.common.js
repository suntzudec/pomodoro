const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin'); 
const WorkerPlugin = require('worker-plugin'); 
const FaviconsWebpackPlugin = require('favicons-webpack-plugin'); 
const RobotsTxtWebpackPlugin = require('robotstxt-webpack-plugin');

module.exports = {    
    entry: [ 
		'./src/js/index.js', 
		'./src/sass/nav.sass', 
		'./src/sass/pomodoro.sass', 
		'./src/sass/clock.sass',
		'./src/sass/alarm-clock.sass',
		'./src/sass/stopwatch.sass',
		'./src/sass/404.sass',
		'./src/sass/ringing.sass',
		'./src/sass/settings.sass'
	], 
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Pomodoro',
            inject: false,
            template: require('html-webpack-template'),
            bodyHtmlSnippet: '<noscript>Please enable JavaScript to continue using this application.</noscript><main class="main" id="app"></main>',
			xhtml: true,
			meta: [
				{
					name: "keywords", 
					content: "clock, clock-app, pomodoro, pomodoro clock, stopwatch, stopwatch-app, alarm-clock"	
				},
				{
					name: "viewport", 
					content: "width=device-width, initial-scale=1.0"
				},
				{
					name: "description",
					content: "Clock Application"
				}
			]
		}),
		new HtmlWebpackExternalsPlugin({
			externals: [
				{
					module: "fontAwesome",
					entry: {
						path: "https://use.fontawesome.com/releases/v5.8.1/css/all.css",
						attributes: {
							integrity: "sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf",
							crossorigin: "anonymous"
						}
					}
				}
			]
		}),
		new WorkerPlugin({
		    globalObject: 'self' 
		}),
	    new FaviconsWebpackPlugin({
			logo: './src/assets/android-icon-144x144.png',
			inject: 'force',
			favicons: {
				start_url: '/',
				theme_color: '#010125',
				background: '#010125',
				developerURL: null
			}
		}),
		new RobotsTxtWebpackPlugin()
	],
    module: {
        rules: [ 
			{ 
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: [ /node_modules/ ],
				query: {
					presets: [ 'es2015', 'react' ]
				}
			},
			{
				test: /\.(mp3|wav)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'audio'
				}
			},
			{
				test: /\.(woff|woff2|ttf)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'fonts'
				}
			},
			{
				test: /\.(png|ico|json)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'assets'
				}
			}	
		]
    },
}