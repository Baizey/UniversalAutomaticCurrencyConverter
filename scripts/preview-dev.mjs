import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const root = path.resolve( __dirname, ".." );
const distRoot = path.join( root, "dist", "chrome_dev" );
const port = Number( process.env.PORT || 4173 );
const previewStartedAt = Date.now();
let server = null;
let buildExitCode = null;

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".zip": "application/zip",
};

await rm( distRoot, { recursive: true, force: true } );

const build = spawn( process.platform === "win32" ? "npm.cmd" : "npm", [ "run", "build-dev" ], {
    cwd: root,
    stdio: [ "ignore", "pipe", "pipe" ],
    env: process.env,
} );

build.stdout.on( "data", chunk => process.stdout.write( chunk ) );
build.stderr.on( "data", chunk => process.stderr.write( chunk ) );

build.on( "exit", code => {
    buildExitCode = code;
    if ( code && code !== 0 ) {
        console.error( `build-dev exited with ${ code }` );
        process.exitCode = code;
    }
} );

process.on( "SIGINT", () => shutdown( 0 ) );
process.on( "SIGTERM", () => shutdown( 0 ) );
process.on( "exit", () => build.kill() );

await waitForBuild();

server = createServer( async ( req, res ) => {
    try {
        const url = new URL( req.url || "/", `http://localhost:${ port }` );
        if ( url.pathname === "/" ) return sendHtml( res, dashboardHtml() );
        if ( url.pathname === "/favicon.ico" ) return send( res, 204, "image/x-icon", "" );
        if ( url.pathname === "/content-preview.html" ) return sendHtml( res, contentPreviewHtml() );
        if ( url.pathname === "/__preview__/chrome-mock.js" ) {
            return send( res, 200, "application/javascript; charset=utf-8", previewMockJs() );
        }

        const filePath = resolveExtensionFile( url.pathname );
        const content = await readFile( filePath );
        const ext = path.extname( filePath );
        const contentType = mimeTypes[ext] || "application/octet-stream";
        if ( ext === ".html" ) {
            return sendHtml( res, injectMock( content.toString( "utf8" ) ) );
        }
        send( res, 200, contentType, content );
    } catch ( error ) {
        const status = error?.code === "ENOENT" ? 404 : 500;
        send( res, status, "text/plain; charset=utf-8", `${ status } ${ error.message || error }` );
    }
} );

server.listen( port, () => {
    console.log( `Preview: http://localhost:${ port }` );
    console.log( `Popup:   http://localhost:${ port }/popup.html` );
    console.log( `Options: http://localhost:${ port }/options.html` );
    console.log( `Content: http://localhost:${ port }/content-preview.html` );
} );

function shutdown( code ) {
    build.kill();
    if ( server?.listening ) {
        server.close( () => process.exit( code ) );
        return;
    }
    process.exit( code );
}

async function waitForBuild() {
    const deadline = Date.now() + 30_000;
    const required = [
        path.join( distRoot, "manifest.json" ),
        path.join( distRoot, "popup.html" ),
        path.join( distRoot, "options.html" ),
        path.join( distRoot, "content.js" ),
    ];

    while ( Date.now() < deadline ) {
        if ( buildExitCode !== null ) {
            throw new Error( `build-dev exited before preview output was ready: ${ buildExitCode }` );
        }
        const fresh = await Promise.all( required.map( hasFreshMtime ) );
        if ( fresh.every( Boolean ) ) return;
        await new Promise( resolve => setTimeout( resolve, 250 ) );
    }

    throw new Error( `Timed out waiting for build-dev output in ${ distRoot }` );
}

async function hasFreshMtime( file ) {
    try {
        const fileStat = await stat( file );
        return fileStat.mtimeMs >= previewStartedAt;
    } catch {
        return false;
    }
}

