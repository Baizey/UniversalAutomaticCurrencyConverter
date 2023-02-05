import preactPlugin from '@preact/preset-vite'
import * as fs from 'fs'
import * as path from 'path'
import { TimeSpan } from 'sharp-time-span'
import { build, defineConfig, InlineConfig, LibraryOptions, mergeConfig } from 'vite'
import zipPlugin from 'vite-plugin-zip-pack'

function cleanBuild( buildCodeDir: string ) {
	if ( fs.existsSync( path.resolve( __dirname, buildCodeDir ) ) )
		fs.rmSync( path.resolve( __dirname, buildCodeDir ), { recursive: true, force: true } )
	fs.mkdirSync( path.resolve( __dirname, buildCodeDir ) )
}

const buildDir = 'build'
;( async () => {
	const buildCodeDir = `${ buildDir }/unpacked`
	const srcDir = 'src'
	const entryPoints = [
		'popup.tsx',
		'content.tsx',
		'options.tsx',
		'background.ts',
	].map( entry => {
		const [ filename ] = entry.split( '.' )
		return {
			entry: path.resolve( __dirname, srcDir, entry ),
			fileName: () => `${ filename }.js`,
			name: filename,
			formats: [ 'umd' ],
		} satisfies LibraryOptions
	} )

	const config = {
		plugins: [
			preactPlugin(),
			zipPlugin( { inDir: buildCodeDir, outDir: buildDir, outFileName: 'packed.zip' } ),
		],
		define: {
			'process.env.NODE_ENV': '"production"',
			'process.version': '"v18.5.0"',
		}
		,

		build: {
			lib: false,
			target: [],
			emptyOutDir: false,
			sourcemap: false,
			minify: false,
			reportCompressedSize: true,
			outDir: buildCodeDir,
			assetsDir: 'public',
		},
	} satisfies InlineConfig

	// Manual clean build-dir, as we build multiple entry-points in parallel we cannot do it on a build-basis
	cleanBuild( buildCodeDir )

	const start = Date.now()

	await Promise.all( entryPoints.map( entrypoint =>
		build( mergeConfig( config,
			{
				build: {
					lib: entrypoint,
				},
			} satisfies InlineConfig ) ) ) )

	console.log( `Build took ${ TimeSpan.since( start ).seconds } seconds` )
} )()

export default defineConfig( {
	build: {
		outDir: `${ buildDir }/watcher`,
	},
} )