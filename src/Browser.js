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
        const hostname = window.location.hostname;
        const index = hostname.lastIndexOf('.');
        return index < 0 ? '' : hostname.substr(index + 1);
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
     * @param key
     * @return {Promise<any>}
     */
    static load(key) {
        return Browser.instance().load(key);
    }

    /**
     * @param key
     * @param value
     * @return {Promise<any>}
     */
    static save(key, value) {
        return Browser.instance().save(key, value);
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
    load(key) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(key)) key = [key];
            this.access.storage.sync.get(key, function (resp) {
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
     * @param {string|object} key
     * @param {*} value
     */
    save(key, value) {
        const toStore = ((typeof key) === 'string') ? {[key]: value} : key;
        const self = this;
        return new Promise(resolve => {
            self.access.storage.sync.set(toStore, () => {
                Utils.log('SAVE', JSON.stringify(toStore));
                resolve();
            });
        });
    }

}