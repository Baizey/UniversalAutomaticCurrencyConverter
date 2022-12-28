const react = require( '@vitejs/plugin-react' )
const { build } = require( 'vite' )
const path = require( 'path' )
const { default: zip } = require( 'vite-plugin-zip-pack' )

const entries = [
	{ entry: path.resolve( __dirname, './src/content.tsx' ), name: 'content', fileName: () => `content.js` },
	{ entry: path.resolve( __dirname, './src/options.tsx' ), name: 'options', fileName: () => `options.js` },
	{ entry: path.resolve( __dirname, './src/popup.tsx' ), name: 'popup', fileName: () => `popup.js` },
	{ entry: path.resolve( __dirname, './src/background.ts' ), name: 'background', fileName: () => `background.js` },
]
// https://vitejs.dev/config/
/** @type {import('vite').InlineConfig} */
const config = {
	plugins: [ react(), zip() ],
	build: {
		sourcemap: true,
		minify: true,
		reportCompressedSize: true,
		outDir: 'dist',
		assetsDir: 'public',
		rollupOptions: {
			external: [ 'react' ],
			output: {
				globals: {
					react: 'React',
				},
			},
		},
	},
}

entries.forEach( async lib => await build( {
	...config,
	build: { ...config.build, lib },
} ) )
