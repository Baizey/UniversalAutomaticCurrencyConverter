import esbuild from 'esbuild';
import * as fs from "fs/promises";
import * as fsSync from "node:fs";
import * as path from "node:path";
import archiver from "archiver";

const browsers = ['chrome', 'firefox']
const files = ['content.tsx', 'popup.tsx', 'options.tsx', 'background.ts']
const mode = process.argv[2];
console.log(`mode: ${mode}`);

const rootDistDir = `dist`
const rootSrcDir = `src`
const rootAssetsDir = `public`

const isDev = mode !== 'production';
const isProd = !isDev

type VersionFile = {
    version: string
    version_name: string
}

class Lazy<T> {
    private readonly supplier: () => Promise<T>;
    private value: T | null = null;

    constructor(supplier: () => Promise<T>) {
        this.supplier = supplier;
    }

    async get(): Promise<T> {
        if (this.value === null) this.value = await this.supplier()
        return this.value;
    }
}

time('build', async () => {
    const packageJson = new Lazy<VersionFile>(() => fs.readFile(`package.json`).then(e => e.toString()).then(JSON.parse))
    await cleanDir(rootDistDir)
    const version = isProd ? (await packageJson.get()).version : 'dev'
    console.log(`version: ${version}`);
    await Promise.all(browsers.map(bundle));

    async function cleanDir(dir: string) {
        await fs.rm(dir, {recursive: true, force: true});
        await fs.mkdir(dir, {recursive: true});
    }

    async function bundle(browser: string) {
        const unpackedDir = `${rootDistDir}/${browser}_${version}`
        const assetDir = `${rootAssetsDir}/${browser}`
        await sync([
            () => async([
                () => sync([
                    () => copyAssets(assetDir, unpackedDir),
                    () => updateAssetManifest(unpackedDir),
                ]),
                ...files.map(file => () => build(file))
            ]),
            () => zipFolder(unpackedDir, `${unpackedDir}.zip`)
        ])

        async function updateAssetManifest(unpackedDir: string) {
            const manifestFile = `${unpackedDir}/manifest.json`
            const manifest: VersionFile = await fs.readFile(manifestFile).then(e => e.toString()).then(JSON.parse)
            manifest.version = (await packageJson.get()).version
            manifest.version_name = manifest.version
            if (isDev) {
                const now = new Date()
                const stamp = `${now.getUTCFullYear()}/${(now.getUTCMonth() + 1).toString().padStart(2, '0')}/${now.getUTCDay().toString().padStart(2, '0')}|${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}:${now.getUTCSeconds().toString().padStart(2, '0')}`
                manifest.version_name = `${stamp}`
                console.log(manifest.version_name)
            }
            await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2))
        }

        async function copyAssets(src: string, dist: string) {
            await fs.mkdir(dist, {recursive: true});
            const entries = await fs.readdir(src, {withFileTypes: true});
            await Promise.all(
                entries.map(entry =>
                    entry.isDirectory()
                        ? copyAssets(path.join(src, entry.name), path.join(dist, entry.name))
                        : fs.copyFile(path.join(src, entry.name), path.join(dist, entry.name))
                )
            )
        }

        async function build(file: string) {
            await esbuild.build({
                entryPoints: [`${rootSrcDir}/${file}`],
                bundle: true,
                outfile: `${unpackedDir}/${file.replace(/\.tsx?/, '.js')}`,
                platform: 'browser',
                target: 'es2020',
                sourcemap: isDev,
                treeShaking: isProd,
                minify: isProd,
            })
        }

        async function zipFolder(unpackedOut: string, packedOut: string) {
            const archive = archiver('zip', {zlib: {level: 9}});
            const stream = fsSync.createWriteStream(packedOut);
            await new Promise((resolve, reject) => {
                stream.on('close', resolve);
                archive.directory(unpackedOut, false).on('error', reject).pipe(stream)
                archive.finalize().finally(() => stream.close());
            });
        }
    }
}).catch(console.error)

async function async(actions: (() => Promise<any | void>)[]): Promise<void> {
    await Promise.all(actions.map(e => e()))
}

async function sync(actions: (() => Promise<any | void>)[]): Promise<void> {
    for (let supplier of actions) {
        await supplier();
    }
}

async function time(name: string, action: () => Promise<any | void>) {
    const start = Date.now()
    await action()
    const end = Date.now()
    const diff = Number(((end - start) / 1000).toFixed(2))
    console.log(`${name} took ${diff} seconds`)
}