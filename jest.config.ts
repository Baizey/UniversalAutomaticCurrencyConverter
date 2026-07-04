import { Config } from 'jest'

const config: Config = {
	transform: {
		'^.+\\.tsx?$': [ 'ts-jest', { tsconfig: { target: 'es2019', types: [ 'jest', 'node', 'chrome', 'firefox' ] } } ],
	},
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
		'.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/file-mock.js',
	},
	testPathIgnorePatterns: [
		'build',
		'node_modules',
		'\\.cache',
		'public/test',
	],
	testEnvironmentOptions: {
		url: 'http://localhost',
	},
	preset: 'ts-jest/presets/js-with-babel',
}

module.exports = config
