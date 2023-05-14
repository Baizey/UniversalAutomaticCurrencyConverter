type SyncStorageArea = chrome.storage.SyncStorageArea;
type LocalStorageArea = chrome.storage.LocalStorageArea;

export enum BrowserEnvironment {
    serviceWorker = 'serviceWorker',
    tab = 'tab',
    popup = 'popup'
}

export enum Browsers {
    Firefox = 'Firefox',
    Chrome = 'Chrome',
    Edge = 'Edge',
}

export type BrowserDataStorage = {
    type: 'local' | 'sync';
    key: string;
    value: any;
};

function polyfill(access: typeof chrome) {
    if (!access.runtime) access.runtime = {
        getManifest: () => ({
            version: 'TEST',
            name: 'UACC',
            author: 'Baizey',
        }),
        id: 'TEST',
    } as typeof chrome.runtime
}

export class Browser {
    readonly type: Browsers
    private readonly access: typeof chrome
    private _isServiceWorker = false

    constructor() {
        this.type = this.detectBrowser()
        // @ts-ignore
        this.access = this.isFirefox ? browser : chrome

        polyfill(this.access)
    }

    setAsServiceWorker() {
        this._isServiceWorker = true
    }

    get isServiceWorker() {
        return this._isServiceWorker
    }

    get document() {
        return document
    }

    get tabs(): typeof chrome.tabs {
        return this.access.tabs
    }

    get runtime(): typeof chrome.runtime {
        return this.access.runtime
    }

    get contextMenus(): typeof chrome.contextMenus {
        return this.access.contextMenus
    }

    get storage(): typeof chrome.storage {
        return this.access.storage
    }

    get reviewLink(): string {
        switch (this.type) {
            case Browsers.Firefox:
                return 'https://addons.mozilla.org/en-US/firefox/addon/ua-currency-converter/'
            case Browsers.Chrome:
                return `https://chrome.google.com/webstore/detail/universal-automatic-curre/${this.id}`
            case Browsers.Edge:
                return `https://microsoftedge.microsoft.com/addons/detail/universal-automatic-curre/${this.id}`
        }
    }

    get author(): string {
        return this.runtime.getManifest().author || ''
    }

    get extensionName(): string {
        return this.runtime.getManifest().name
    }

    get extensionVersion(): string {
        return this.runtime.getManifest().version
    }

    get extensionUrl(): string {
        switch (this.type) {
            case Browsers.Firefox:
                return `moz-extension://${this.id}`
            case Browsers.Chrome:
                return `chrome-extension://${this.id}`
            case Browsers.Edge:
                return `extension://${this.id}`
        }
    }

    get id(): string {
        return this.runtime.id
    }

    get url(): URL {
        let href = location.href
        // noinspection HttpUrlsUsage
        if (href.startsWith('http://')) {
            // noinspection HttpUrlsUsage
            href = href.substr('http://'.length, href.length)
        }
        if (!href.startsWith('https://')) href = 'https://' + href
        return new URL(href)
    }

    get hostAndPath(): string {
        return this.url.hostname + this.url.pathname
    }

    get hostname(): string {
        return this.url.hostname
    }

    get host(): string {
        const index = this.hostname.lastIndexOf('.')
        return index < 0
            ? ''
            : this.hostname.substr(index + 1)
    }

    get isFirefox(): boolean {
        return this.type === Browsers.Firefox
    }

    get isChrome(): boolean {
        return this.type === Browsers.Chrome
    }

    get isEdge(): boolean {
        return this.type === Browsers.Edge
    }

    openReviewLink(): void {
        this.tabs.create({url: this.reviewLink}).finally()
    }

    async loadLocal<T>(key: string): Promise<T> {
        return await this.loadSingle<T>(this.storage.local, key)
    }

    async loadSync<T>(key: string): Promise<T> {
        return await this.loadSingle<T>(this.storage.sync, key)
    }

    async saveLocal(key: string, value: any): Promise<void> {
        return await this.saveSingle(this.storage.local, key, value)
    }

    async saveSync<T>(key: string, value: T): Promise<void> {
        return await this.saveSingle(this.storage.sync, key, value)
    }

    async allStorage(): Promise<BrowserDataStorage[]> {
        const self = this
        const [local, sync]: [BrowserDataStorage[], BrowserDataStorage[]] =
            await Promise.all([
                new Promise((resolve) => {
                    self.storage.local.get(null, function (items) {
                        resolve(items)
                    })
                }).then((items) =>
                    Object.entries(items as object).map(
                        ([key, value]) =>
                            ({
                                type: 'local',
                                key: key,
                                value: value,
                            } as BrowserDataStorage),
                    ),
                ),
                new Promise((resolve) => {
                    self.storage.sync.get(null, function (items) {
                        resolve(items)
                    })
                }).then((items) =>
                    Object.entries(items as object).map(
                        ([key, value]) =>
                            ({
                                type: 'sync',
                                key: key,
                                value: value,
                            } as BrowserDataStorage),
                    ),
                ),
            ])

        return local.concat(sync)
    }

    async clearSettings(): Promise<void> {
        const self = this
        await Promise.all([
            new Promise<void>((resolve) => {
                self.storage.local.get(null, function (items) {
                    const keys = Object.keys(items)
                    self.storage.local.remove(keys, () => {
                        //logger.info( `Deleted locally stored keys:\n${ keys.join( '\n' ) }` )
                        resolve()
                    })
                })
            }),
            new Promise<void>((resolve) => {
                self.storage.sync.get(null, function (items) {
                    const keys = Object.keys(items)
                    self.storage.sync.remove(keys, () => {
                        //logger.info( `Deleted sync stored keys:\n${ keys.join( '\n' ) }` )
                        resolve()
                    })
                })
            }),
        ])
    }

    private detectBrowser(): Browsers {
        if (navigator.userAgent.indexOf(' Edg/') >= 0) {
            return Browsers.Edge
        }// @ts-ignore (browser is not recognized, but it exists on Firefox)
        else if (typeof browser !== 'undefined') {
            return Browsers.Firefox
        } else {
            return Browsers.Chrome
        }
    }

    private loadSingle<T>(
        storage: LocalStorageArea | SyncStorageArea,
        key: string,
    ): Promise<T> {
        const self = this
        return new Promise<T>((resolve, reject) =>
            storage.get([key], (resp) =>
                self.runtime.lastError
                    ? reject(Error(self.runtime.lastError.message))
                    : resolve(resp[key]),
            ),
        )
    }

    private saveSingle(
        storage: LocalStorageArea | SyncStorageArea,
        key: string,
        value: any,
    ): Promise<void> {
        const self = this
        return new Promise<void>((resolve, reject) =>
            storage.set({[key]: value}, () =>
                self.runtime.lastError
                    ? reject(Error(self.runtime.lastError.message))
                    : resolve(),
            ),
        )
    }
}