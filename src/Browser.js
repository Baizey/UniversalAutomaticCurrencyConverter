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

    static absoluteHostname() {
        const host = Browser.hostname;
        const parts = host.split('.');
        if (parts.length <= 1) return parts[0];
        return parts[parts.length - 2] + '.' + parts[parts.length - 1];
    }

    static setHostname(hostname) {
        Browser.instance().fullHostName = hostname;
    }

    static get hostname() {
        const name = Browser.instance().fullHostName;
        if (Utils.isDefined(name))
            return name;
        return window.location.hostname;
    }

    static getHost() {
        const hostname = Browser.hostname;
        const index = hostname.lastIndexOf('.');
        return index < 0 ? '' : hostname.substr(index + 1);
    }

    static isChrome() {
        return Browser.instance().isChrome();
    }

    static isFirefox() {
        return Browser.instance().isFirefox();
    }

    static updateReviewLink() {
        const url = Browser.isChrome()
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

    static instance(dummy) {
        if (dummy) return (_browserInstance = new Browser(dummy));
        return _browserInstance ? _browserInstance : (_browserInstance = new Browser(dummy));
    }

    /**
     * @param {string|string[]} key
     * @param {boolean} sync
     * @return {Promise<any>}
     */
    static load(key, sync = true) {
        if (sync)
            return Browser.instance().loadSync(key);
        else
            return Browser.instance().loadLocal(key);
    }

    /**
     * @param key
     * @param value
     * @param {boolean} sync
     * @return {Promise<any>}
     */
    static save(key, value, sync = true) {
        if (sync)
            return Browser.instance().saveSync(key, value);
        else
            return Browser.instance().saveLocal(key, value);
    }

    /**
     * @param type
     * @param data
     * @return {Promise<any>}
     */
    static httpGet(type, data = {}) {
        return Browser.instance().cors.call(type, data);
    }

    /**
     * @return {Promise<any>}
     */
    static selectedText() {
        return Browser.instance().cors.getSelectedText();
    }

    constructor(dummy = null) {
        this.fullHostName = undefined;
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
    static messageTab(data) {
        return new Promise(resolve =>
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                return chrome.tabs.sendMessage(tabs[0].id, data, function (resp) {
                    return resolve(resp);
                });
            })
        ).catch(error => Utils.logError(error));
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
        }).catch(error => Utils.logError(error));
    }

    static messageBackground(data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(data, function (resp) {
                return resp.success ? resolve(resp.data) : reject(resp.data);
            });
        });
    }

    get cors() {
        return {
            call: (type, data = {}) => {
                data = data || ({});
                data.type = type;
                data.method = 'HttpGet';
                return new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage(data, function (resp) {
                        return resp.success ? resolve(resp.data) : reject(resp.data);
                    });
                }).then(e => {
                    Utils.log('GET', JSON.stringify(e));
                    return e;
                })
                    .catch(error => Utils.logError(error));
            },
            getSelectedText: () => {
                const data = {method: 'getSelectedText'};
                return new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage(data, function (resp) {
                        return resp.success ? resolve(resp.data) : reject(resp.data);
                    });
                }).catch(error => Utils.logError(error));
            }
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
                if (Utils.isUndefined(resp))
                    return reject(resp);

                Utils.log('LOAD', `From keys: ${key.join(', ')}\nGot: ${JSON.stringify(resp)}`);

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
                Utils.log('SAVE', JSON.stringify(toStore));
                resolve();
            });
        });
    }

}