function resolveExtensionFile( pathname ) {
    const normalized = path.normalize( decodeURIComponent( pathname.replace( /^\/+/, "" ) ) );
    if ( normalized.startsWith( ".." ) || path.isAbsolute( normalized ) ) {
        throw Object.assign( new Error( "Invalid path" ), { code: "ENOENT" } );
    }
    return path.join( distRoot, normalized );
}

function injectMock( html ) {
    const script = `<script src="/__preview__/chrome-mock.js"></script>`;
    if ( html.includes( "</head>" ) ) return html.replace( "</head>", `${ script }\n</head>` );
    return `${ script }\n${ html }`;
}

function sendHtml( res, html ) {
    send( res, 200, "text/html; charset=utf-8", html );
}

function send( res, status, contentType, body ) {
    res.writeHead( status, {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
    } );
    res.end( body );
}

function dashboardHtml() {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>UACC dev preview</title>
    <style>
        body {
            margin: 0;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #111827;
            color: #e5e7eb;
        }
        header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 20px;
            border-bottom: 1px solid #374151;
        }
        main {
            display: grid;
            grid-template-columns: 420px minmax(520px, 1fr);
            grid-template-rows: 420px 520px;
            gap: 16px;
            padding: 16px;
            box-sizing: border-box;
            min-height: calc(100vh - 66px);
        }
        iframe {
            width: 100%;
            height: 100%;
            border: 1px solid #374151;
            background: white;
        }
        .panel {
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-height: 0;
        }
        .panel h2 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #f9fafb;
        }
        .options {
            grid-row: span 2;
        }
        a {
            color: #93c5fd;
        }
        button {
            height: 34px;
            border: 0;
            border-radius: 4px;
            padding: 0 12px;
            background: #2563eb;
            color: white;
            font-weight: 600;
            cursor: pointer;
        }
        @media (max-width: 1050px) {
            main {
                grid-template-columns: 1fr;
                grid-template-rows: 420px 520px 720px;
            }
            .options {
                grid-row: auto;
            }
        }
    </style>
</head>
<body>
<header>
    <div>
        <strong>UACC dev preview</strong>
        <span>served from dist/chrome_dev</span>
    </div>
    <nav>
        <a href="/popup.html" target="_blank">Popup</a>
        <a href="/options.html" target="_blank">Options</a>
        <a href="/content-preview.html" target="_blank">Content</a>
    </nav>
</header>
<main>
    <section class="panel">
        <h2>Popup</h2>
        <iframe title="Popup" src="/popup.html"></iframe>
    </section>
    <section class="panel options">
        <h2>Options</h2>
        <iframe title="Options" src="/options.html"></iframe>
    </section>
    <section class="panel">
        <h2>Content script</h2>
        <button type="button" id="open-menu">Open context menu in preview</button>
        <iframe title="Content" id="content-frame" src="/content-preview.html"></iframe>
    </section>
</main>
<script>
    document.getElementById("open-menu").addEventListener("click", () => {
        const frame = document.getElementById("content-frame");
        frame.contentWindow?.chrome?.__preview?.openContextMenu();
    });
    window.addEventListener("message", event => {
        if (event.data?.type === "uacc-preview-open-context-menu") {
            document.getElementById("content-frame").contentWindow?.chrome?.__preview?.openContextMenu();
        }
    });
