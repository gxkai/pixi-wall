const { task, series, parallel, option, argv } = require('just-task');
const { cleanTask, webpackTask, eslintTask } = require('just-scripts');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

option('mode', { default: 'production' });

task('clean', cleanTask({ paths: ['dist'] }));
task('lint', eslintTask({ files: ['src/'] }));
task('server', () => {
	const config = webpackConfig(argv());
	const compiler = webpack(config);
	const devServer = new WebpackDevServer(compiler, config.devServer);
	devServer.listen(8080, '0.0.0.0');
});
task('webpack', webpackTask());

task('build:prod', series('clean', parallel('webpack', 'lint')));
task('build:dev', series('clean', parallel('webpack', 'lint')));
