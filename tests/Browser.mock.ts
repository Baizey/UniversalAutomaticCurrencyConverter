import {Browser, IBrowser} from "../src/Infrastructure";
import {ITabMessenger} from "../src/Infrastructure/BrowserMessengers/TabMessenger";
import {IPopupMessenger} from "../src/Infrastructure/BrowserMessengers/PopupMessenger";
import {Browsers, Environments} from "../src/Infrastructure/Browser/Browser";
import {IBackgroundMessenger} from "../src/Infrastructure/BrowserMessengers/BackgroundMessenger";

export class BrowserMock implements IBrowser {
    readonly access: typeof chrome;
    readonly author: string;
    readonly background: IBackgroundMessenger;
    readonly environment: Environments;
    readonly extensionUrl: string;
    readonly extensionVersion: string;
    readonly host: string;
    readonly hostAndPath: string;
    readonly hostname: string;
    readonly href: string;
    readonly id: string;
    readonly isChrome: boolean;
    readonly isDevelopment: boolean;
    readonly isEdge: boolean;
    readonly isFirefox: boolean;
    readonly isProduction: boolean;
    readonly popup: IPopupMessenger;
    readonly reviewLink: string;
    readonly tab: ITabMessenger;
    readonly type: Browsers;

    constructor() {
        // @ts-ignore
        this.access = {}
        this.author = 'Baizey'
        // @ts-ignore
        this.background = {}
        // @ts-ignore
        this.tab = {}
        this.popup = {}
        this.isFirefox = true;
        this.isChrome = true;
        this.isEdge = true;
        this.isProduction = true;
        this.isDevelopment = false;
        this.environment = Environments.Prod;
        this.reviewLink = '';
        this.href = '';
        this.host = '';
        this.id = '';
        this.hostname = '';
        this.hostAndPath = '';
        this.extensionVersion = '4.0.0'
        this.extensionUrl = ''
        const useragent = window.navigator.userAgent;
        if (useragent.indexOf('HeadlessChrome') >= 0)
            this.type = Browsers.Chrome
        else
            this.type = Browsers.Firefox
        console.log(`Environment: ${this.type}, ${this.environment}`)
    }

    loadLocal<T>(key: string): Promise<T> {
        // @ts-ignore
        return Promise.resolve();
    }

    loadSync<T>(key: string): Promise<T> {
        // @ts-ignore
        return Promise.resolve();
    }

    openReviewLink(): void {
    }

    saveLocal(key: string, value: any): Promise<void> {
        return Promise.resolve();
    }

    saveSync(key: string, value: any): Promise<void> {
        return Promise.resolve();
    }

}