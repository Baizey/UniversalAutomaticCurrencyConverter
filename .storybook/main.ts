import { StorybookViteConfig } from '@storybook/builder-vite'
import { InlineConfig, mergeConfig } from 'vite'

const config: StorybookViteConfig = {
	stories: [ '../src/ui2/**/*.stories.(ts|tsx)' ],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: '@storybook/preact',
	core: { builder: '@storybook/builder-vite' },
	viteFinal: ( config ) => mergeConfig( config, {} satisfies InlineConfig ),
}

module.exports = config