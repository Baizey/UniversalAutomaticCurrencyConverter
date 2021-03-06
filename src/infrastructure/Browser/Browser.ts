import {ITabMessenger, TabMessenger} from "../BrowserMessengers/TabMessenger";
import {BackgroundMessenger, IBackgroundMessenger} from "../BrowserMessengers/BackgroundMessenger";
import {IPopupMessenger, PopupMessenger} from "../BrowserMessengers/PopupMessenger";
import {useProvider} from '../DependencyInjection';

type SyncStorageArea = chrome.storage.SyncStorageArea;
type LocalStorageArea = chrome.storage.LocalStorageArea;

export enum Browsers {
    Firefox = 'Firefox',
    Chrome = 'Chrome',
    Edge = 'Edge',
}

export enum Environments {
    Dev = 'development',
    Prod = 'production'
}

export type BrowserDataStorage = {
    type: 'local' | 'sync'
    key: string
    value: any
}

export interface IBrowser {
    readonly document: Document;
    readonly type: Browsers
    readonly environment: Environments

    readonly url: URL
    readonly hostAndPath: string
    readonly host: string

    readonly reviewLink: string
    readonly author: string
    readonly extensionName: string
    readonly extensionVersion: string
    readonly isProduction: boolean
    readonly isDevelopment: boolean
    readonly extensionUrl: string
    readonly id: string
    readonly isFirefox: boolean
    readonly isChrome: boolean
    readonly isEdge: boolean

    readonly tab: ITabMessenger;
    readonly background: IBackgroundMessenger;
    readonly popup: IPopupMessenger;
    readonly contextMenus: typeof chrome.contextMenus;
    readonly storage: typeof chrome.storage;
    readonly runtime: typeof chrome.runtime;
    readonly tabs: typeof chrome.tabs;

    openReviewLink(): void

    loadSync<T>(key: string): Promise<T>

    loadLocal<T>(key: string): Promise<T>

    saveSync(key: string, value: any): Promise<void>

    saveLocal(key: string, value: any): Promise<void>

    clearSettings(): Promise<void>;

    allStorage(): Promise<BrowserDataStorage[]>;
}

export class Browser implements IBrowser {
    readonly tab: ITabMessenger;
    readonly background: IBackgroundMessenger;
    readonly popup: IPopupMessenger;
    readonly environment: Environments;
    readonly type: Browsers;
    private readonly access: typeof chrome;

    constructor() {
        this.environment = process.env.NODE_ENV as Environments;

        this.tab = new TabMessenger(this);
        this.background = new BackgroundMessenger(this);
        this.popup = new PopupMessenger(this);

        if (window.navigator.userAgent.indexOf(' Edg/') >= 0)
            this.type = Browsers.Edge;
        // @ts-ignore (browser is not recognized, but it exists on Firefox)
        else if (typeof browser !== "undefined")
            this.type = Browsers.Firefox;
        else
            this.type = Browsers.Chrome;

        // @ts-ignore
        this.access = this.isFirefox ? browser : chrome

    }

