module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint'],
	extends: 'plugin:@typescript-eslint/recommended',
	rules: {
		quotes: ['error', 'single'],
		'@typescript-eslint/indent': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-var-requires': 0,
		'no-mixed-spaces-and-tabs': 0,
		'no-undef': 0
	}
};
