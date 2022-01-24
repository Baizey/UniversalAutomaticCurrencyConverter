import {
  blacklistedUrlsSetting,
  usingBlacklistingSetting,
  usingWhitelistingSetting,
  whitelistedUrlsSetting,
} from '../../infrastructure/Configuration';
import { Provider } from '../../infrastructure/DependencyInjection';

type TrieNodeResult = { url: string; allowed: boolean };
type AllowanceResult = { isAllowed: boolean; reasoning: TrieNodeResult[] };

export interface ISiteAllowance {
  getAllowance(url: string): AllowanceResult;

  addUri(uri: string, allowed: boolean): Promise<void>;

  updateFromConfig(): void;
}

export class SiteAllowance implements ISiteAllowance {
  private allowance?: TrieNode;
  private usingWhitelisting: usingWhitelistingSetting;
  private usingBlacklisting: usingBlacklistingSetting;
  private blacklistedUrls: blacklistedUrlsSetting;
  private whitelistedUrls: whitelistedUrlsSetting;

  constructor({
    usingWhitelisting,
    usingBlacklisting,
    blacklistedUrls,
    whitelistedUrls,
  }: Provider) {
    this.usingWhitelisting = usingWhitelisting;
    this.usingBlacklisting = usingBlacklisting;
    this.blacklistedUrls = blacklistedUrls;
    this.whitelistedUrls = whitelistedUrls;
  }

  public static parseUri(uri: string | URL): URL {
    if (uri instanceof URL) return uri;
    if (!(uri.startsWith('https://') || uri.startsWith('http://')))
      uri = `https://${uri}`;
    return new URL(uri);
  }

  getAllowance(url: string): AllowanceResult {
    this.allowance = this.allowance || this.updateFromConfig();
    // Only false when whitelist is on but blacklist is not
    const defaultResult =
      this.usingBlacklisting.value || !this.usingWhitelisting.value;
    return this.allowance.isAllowed(url, defaultResult);
  }

  async addUri(uri: string, allowed: boolean) {
    this.allowance = this.allowance || this.updateFromConfig();
    const url = SiteAllowance.parseUri(uri);
    this.allowance.addUrls([url], allowed);

    const remove = allowed ? this.blacklistedUrls : this.whitelistedUrls;
    const add = allowed ? this.whitelistedUrls : this.blacklistedUrls;

    const expected = add.parseUri(uri);
    if (!expected) return;

    await add.setAndSaveValue(add.value.concat([expected]));
    await remove.setAndSaveValue(remove.value.filter((e) => e !== expected));
  }

  updateFromConfig() {
    const blacklist = this.usingBlacklisting.value
      ? this.blacklistedUrls.value
      : [];
    const whitelist = this.usingWhitelisting.value
      ? this.whitelistedUrls.value
      : [];
    return new TrieNode(blacklist, whitelist);
  }
}

class TrieNode {
  private _isAllowed?: boolean;
  private _url?: URL;
  private readonly hosts: Record<string, TrieNode>;
  private readonly paths: Record<string, TrieNode>;

  constructor(disallowedUrls: string[] = [], allowedUrls: string[] = []) {
    this.hosts = {};
    this.paths = {};
    if (disallowedUrls.length > 0) this.addUrls(disallowedUrls, false);
    if (allowedUrls.length > 0) this.addUrls(allowedUrls, true);
  }

  isAllowed(url: URL | string, defaultResult: boolean): AllowanceResult {
    url = SiteAllowance.parseUri(url);
    const result = {
      isAllowed: defaultResult,
      reasoning: [{ url: 'Default allowance', allowed: defaultResult }],
    } as AllowanceResult;

    let at: TrieNode = this;
    const hosts = url.hostname.split('.');
    if (hosts[0] === 'www') hosts.shift();
    const paths = url.pathname.split('/').reverse();

    while (hosts.length > 0) {
      const part = hosts.pop();
      if (!part) continue;
      at = at.hosts[part];
      if (!at) return result;
      if (typeof at._isAllowed === 'boolean') {
        result.isAllowed = at._isAllowed;
        result.reasoning.push({
          url: `${at._url?.hostname}${at._url?.pathname}`,
          allowed: at._isAllowed,
        });
      }
    }
    while (paths.length > 0) {
      const part = paths.pop();
      if (!part) continue;
      at = at.paths[part];
      if (!at) return result;
      if (typeof at._isAllowed === 'boolean') {
        result.isAllowed = at._isAllowed;
        result.reasoning.push({
          url: `${at._url?.hostname}${at._url?.pathname}`,
          allowed: at._isAllowed,
        });
      }
    }

    return result;
  }

  public addUrls(urls: (string | URL)[], isAllowed: boolean) {
    if (!urls) return;
    urls
      .map((url) => SiteAllowance.parseUri(url))
      .forEach((url) => this.addUrl(url, isAllowed));
  }

  public addUrl(url: URL, isAllowed: boolean) {
    let at: TrieNode = this;
    const hosts = url.hostname.split('.');
    if (hosts[0] === 'www') hosts.shift();
    const paths = url.pathname.split('/').reverse();

    while (hosts.length > 0) {
      const part = hosts.pop();
      if (!part) continue;
      if (!at.hosts[part]) at.hosts[part] = new TrieNode();
      at = at.hosts[part];
    }

    while (paths.length > 0) {
      const part = paths.pop();
      if (!part) continue;
      if (!at.paths[part]) at.paths[part] = new TrieNode();
      at = at.paths[part];
    }

    at._isAllowed = isAllowed;
    at._url = url;
  }
}