    get document() {
        return document;
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
                return 'https://addons.mozilla.org/en-US/firefox/addon/ua-currency-converter/';
            case Browsers.Chrome:
                return `https://chrome.google.com/webstore/detail/universal-automatic-curre/${this.id}`;
            case Browsers.Edge:
                return `https://microsoftedge.microsoft.com/addons/detail/universal-automatic-curre/${this.id}`;
        }
    }

    get author(): string {
        return this.runtime.getManifest().author;
    }

    get extensionName(): string {
        return this.runtime.getManifest().name;
    }

    get extensionVersion(): string {
        return this.runtime.getManifest().version;
    }

    get isProduction(): boolean {
        return this.environment === Environments.Prod;
    }

    get isDevelopment(): boolean {
        return this.environment === Environments.Dev;
    }

    get extensionUrl(): string {
        switch (this.type) {
            case Browsers.Firefox:
                return `moz-extension://${this.id}`;
            case Browsers.Chrome:
                return `chrome-extension://${this.id}`;
            case Browsers.Edge:
                return `extension://${this.id}`;
        }
    }

    get id(): string {
        return this.runtime.id;
    }

    get url(): URL {
        let href = window.location.href;
        // noinspection HttpUrlsUsage
        if (href.startsWith('http://')) // noinspection HttpUrlsUsage
            href = href.substr('http://'.length, href.length)

        if (!href.startsWith('https://')) href = 'https://' + href;
        return new URL(window.location.href)
    }

    get hostAndPath(): string {
        return this.url.hostname + this.url.pathname;
    }

    get hostname(): string {
        return this.url.hostname
    }

    get host(): string {
        const index = this.hostname.lastIndexOf('.');
        return index < 0 ? '' : this.hostname.substr(index + 1);
    }

    get isFirefox(): boolean {
        return this.type === Browsers.Firefox;
    }

    get isChrome(): boolean {
        return this.type === Browsers.Chrome;
    }

    get isEdge(): boolean {
        return this.type === Browsers.Edge;
    }

    openReviewLink(): void {
        this.tabs.create({url: this.reviewLink});
    }

    async loadLocal<T>(key: string): Promise<T> {
        return await this.loadSingle<T>(this.storage.local, key);
    }

    async loadSync<T>(key: string): Promise<T> {
        return await this.loadSingle<T>(this.storage.sync, key);
    }

    async saveLocal(key: string, value: any): Promise<void> {
        return await this.saveSingle(this.storage.local, key, value);
    }

    async saveSync<T>(key: string, value: T): Promise<void> {
        return await this.saveSingle(this.storage.sync, key, value);
    }

    private loadSingle<T>(storage: LocalStorageArea | SyncStorageArea, key: string): Promise<T> {
        const self = this;
        return new Promise<T>((resolve, reject) =>
            storage.get([key], resp => self.runtime.lastError ?
                reject(Error(self.runtime.lastError.message))
                : resolve(resp[key])));
    }

    private saveSingle(storage: LocalStorageArea | SyncStorageArea, key: string, value: any): Promise<void> {
        const self = this;
        return new Promise<void>((resolve, reject) =>
            storage.set({[key]: value}, () => self.runtime.lastError ?
                reject(Error(self.runtime.lastError.message))
                : resolve())
        )
    }

    async allStorage(): Promise<BrowserDataStorage[]> {
        const self = this;
        const [local, sync]: [BrowserDataStorage[], BrowserDataStorage[]] = await Promise.all([
            new Promise(resolve => {
                self.storage.local.get(null, function (items) {
                    resolve(items)
                })
            }).then(items => Object.entries(items as object).map(([key, value]) => ({
                type: 'local',
                key: key,
                value: value
            } as BrowserDataStorage))),
            new Promise(resolve => {
                self.storage.sync.get(null, function (items) {
                    resolve(items)
                })
            }).then(items => Object.entries(items as object).map(([key, value]) => ({
                type: 'sync',
                key: key,
                value: value
            } as BrowserDataStorage)))
        ])

        return local.concat(sync)
    }

    async clearSettings(): Promise<void> {
        const self = this;
        const {logger} = useProvider()
        await Promise.all([
            new Promise<void>(resolve => {
                self.storage.local.get(null, function (items) {
                    const keys = Object.keys(items);
                    self.storage.local.remove(keys, () => {
                        logger.info(`Deleted locally stored keys:\n${keys.join('\n')}`)
                        resolve();
                    })
                })
            }),
            new Promise<void>(resolve => {
                self.storage.sync.get(null, function (items) {
                    const keys = Object.keys(items);
                    self.storage.sync.remove(keys, () => {
                        logger.info(`Deleted sync stored keys:\n${keys.join('\n')}`)
                        resolve();
                    })
                })
            })
        ])
    }
}