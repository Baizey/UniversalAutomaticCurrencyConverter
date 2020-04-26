const Browsers = {
    Firefox: 'Firefox',
    Chrome: 'Chrome',
    Edge: 'Edge'
};

let _browserInstance;

class Browser {

    static updateFooter() {
        //const manifest = chrome.runtime.getManifest();
        const footer = document.getElementById('footer');
        if (footer)
            footer.innerText = footer.innerText
                .replace('{version}', Browser.extensionVersion)
                .replace('{author}', Browser.author);
    }

    static getHost() {
        const hostname = Browser.hostname;
        const index = hostname.lastIndexOf('.');
        return index < 0 ? '' : hostname.substr(index + 1);
    }

    static updateReviewLink() {
        const url = Browser.instance.isChrome()
            ? 'https://chrome.google.com/webstore/detail/universal-automatic-curre/hbjagjepkeogombomfeefdmjnclgojli'
            : 'https://addons.mozilla.org/en-US/firefox/addon/ua-currency-converter/';
        chrome.tabs.create({url: url});
    }

    static get author() {
        return chrome.runtime.getManifest().author;
    }

    static get extensionVersion() {
        return chrome.runtime.getManifest().version;
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

        this.type = typeof chrome !== "undefined"
            ? ((typeof browser !== "undefined")
                ? Browsers.Firefox
                : Browsers.Chrome)
            : Browsers.Edge;
        this.access = this.type === Browsers.Firefox ? browser : chrome;
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

    isFirefox() {
        return this.type === Browsers.Firefox;
    }

    isChrome() {
        return this.type === Browsers.Chrome;
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
     * @returns {{
     * getHref: (function(): Promise<string>),
     * getLocalization: (function(): Promise<{dollar: string, yen: string, krone: string}>),
     * getConversionCount: (function(): Promise<number>),
     * setLocalization: (function({dollar: string, yen: string, krone: string}): Promise<void>)}}
     */
    get tab() {
        return {
            getConversionCount: () => this._messageTab({type: 'getConversionCount'}),
            getHref: () => this._messageTab({type: 'getHref'}),
            setLocalization: (data) => this._messageTab({type: 'setActiveLocalization', data: data}),
            getLocalization: () => this._messageTab({type: 'getActiveLocalization'}),
        }
    }

    /**
     * @returns {{getRate: (function(string, string): Promise<{rate: number}>), getSymbols: (function(): Promise<object>), openPopup: (function(): Promise<void>)}}
     */
    get background() {
        return {
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