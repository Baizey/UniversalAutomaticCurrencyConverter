let _browserMockInstance;

class Browser {
    static get instance() {
        if (!_browserMockInstance) _browserMockInstance = new Browser();
        return _browserMockInstance;
    }

    /**
     * @param key
     * @param value
     * @returns {Promise<void>}
     */
    async saveLocal(key, value = null) {
        return;
    }

    /**
     * @param keys
     * @returns {Promise<{}>}
     */
    async loadLocal(keys) {
        return {};
    }

    /**
     * @returns {boolean}
     */
    isFirefox() {
        return false;
    }

    get background() {
        return {
            getRate: async (from, to) => {
                if (from === to) return {rate: 1};
                throw 'unimplemented getRate mock for different currencies'
            },
            getSymbols: async () => ({
                'USD': 'USD'
            })

        }
    }
}