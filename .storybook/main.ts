import type { StorybookViteConfig } from '@storybook/builder-vite'

const config: StorybookViteConfig = {
	stories: [ '../src/ui/**/*.stories.(ts|tsx)' ],
	addons: [ '@storybook/addon-links', '@storybook/addon-essentials' ],
	core: { builder: '@storybook/builder-vite' },
	viteFinal: ( config ) => ( {
		...config,
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve?.alias,
				stream: 'stream-browserify',
			},
		},
	} ),
}

module.exports = config