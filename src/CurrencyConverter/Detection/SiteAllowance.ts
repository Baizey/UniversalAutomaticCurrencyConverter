import {
    blacklistedUrlsSetting,
    usingBlacklistingSetting,
    usingWhitelistingSetting, whitelistedUrlsSetting
} from '../../Infrastructure/Configuration';
import {DependencyProvider} from '../../Infrastructure/DependencyInjection';

type TrieNodeResult = { url: string, allowed: boolean }
type AllowanceResult = { isAllowed: boolean, reasoning: TrieNodeResult[] }

export interface ISiteAllowance {
    getAllowance(url: string): AllowanceResult

    updateFromConfig(): void
}

export class SiteAllowance implements ISiteAllowance {
    private allowance: TrieNode;
    private usingWhitelisting: usingWhitelistingSetting;
    private usingBlacklisting: usingBlacklistingSetting;
    private blacklistedUrls: blacklistedUrlsSetting;
    private whitelistedUrls: whitelistedUrlsSetting;

    constructor({usingWhitelisting, usingBlacklisting, blacklistedUrls, whitelistedUrls}: DependencyProvider) {
        this.usingWhitelisting = usingWhitelisting;
        this.usingBlacklisting = usingBlacklisting;
        this.blacklistedUrls = blacklistedUrls;
        this.whitelistedUrls = whitelistedUrls;

        const blacklist = usingBlacklisting.value ? blacklistedUrls.value : [];
        const whitelist = usingWhitelisting.value ? whitelistedUrls.value : [];
        this.allowance = new TrieNode(blacklist, whitelist);
    }

    getAllowance(url: string): AllowanceResult {
        // Only false when whitelist is on but blacklist is not
        const defaultResult = this.usingBlacklisting.value || !this.usingWhitelisting.value;
        return this.allowance.isAllowed(url, defaultResult);
    }

    updateFromConfig() {
        const blacklist = this.usingBlacklisting.value ? this.blacklistedUrls.value : [];
        const whitelist = this.usingWhitelisting.value ? this.whitelistedUrls.value : [];
        this.allowance = new TrieNode(blacklist, whitelist);
    }
}

class TrieNode {
    private _isAllowed?: boolean
    private _url?: URL
    private readonly hosts: Record<string, TrieNode>
    private readonly paths: Record<string, TrieNode>

    constructor(disallowedUrls: string[] = [], allowedUrls: string[] = []) {
        this.hosts = {}
        this.paths = {}
        if(disallowedUrls.length > 0)
            this.addUrls(disallowedUrls, false);
        if(allowedUrls.length > 0)
            this.addUrls(allowedUrls, true);
    }

    isAllowed(url: URL | string, defaultResult: boolean): AllowanceResult {
        if(typeof url === 'string') {
            url = url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`;
            url = new URL(url);
        }

        const result = {
            isAllowed: defaultResult,
            reasoning: [{url: 'Default allowance', allowed: defaultResult}]
        } as AllowanceResult


        let at: TrieNode = this;
        const hosts = url.hostname.split('.');
        if(hosts[0] === 'www') hosts.shift();
        const paths = url.pathname.split('/').reverse();

        while (hosts.length > 0) {
            const part = hosts.pop();
            if(!part) continue;
            at = at.hosts[part];
            if(!at) return result;
            if(typeof at._isAllowed === 'boolean') {
                result.isAllowed = at._isAllowed;
                result.reasoning.push({url: `${at._url?.hostname}${at._url?.pathname}`, allowed: at._isAllowed})
            }
        }
        while (paths.length > 0) {
            const part = paths.pop();
            if(!part) continue;
            at = at.paths[part];
            if(!at) return result;
            if(typeof at._isAllowed === 'boolean') {
                result.isAllowed = at._isAllowed;
                result.reasoning.push({url: `${at._url?.hostname}${at._url?.pathname}`, allowed: at._isAllowed})
            }
        }

        return result;
    }

    private addUrls(urls: string[], isAllowed: boolean) {
        if(!urls) return;
        urls.map(url => url.startsWith('https://') || url.startsWith('http://')
            ? url
            : `https://${url}`)
            .forEach(url => this.addUrl(new URL(url), isAllowed));
    }

    private addUrl(url: URL, isAllowed: boolean) {
        let at: TrieNode = this;
        const hosts = url.hostname.split('.');
        if(hosts[0] === 'www') hosts.shift();
        const paths = url.pathname.split('/').reverse();

        while (hosts.length > 0) {
            const part = hosts.pop();
            if(!part) continue;
            if(!at.hosts[part]) at.hosts[part] = new TrieNode();
            at = at.hosts[part];
        }

        while (paths.length > 0) {
            const part = paths.pop();
            if(!part) continue;
            if(!at.paths[part]) at.paths[part] = new TrieNode();
            at = at.paths[part];
        }

        at._isAllowed = isAllowed;
        at._url = url;
    }

}