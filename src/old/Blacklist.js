class Blacklist {

    constructor(isBlacklisting = false) {
        this.isWhitelist = !isBlacklisting;
        this.isEnabled = false;
        this.urls = [];
    }

    /**
     * @param url
     * @return {String}
     * @private
     */
    _clean(url) {
        return typeof url === 'string'
            ? url.replace(/^(https?:\/\/)?(www\.)?/, '')
            : ''
    }

    whitelist(url) {
        url = this._clean(url);
        this.urls = this.urls.filter(u => !u.startsWith(url));
    }

    _worthAdding(url) {
        if (!url) return false;
        if (this.urls.some(u => url.startsWith(u)))
            return false;
        this.urls = this.urls.filter(u => !u.startsWith(url));
        return true;

    }

    using(value) {
        if (Utils.isUndefined(value)) return this.isEnabled;
        if (this.isWhitelist)
            this.isEnabled = value === 'whitelist';
        else
            this.isEnabled = value === true || value === 'blacklist';
        return this.isEnabled;
    }

    /**
     * @param {string} url
     * @return {string[]}
     */
    withUrl(url) {
        const clean = this._clean(url);
        if (this._worthAdding(clean))
            this.urls.push(clean);
        return this.urls;
    }

    /**
     * @param {string[]} urls
     * @return {string[]}
     */
    withUrls(urls) {
        if (!urls) return this.urls;
        const self = this;
        this.urls = [];
        urls.forEach(url => self.withUrl(url));
        return this.urls;
    }

    /**
     * @param {string} site
     * @return {null|string}
     */
    isBlacklisted(site = window.location.href) {
        site = this._clean(site);
        if (!site) return null;
        const urls = this.urls;
        for (let i = 0; i < urls.length; i++)
            if (site.startsWith(urls[i]))
                return urls[i];
        return null;
    }

}