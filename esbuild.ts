// noinspection ES6ConvertRequireIntoImport
const path = require("path");
const esbuild = require("esbuild");

type Options = Parameters<typeof esbuild.build>[0]

(async () => {
    const isWatching = process.argv.includes('--watch')
    const isProd = !isWatching
    const isDev = isWatching
    console.log(`Watching: ${isWatching}`)
    const options = {
        target: ['node21'],
        entryPoints: [path.resolve(__dirname, 'src/Api.ts')],
        outfile: path.resolve(__dirname, 'dist', 'Api.js'),
        platform: 'node',
        bundle: true,
        logLevel: 'info',
        sourcemap: isDev,
        minify: isProd,
    } satisfies Options

    const start = performance.now()
    if (isWatching) {
        const context = await esbuild.context(options);
        await context.watch()
    } else {
        await esbuild.build(options);
    }
    const end = performance.now()
    console.log(`Build took ${(end - start).toFixed(2)}ms`)

})();