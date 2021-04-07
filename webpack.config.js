const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = {
	entry: {
		'wall': path.join(__dirname, 'src/index.ts')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	resolve: { extensions: ['.js', '.ts', '.json'] },
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					// 指定特定的ts编译配置，为了区分脚本的ts配置
					configFile: path.resolve(__dirname, './tsconfig.json'),
				},
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public/index.html')
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'assets/',to:'assets/'}
			]
		}),
	]
};

const develop = config => {
	return {
		...config,
		mode: 'development',
		devServer: {
			host: '0.0.0.0',
			port: 8080,
			open: false
		},
		devtool: 'inline-source-map'
	};
};

const production = config => {
	return {
		...config,
		mode: 'production'
	};
};

module.exports = (args, env) => {
	const mode = (args && args.mode) || (env && env.mode) || 'development';
	switch (mode) {
	case 'development':
		return develop(common);
	case 'production':
	default:
		return production(common);
	}
};
