const Browsers = {
    Firefox: 'Firefox',
    Chrome: 'Chrome',
    Edge: 'Edge',
};

let _browserInstance;

class Browser {
    static updateFooter() {
        const footer = document.getElementById('footer');
        if (!footer) return;
        footer.innerText = footer.innerText
            .replace('{version}', Browser.instance.extensionVersion)
            .replace('{author}', Browser.instance.author);
    }

    /**
     * @param {Browser} instance
     */
    static setInstance(instance) {
        _browserInstance = instance;
    }

    /**
     * @returns {Browser}
     */
    static get instance() {
        return _browserInstance ? _browserInstance : (_browserInstance = new Browser());
    }

    /**
     * @param {string|string[]} key
     * @param {boolean} sync
     * @return {Promise<any>}
     */
    static load(key, sync = true) {
        if (sync)
            return Browser.instance.loadSync(key);
        else
            return Browser.instance.loadLocal(key);
    }

    /**
     * @param key
     * @param value
     * @param {boolean} sync
     * @return {Promise<any>}
     */
    static save(key, value, sync = true) {
        if (sync)
            return Browser.instance.saveSync(key, value);
        else
            return Browser.instance.saveLocal(key, value);
    }

    constructor(dummy = null) {
        this._fullHref = undefined;
        this._fullHostName = undefined;
        if (dummy) {
            this.type = dummy.type;
            this.access = dummy.access;
            return;
        }

        if (this.id === 'hbjagjepkeogombomfeefdmjnclgojli')
            this.type = Browsers.Chrome;
        else if (typeof browser !== "undefined")
            this.type = Browsers.Firefox;
        else
            this.type = Browsers.Edge;

        console.log(`UACC: detected browser ${this.type}`)
        this.access = this.type === Browsers.Firefox ? browser : chrome;
    }

    get reviewLink() {
        switch (this.type) {
            case Browsers.Firefox:
                return 'https://addons.mozilla.org/en-US/firefox/addon/ua-currency-converter/';
            case Browsers.Chrome:
                return `https://chrome.google.com/webstore/detail/universal-automatic-curre/${this.id}`;
            case Browsers.Edge:
                // TODO: setup for edge
                return null;
        }
    }

    get author() {
        return chrome.runtime.getManifest().author;
    }

    get extensionVersion() {
        return chrome.runtime.getManifest().version;
    }

    get extensionUrl() {
        switch (this.type) {
            case Browsers.Firefox:
                return `moz-extension://${this.id}`;
            case Browsers.Chrome:
                return `chrome-extension://${this.id}`;
            case Browsers.Edge:
                return `extension://${this.id}`;
        }
    }

    get id() {
        return chrome.runtime.id;
    }

    get document() {
        return document;
    }

    get window() {
        return window;
    }

    /**
     * @returns {string}
     */
    get href() {
        if (!this._fullHref)
            this._fullHref = window.location.href;
        return this._fullHref;
    }

    /**
     * @returns {string}
     */
    get hostAndPath() {
        const url = new URL(this.href);
        return url.hostname + url.pathname;
    }

    /**
     * @returns {string}
     */
    get hostname() {
        if (!this._fullHostName)
            this._fullHostName = window.location.hostname;
        return this._fullHostName;
    }

    /**
     * @returns {string}
     */
    get host() {
        const index = this.hostname.lastIndexOf('.');
        return index < 0 ? '' : this.hostname.substr(index + 1);
    }

    openReviewLink() {
        chrome.tabs.create({url: this.reviewLink});
    }

    isFirefox() {
        return this.type === Browsers.Firefox;
    }

    isChrome() {
        return this.type === Browsers.Chrome;
    }

    isEdge() {
        return this.type === Browsers.Edge;
    }

    /**
     * @param data
     * @return {Promise<any>}
     */
    static messagePopup(data) {
        return new Promise(function (resolve) {
            return chrome.runtime.sendMessage(data, function (resp) {
                return resolve(resp);
            });
        }).catch(error => console.error(error));
    }

