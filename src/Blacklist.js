class Blacklist {

    constructor() {
        this.isEnabled = true;
        this.urls = [];
    }

    _clean(url) {
        return url.replace(/^(https?:\/\/)?(www\.)?/, '');
    }

    whitelist(url) {
        url = this._clean(url);
        this.urls = this.urls.filter(u => !u.startsWith(url));
    }

    _worthAdding(url) {
        if (!url) return false;
        url = this._clean(url);
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

    withUrls(urls) {
        if (Array.isArray(urls))
            this.urls = urls.filter(u => typeof u === 'string');
        else if (typeof urls === 'string' && this._worthAdding(urls))
            this.urls.push(this._clean(urls));
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