</script>
</body>
</html>`;
}

function contentPreviewHtml() {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>UACC content preview</title>
    <link rel="stylesheet" href="/shared.css">
    <link rel="stylesheet" href="/content.css">
    <script src="/__preview__/chrome-mock.js"></script>
    <style>
        body {
            margin: 0;
            padding: 32px;
            min-height: 100vh;
            box-sizing: border-box;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f8fafc;
            color: #111827;
        }
        .catalog {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
            max-width: 1080px;
        }
        .card {
            padding: 18px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: white;
        }
        .price {
            font-size: 24px;
            font-weight: 700;
        }
    </style>
</head>
<body>
<h1>Storefront sample</h1>
<p>This page is only here to exercise the built content script against realistic DOM.</p>
<div class="catalog">
    <article class="card">
        <h2>Travel backpack</h2>
        <p class="price">EUR 129.95</p>
        <p>Ships today with a spare pouch for DKK 99.</p>
    </article>
    <article class="card">
        <h2>Noise cancelling headphones</h2>
        <p class="price">$249.00</p>
        <p>Refurbished units sometimes list around CAD 219.</p>
    </article>
    <article class="card">
        <h2>Compact camera</h2>
        <p class="price">JPY 78400</p>
        <p>Accessories start at GBP 39.</p>
    </article>
</div>
<script src="/content.js"></script>
<script>
    setTimeout(() => window.chrome.__preview.openContextMenu(), 1200);
</script>
</body>
</html>`;
}

