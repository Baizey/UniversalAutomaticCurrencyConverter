import {DependencyProvider} from '../../Infrastructure/DependencyInjection/DependencyInjector';
import {ConfigurationBlacklist, ConfigurationWhitelist} from '../../Infrastructure/Configuration';

type TrieNodeResult = { url: string, allowed: boolean }
type AllowanceResult = { isAllowed: boolean, reasoning: TrieNodeResult[] }

export interface ISiteAllowance {
    getAllowance(url: string): AllowanceResult

    updateFromConfig(): void
}

export class SiteAllowance implements ISiteAllowance {
    private readonly blacklist: ConfigurationBlacklist;
    private readonly whitelist: ConfigurationWhitelist;
    private allowance: TrieNode;

    constructor({configurationBlacklist, configurationWhitelist}: DependencyProvider) {
        this.blacklist = configurationBlacklist;
        this.whitelist = configurationWhitelist;
        const blacklist = this.blacklist.using.value ? this.blacklist.urls.value : [];
        const whitelist = this.whitelist.using.value ? this.whitelist.urls.value : [];
        this.allowance = new TrieNode(blacklist, whitelist);
    }

    getAllowance(url: string): AllowanceResult {
        // Only false when whitelist is on but blacklist is not
        const defaultResult = this.blacklist.using.value || !this.whitelist.using.value;
        return this.allowance.isAllowed(url, defaultResult);
    }

    updateFromConfig() {
        const blacklist = this.blacklist.using.value ? this.blacklist.urls.value : [];
        const whitelist = this.whitelist.using.value ? this.whitelist.urls.value : [];
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