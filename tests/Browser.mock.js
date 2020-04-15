let _browserMockInstance;

class Browser {
    static get instance() {
        if (!_browserMockInstance) _browserMockInstance = new Browser();
        return _browserMockInstance;
    }

    async loadLocal(keys) {
        throw 'unimplemented mock async Browser.loadLocal(...)'
    }

    get background() {
        return {
            getRate: async (from, to) => {
                throw 'unimplemented mock async Browser.background.getRate(...)'
            }
        }
    }
}