function previewMockJs() {
    return `(function () {
    const now = Date.now();
    const symbols = {
        USD: "United States Dollar",
        EUR: "Euro",
        GBP: "British Pound",
        DKK: "Danish Krone",
        SEK: "Swedish Krona",
        NOK: "Norwegian Krone",
        JPY: "Japanese Yen",
        CAD: "Canadian Dollar",
        AUD: "Australian Dollar",
        MXN: "Mexican Peso",
        NZD: "New Zealand Dollar",
        SGP: "Singapore Dollar",
        HKD: "Hong Kong Dollar",
        ARS: "Argentine Peso",
        CNY: "Chinese Yuan"
    };
    const unitsPerUsd = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        DKK: 6.85,
        SEK: 10.55,
        NOK: 10.75,
        JPY: 160,
        CAD: 1.36,
        AUD: 1.51,
        MXN: 18.1,
        NZD: 1.64,
        SGP: 1.35,
        HKD: 7.81,
        ARS: 910,
        CNY: 7.25
    };
    const seed = {
        local: {
            "uacc:v4:symbols": symbols,
            "uacc:v4:symbols:date": now,
            "uacc:global:converter": [
                { from: "EUR", to: "USD", amount: 25 },
                { from: "JPY", to: "DKK", amount: 12000 }
            ]
        },
        sync: {
            currency: "USD",
            decimalAmount: 2,
            decimalDisplay: ".",
            thousandDisplay: " ",
            currencyUsingAutomatic: true,
            currencyUsingHighlight: true,
            currencyHighlightColor: "yellow",
            currencyHighlightDuration: 500,
            utilityClickConvert: true,
            utilityHoverConvert: false,
            currencyShortcut: "Shift",
            "shortcut:convert:all": "",
            usingWhitelist: true,
            usingBlacklist: true,
            whitelistingurls: [],
            blacklistingurls: [],
            currencyLocalizationDollar: "USD",
            currencyLocalizationKroner: "SEK",
            currencyLocalizationAsian: "JPY",
            showNonDefaultCurrencyAlert: true,
            "uacc:theme:selection": "darkTheme",
            lastVersion: "6.0.0",
            showFirstTimeGuide: false,
            disabledCurrencies: [],
            currencyUsingCustomTag: false,
            currencyCustomTag: "$¤",
            currencyCustomTagValue: 1,
            "uacc:currency:brackets": false,
            "uacc:user:traceId": "preview-trace",
            "uacc:user:sessionId": "",
            "uacc:user:email": "preview@example.com",
            "uacc:debug:logging": "error"
        }
    };
    const state = loadState();
    const listeners = [];

    function loadState() {
        try {
            const raw = window.localStorage.getItem("uacc-preview-storage");
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    local: { ...seed.local, ...(parsed.local || {}) },
                    sync: { ...seed.sync, ...(parsed.sync || {}) }
                };
            }
        } catch (error) {
            console.warn(error);
        }
        return structuredClone(seed);
    }

    function saveState() {
        window.localStorage.setItem("uacc-preview-storage", JSON.stringify(state));
    }

    function createStorageArea(type) {
        return {
            get(keys, callback) {
                const store = state[type];
                let result = {};
                if (keys === null || typeof keys === "undefined") {
                    result = { ...store };
                } else if (Array.isArray(keys)) {
                    keys.forEach(key => {
                        if (Object.prototype.hasOwnProperty.call(store, key)) result[key] = store[key];
                    });
                } else if (typeof keys === "string") {
                    if (Object.prototype.hasOwnProperty.call(store, keys)) result[keys] = store[keys];
                } else {
                    result = { ...keys };
                    Object.keys(keys).forEach(key => {
                        if (Object.prototype.hasOwnProperty.call(store, key)) result[key] = store[key];
                    });
                }
                callback?.(result);
                return Promise.resolve(result);
            },
            set(items, callback) {
                Object.assign(state[type], items || {});
                saveState();
                callback?.();
                return Promise.resolve();
            },
            remove(keys, callback) {
                (Array.isArray(keys) ? keys : [keys]).forEach(key => delete state[type][key]);
                saveState();
                callback?.();
                return Promise.resolve();
            },
            clear(callback) {
                state[type] = {};
                saveState();
                callback?.();
                return Promise.resolve();
            }
        };
    }

    function ratesFor(to) {
        const toUnits = unitsPerUsd[to] || 1;
        return {
            rates: Object.keys(symbols).map(from => ({
                from,
                to,
                rate: toUnits / (unitsPerUsd[from] || 1),
                timestamp: now,
                path: []
            }))
        };
    }

    async function sendMessage(message) {
        switch (message?.type) {
            case "getSymbols":
                return { success: true, data: symbols };
            case "getRate":
                return { success: true, data: ratesFor(message.to || "USD") };
            case "detect":
                throw new Error("Preview uses content-thread detection");
            case "users_info":
                return { success: true, data: { email: state.sync["uacc:user:email"], type: "guest" } };
            case "login":
            case "users_register":
            case "password_reset":
                return { success: true, data: { sessionId: "preview-session", timestamp: now } };
            case "logout":
            case "password_recovery":
                return { success: true, data: true };
            default:
                return { success: true, data: undefined };
        }
    }

    function emitRuntimeMessage(message) {
        listeners.forEach(listener => {
            try {
                listener(message, { id: "uacc-preview" }, () => {});
            } catch (error) {
                console.error(error);
            }
        });
    }

    window.chrome = {
        runtime: {
            id: "uacc-preview",
            lastError: undefined,
            getManifest: () => ({
                manifest_version: 3,
                version: "6.0.0",
                version_name: "dev",
                name: "Universal Automatic Currency Converter",
                author: "Baizey"
            }),
            getURL: path => "/" + path.replace(/^\\/+/, ""),
            sendMessage,
            onMessage: {
                addListener(listener) {
                    listeners.push(listener);
                },
                removeListener(listener) {
                    const index = listeners.indexOf(listener);
                    if (index >= 0) listeners.splice(index, 1);
                }
            }
        },
        storage: {
            local: createStorageArea("local"),
            sync: createStorageArea("sync")
        },
        tabs: {
            query: () => Promise.resolve([{ id: 1, active: true, currentWindow: true }]),
            create: ({ url }) => {
                window.open(url, "_blank", "noopener,noreferrer");
                return Promise.resolve({ id: Math.floor(Math.random() * 1000), url });
            },
            sendMessage: async () => {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: "uacc-preview-open-context-menu" }, "*");
                }
                return { success: true, data: undefined };
            }
        },
        contextMenus: {
            create: () => undefined,
            removeAll: callback => callback?.(),
            onClicked: { addListener: () => undefined }
        },
        __preview: {
            openContextMenu() {
                emitRuntimeMessage({ type: 0 });
            },
            resetStorage() {
                window.localStorage.removeItem("uacc-preview-storage");
                window.location.reload();
            }
        }
    };
    window.browser = window.chrome;
})();`;
}
