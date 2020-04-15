let _siteAllowanceInstance;

class SiteAllowance {
    /**
     * @returns {SiteAllowance}
     */
    static get instance() {
        if (!_siteAllowanceInstance) _siteAllowanceInstance = new SiteAllowance();
        return _siteAllowanceInstance;
    }

    /**
     * @param {{config: Configuration}} services
     */
    constructor(services = {}) {
        const config = services.config || Configuration.instance;
        this._blacklist = config.blacklist;
        this._whitelist = config.whitelist;
        this._allowance = new Trie(null, null);
    }

    /**
     * @param {string} url
     * @returns {boolean}
     */
    isAllowed(url) {
        // Only false when whitelist is on but blacklist is not
        const defaultResult = this._blacklist.using.value || !this._whitelist.using.value;
        return this._allowance.isAllowed(url, defaultResult);
    }

    updateFromConfig() {
        const blacklist = this._blacklist.using.value ? this._blacklist.urls.value : null;
        const whitelist = this._whitelist.using.value ? this._whitelist.urls.value : null;
        this._allowance = new Trie(blacklist, whitelist);
    }
}

class Trie {
    /**
     * @param {string[]} disallowedUrls
     * @param {string[]} allowedUrls
     */
    constructor(disallowedUrls, allowedUrls) {
        this.isSet = false;
        this._isAllowed = null;
        this.hosts = {}
        this.paths = {}
        this._addUrls(disallowedUrls, false);
        this._addUrls(allowedUrls, true);
    }

    /**
     * @param {string|URL} url
     * @param {boolean} defaultResult
     * @returns {boolean}
     */
    isAllowed(url, defaultResult) {
        url = (typeof (url) === 'string') ? new URL(url) : url;

        let result = defaultResult;

        let at = this;
        const hosts = url.hostname.split('.');
        if (hosts[0] === 'www') hosts.shift();
        while (hosts.length > 0) {
            const part = hosts.pop();
            if (!part) continue;
            at = at.hosts[part];
            if (!at) return result;
            if (at.isSet) result = at._isAllowed;
        }
        const paths = url.pathname.split('/').reverse();
        while (paths.length > 0) {
            const part = paths.pop();
            if (!part) continue;
            at = at.paths[part];
            if (!at) return result;
            if (at.isSet) result = at._isAllowed;
        }
    }

    /**
     * @param {string[]} urls
     * @param {boolean} isAllowed
     * @private
     */
    _addUrls(urls, isAllowed) {
        if (!urls) return;
        urls.forEach(url => this._addUrl(new URL(url), isAllowed));
    }

    /**
     * @param {URL} url
     * @param {boolean} isAllowed
     * @private
     */
    _addUrl(url, isAllowed) {
        let at = this;
        const hosts = url.hostname.split('.');
        if (hosts[0] === 'www') hosts.shift();
        while (hosts.length > 0) {
            const part = hosts.pop();
            if (!part) continue;
            if (!at.hosts[part]) at.hosts[part] = new Trie();
            at = at.hosts[part];
        }
        const paths = url.pathname.split('/').reverse();
        while (paths.length > 0) {
            const part = paths.pop();
            if (!part) continue;
            if (!at.paths[part]) at.paths[part] = new Trie();
            at = at.paths[part];
        }
        at._isAllowed = isAllowed;
        at.isSet = true;
    }

}