import preact from '@preact/preset-vite'
import alias from '@rollup/plugin-alias'
import * as fs from 'fs'
import * as path from 'path'
import { TimeSpan } from 'sharp-time-span'
import { build, InlineConfig, LibraryOptions } from 'vite'
import ZipPlugin from 'vite-plugin-zip-pack'

( async () => {
	const buildDir = 'build'
	const buildCodeDir = `${ buildDir }/unpacked`
	const srcDir = 'src'
	const entryPoints = [ 'popup.tsx', 'content.tsx', 'options.tsx', 'background.ts' ]
		.map( entry => {
			const [ filename ] = entry.split( '.' )
			return {
				entry: path.resolve( __dirname, srcDir, entry ),
				fileName: () => `${ filename }.js`,
				name: filename,
				formats: [ 'umd' ],
			} satisfies LibraryOptions
		} )

	const config: InlineConfig = {
		plugins: [
			preact(),
			ZipPlugin( { inDir: buildCodeDir, outDir: buildDir, outFileName: 'packed.zip' } ),
		],
		define: { 'process.env.NODE_ENV': '"production"' },
		build: {
			lib: false,
			target: [],
			emptyOutDir: false,
			sourcemap: false,
			minify: true,
			reportCompressedSize: true,
			outDir: buildCodeDir,
			assetsDir: 'public',
			rollupOptions: {
				output: { globals: {} },
				plugins: [ alias( {
					entries: [
						{ find: 'react', replacement: 'preact/compat' },
						{ find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
						{ find: 'react-dom', replacement: 'preact/compat' },
						{ find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
					],
				} ) ],
			},
		},
	}

	// Manual clean build-dir, as we build multiple entry-points in parallel we cannot do it on a build-basis
	if ( fs.existsSync( path.resolve( __dirname, buildCodeDir ) ) )
		fs.rmSync( path.resolve( __dirname, buildCodeDir ), { recursive: true, force: true } )

	const start = Date.now()

	await Promise.all( entryPoints.map( entrypoint => build( {
		...config,
		build: { ...config.build, lib: entrypoint },
	} ) ) )

	console.log( `Build took ${ TimeSpan.since( start ).seconds } seconds` )
} )()