    /**
     * @param data
     * @returns {Promise<*>}
     * @private
     */
    _messageBackground(data) {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(data, resp => {
                    if (!resp) return reject('No response');
                    resp.success ? resolve(resp.data) : reject(resp.data)
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @param data
     * @returns {Promise<*>}
     * @private
     */
    _messagePopup(data) {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(data, function (resp) {
                    if (!resp) return reject('No response');
                    return resp.success ? resolve(resp.data) : reject(resp.data);
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @param data
     * @returns {Promise<*>}
     * @private
     */
    _messageTab(data) {
        return new Promise((resolve, reject) => {
            try {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs) {
                    return chrome.tabs.sendMessage(tabs[0].id, data, function (resp) {
                        if (!resp) return reject('No response');
                        return resp.success ? resolve(resp.data) : reject(resp.data);
                    });
                })
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * @returns {{}}
     */
    get popup() {
        return {}
    }

    /**
     * @returns {{getHref: (function(): Promise<*>), selectedMenu: (function(): Promise<*>), hideConversions: (function(): Promise<*>), contextMenu: (function(): Promise<*>), showConversions: (function(): Promise<*>), setLocalization: (function(*=): Promise<*>)}}
     */
    get tab() {
        return {
            selectedMenu: () => this._messageTab({type: 'selectedMenu'}),
            contextMenu: () => this._messageTab({type: 'contextMenu'}),
            showConversions: () => this._messageTab({type: 'showConversions'}),
            hideConversions: () => this._messageTab({type: 'hideConversions'}),
            getHref: () => this._messageTab({type: 'getHref'}),
            setLocalization: (data) => this._messageTab({type: 'setActiveLocalization', data: data}),
        }
    }

    /**
     * @returns {{getHtml: (function(*=): Promise<*>), getRate: (function(*=, *=): Promise<*>), getSymbols: (function(): Promise<*>), openPopup: (function(): Promise<*>)}}
     */
    get background() {
        return {
            activeRightClick: async () => this._messageBackground({type: 'activeRightClick'}),
            getHtml: template => this._messageBackground({type: 'getHtml', template: template}),
            getRate: (from, to) => this._messageBackground({type: 'rate', from: from, to: to}),
            getSymbols: () => this._messageBackground({type: 'symbols'}),
            openPopup: () => this._messageBackground({type: 'openPopup'}),
        }
    }

    /**
     * @param {string|string[]} key
     * @return {Promise<object>}
     */
    loadSync(key) {
        return this._load(this.access.storage.sync, key);
    }

    /**
     * @param {string|object} key
     * @param {*} value
     */
    saveSync(key, value) {
        return this._save(this.access.storage.sync, key, value);
    }

    /**
     * @param {string|string[]} key
     * @return {Promise<object>}
     */
    loadLocal(key) {
        return this._load(this.access.storage.local, key);
    }

    /**
     * @param {string|object} key
     * @param {*} value
     */
    saveLocal(key, value) {
        return this._save(this.access.storage.local, key, value);
    }

    /**
     * @param storage
     * @param {string|string[]} key
     * @return {Promise<object>}
     */
    _load(storage, key) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(key)) key = [key];
            storage.get(key, function (resp) {
                if (!resp)
                    return reject(resp);

                //console.log(`LOAD From keys: ${key.join(', ')}\nGot: ${JSON.stringify(resp)}`);

                Object.keys(resp).forEach(key => {
                    try {
                        resp[key] = JSON.parse(resp[key])
                    } catch (e) {
                    }
                });
                resolve(resp);
            });
        })
    }

    /**
     * @param storage
     * @param {string|object} key
     * @param {*} value
     */
    _save(storage, key, value) {
        const toStore = ((typeof key) === 'string') ? {[key]: value} : key;
        return new Promise(resolve => {
            storage.set(toStore, () => {
                //console.log(`SAVE ${JSON.stringify(toStore)}`);
                resolve();
            });
        });
    }

}