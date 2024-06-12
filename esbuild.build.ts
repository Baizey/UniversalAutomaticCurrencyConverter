import {build} from 'esbuild';
import * as fs from "node:fs";
import * as path from "node:path";
import archiver from "archiver";

const browsers = ['chrome', 'firefox']
const files = ['content.tsx', 'popup.tsx', 'options.tsx', 'background.ts']
const mode = process.argv[2];
console.log(`mode: ${mode}`);

const rootDistDir = `dist`
const rootSrcDir = `src`
const rootAssetsDir = `public`

;(async () => {
    cleanDir(rootDistDir)
    await time('build', () => Promise.all(browsers.map(bundle)));
})()

async function bundle(browser: string) {
    const isDev = mode !== 'production';
    const isProd = !isDev

    const assetDir = `${rootAssetsDir}/${browser}`
    let version = 'dev'
    if (isProd) {
        const manifest = JSON.parse(fs.readFileSync(`${assetDir}/manifest.json`).toString()) as { version: string }
        version = manifest.version
    }

    const unpackedDir = `${rootDistDir}/${browser}_${version}`
    copyAssets(assetDir, unpackedDir)
    await Promise.all(
        files.map(file => build({
            entryPoints: [`${rootSrcDir}/${file}`],
            bundle: true,
            outfile: `${unpackedDir}/${file.replace(/\.tsx?/, '.js')}`,
            platform: 'browser',
            target: 'es2020',
            sourcemap: isDev,
            treeShaking: isProd,
            minify: isProd,
        })))
    await zipFolder(unpackedDir, `${unpackedDir}.zip`)
}

function copyAssets(src: string, dist: string) {
    if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist, {recursive: true});
    }
    const entries = fs.readdirSync(src, {withFileTypes: true});
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dist, entry.name);
        if (entry.isDirectory()) {
            copyAssets(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function cleanDir(dir: string) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, {recursive: true, force: true});
    }
    fs.mkdirSync(dir, {recursive: true});
}

async function zipFolder(unpackedOut: string, packedOut: string) {
    const archive = archiver('zip', {zlib: {level: 9}});
    const stream = fs.createWriteStream(packedOut);
    await new Promise((resolve, reject) => {
        stream.on('close', resolve);
        archive.directory(unpackedOut, false).on('error', reject).pipe(stream)
        archive.finalize().finally(() => stream.close());
    });
}

async function time(name: string, action: () => Promise<any | void>) {
    const start = Date.now()
    await action()
    const end = Date.now()
    const diff = Number(((end - start) / 1000).toFixed(2))
    console.log(`${name} took ${diff} seconds`)
}