class Blacklist {

    constructor() {
        this.isEnabled = true;
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
        this.isEnabled = Utils.isDefined(value) ? value : this.isEnabled;
        return value;
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
        const self = this;
        this.urls = [];
        urls.forEach(url => self.withUrl(url));
        return this.urls;
    }

    isBlacklisted(site = window.location.href) {
        site = this._clean(site);
        const urls = this.urls;

        for (let i = 0; i < urls.length; i++) {
            if (site.startsWith(urls[i])) {
                console.log(`${site} is blacklisted by the filter ${this.urls[i]}`);
                return true;
            }
        }
        return false;
    }

}