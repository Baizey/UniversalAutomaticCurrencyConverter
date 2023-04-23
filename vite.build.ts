import preactPlugin from '@preact/preset-vite'
import * as fs from 'fs'
import * as path from 'path'
import {TimeSpan} from 'sharp-time-span'
import {build, defineConfig, InlineConfig, LibraryOptions, mergeConfig} from 'vite'
import zipPlugin from 'vite-plugin-zip-pack'

function remove(dir: string) {
    if (fs.existsSync(path.resolve(__dirname, dir)))
        fs.rmSync(path.resolve(__dirname, dir), {recursive: true, force: true})
}

function create(dir: string) {
    remove(dir)
    const parts = dir.split('/').filter(e => e)
    let partialPath = ''
    parts.forEach(e => {
        if (partialPath) partialPath += "/"
        partialPath += e
        if (!fs.existsSync(path.resolve(__dirname, partialPath)))
            fs.mkdirSync(path.resolve(__dirname, partialPath))
    })
}

const buildDir = 'build'
;(async () => {
    const buildCodeDir = `${buildDir}/unpacked`
    const srcDir = 'src'
    const entryPoints = [
        'popup.tsx',
        'content.tsx',
        'options.tsx',
        'background.ts',
    ].map(entry => {
        const [filename] = entry.split('.')
        return {
            entry: path.resolve(__dirname, srcDir, entry),
            fileName: () => `${filename}.js`,
            name: filename,
            formats: ['umd'],
        } satisfies LibraryOptions
    })

    const config = {
        plugins: [preactPlugin(), zipPlugin( { inDir: buildCodeDir, outDir: buildDir, outFileName: 'packed.zip' } )],
        define: {
            'process.env.NODE_ENV': '"production"',
            'process.version': '"v18.5.0"',
        }
        ,

        build: {
            lib: false,
            target: [],
            emptyOutDir: false,
            sourcemap: true,
            minify: false,
            reportCompressedSize: true,
            outDir: buildCodeDir,
            assetsDir: 'public',
        },
    } satisfies InlineConfig

    // Manual clean build-dir, as we build multiple entry-points in parallel we cannot do it on a build-basis
    create(buildCodeDir)

    const buildStart = Date.now()

    await Promise.all(entryPoints.map(entrypoint =>
        build(mergeConfig(config,
            {
                build: {
                    lib: entrypoint,
                },
            } satisfies InlineConfig))))
    console.log(`Build took ${TimeSpan.since(buildStart).seconds} seconds`)

})()

export default defineConfig({
    build: {
        outDir: `${buildDir}/watcher`,
    },
})