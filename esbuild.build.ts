import esbuild from 'esbuild';
import * as fs from "fs/promises";
import * as fsSync from "node:fs";
import * as path from "node:path";
import { ZipArchive } from "archiver";

const browsers = ['chrome', 'firefox']
const files = ['content.ts', 'popup.ts', 'options.ts', 'background.ts']

function getArg(argName: string): null | string {
    const index = process.argv.indexOf(`--${argName}`)
    const value = process.argv[index + 1]
    if (!value || value.startsWith('--')) throw Error(`value after ${argName} is missing value`)
    return value
}

function hasArg(argName: string): boolean {
    return process.argv.indexOf(`--${argName}`) !== -1
}

const shouldWatch = hasArg("watch");
const isProd = hasArg("prod")
const isDev = !isProd

console.log(`mode: ${isProd ? 'production' : 'development'}`);

const rootDistDir = `dist`
const rootSrcDir = `src`
const rootAssetsDir = `public`

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

const runBuild = (title: string) => time(title, async () => {
    const packageJson = new Lazy<VersionFile>(() => fs.readFile(`package.json`).then(e => e.toString()).then(JSON.parse))
    await cleanDir(rootDistDir)
    const version = isProd ? (await packageJson.get()).version : 'dev'
    await Promise.all(browsers.map(bundle));

    async function cleanDir(dir: string) {
        await fs.rm(dir, {recursive: true, force: true});
        await fs.mkdir(dir, {recursive: true});
    }

    async function bundle(browser: string) {
        const unpackedDir = `${rootDistDir}/${browser}_${version}`
        const assetDir = `${rootAssetsDir}/${browser}`
        const sharedAssetDir = `${rootAssetsDir}/base`
        await sync([
            () => async([
                () => sync([
                    () => copyAssets(assetDir, unpackedDir),
                    () => bundleSharedCss(sharedAssetDir, unpackedDir),
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
                //console.log(manifest.version_name)
            }
            await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2))
        }

        async function bundleSharedCss(src: string, dist: string) {
            async function getFiles(at: string): Promise<string[]> {
                const entries = await fs.readdir(at, {withFileTypes: true});
                const unresolvedFiles = entries.map(entry =>
                    entry.isDirectory()
                        ? getFiles(path.join(src, entry.name))
                        : Promise.resolve([path.join(src, entry.name)])
                )
                const files = await Promise.all(unresolvedFiles)
                return files.flatMap(it => it)
            }

            const files = await getFiles(src)
            const cssContent = await Promise.all(files
                .filter(it => it.endsWith(".css"))
                .map(it => fs.readFile(it).then(it => it.toString())))
            await fs.writeFile(`${dist}/shared.css`, cssContent.join("\n"), "utf8")
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

        async function getFiles(directory: string, filetype: string): Promise<string[]> {
            const entries = await fs.readdir(directory, {withFileTypes: true});
            const files: string[] = [];
            for (const entry of entries) {
                const fullPath = path.join(directory, entry.name);
                if (entry.isDirectory()) {
                    files.push(...(await getFiles(fullPath, filetype)));
                } else if (entry.isFile() && entry.name.endsWith(`.${filetype}`)) {
                    files.push(fullPath);
                }
            }
            return files;
        }

        async function zipFolder(unpackedOut: string, packedOut: string) {
            const archive = new ZipArchive({zlib: {level: 9}});
            const stream = fsSync.createWriteStream(packedOut);
            await new Promise((resolve, reject) => {
                stream.on('close', resolve);
                archive.directory(unpackedOut, false).on('error', reject).pipe(stream)
                archive.finalize().finally(() => stream.close());
            });
        }
    }
})

runBuild('build').catch(console.error)
if (shouldWatch) {
    let lastChange: null | number = null;
    ['src', 'public'].forEach(dir => {
        fsSync.watch(`./${dir}`, {recursive: true}, (eventType, filename) => {
            //console.log(`${filename} changed (${eventType})`);
            lastChange = Date.now();
        });
    })
    setInterval(() => {
        if (lastChange && Date.now() > lastChange + 1000) {
            runBuild('rebuild').catch(console.error)
            lastChange = null
        }
    }, 500)
}


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
