const express = require('express');
const fetch = require('node-fetch');
const AppInsight = require("applicationinsights");

/**
 * @param keyMap
 * @param valueMap
 * @returns {object}
 */
Array.prototype.toObject = function (keyMap = e => e.key, valueMap = e => e.value) {
    return this.reduce((a, b) => {
        a[keyMap(b)] = valueMap(b);
        return a;
    }, {});
};

/**
 * @returns {number}
 */
Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0);
};

/**
 * @returns {number}
 */
Array.prototype.avg = function () {
    return this.sum() / this.length;
};

/**
 * @returns {string[]}
 */
Object.prototype.keys = function () {
    return Object.keys(this).filter(e => this.hasOwnProperty(e));
};

/**
 * @returns {*[]}
 */
Object.prototype.values = function () {
    return this.keys().map(e => this[e]);
};

/**
 * @returns {{value: *, key: string}[]}
 */
Object.prototype.pairs = function () {
    return this.keys().map(e => ({key: e, value: this[e]}))
};

let _TrackerInstance;
let _ConfigInstance;

class Tracker {
    static instance(key) {
        return _TrackerInstance ? _TrackerInstance : (_TrackerInstance = new Tracker(key));
    }

    static in(req, res) {
        return Tracker.instance().in(req, res);
    }

    static out(req) {
        return Tracker.instance().out(req);
    }

    constructor(key) {
        if (!key) return;
        AppInsight.setup(key)
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true)
            .setUseDiskRetryCaching(true)
            .start();
        this.client = AppInsight.defaultClient;
    }

    get isDisabled() {
        return !this.client;
    }

    get isEnabled() {
        return !this.isDisabled;
    }

    in(request, response) {
        if (this.isDisabled) return;
        this.client.trackNodeHttpRequest({request: request, response: response});
    }

    /**
     * @param url
     * @param opt
     * @param {string} returns
     * @return {Promise<object>}
     */
    out(url, opt = {method: 'GET'}, returns = 'json') {
        const self = this;
        const pull = resp => returns === 'text'
            ? resp.text()
            : resp.json();

        return new Promise((resolve, reject) => {
            const start = Date.now();
            const request = fetch(url, opt);
            request.then(resp => {
                const result = resp.ok ? pull(resp) : resp.statusText;
                if (self.isEnabled)
                    self.client.trackRequest({
                        name: opt.method,
                        url: resp.url,
                        duration: Date.now() - start,
                        resultCode: resp.status,
                        success: resp.ok,
                        source: result,
                    });
                if (resp.ok) resolve(result); else reject(result);
            }).catch(e => reject(e));
        });
    }
}

class Config {
    static instance(env) {
        return _ConfigInstance ? _ConfigInstance : (_ConfigInstance = new Config(env));
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    static isValidApiKey(key) {
        if (!key) return false;
        return Config.instance()._ownApiKey === key;
    }

    /**
     * @returns {string}
     */
    static get openExchangeApiKey() {
        return Config.instance()._openExchangeApiKey;
    }

    /**
     * @returns {string}
     */
    static get fixerApiKey() {
        return Config.instance()._fixerApiKey;
    }

    static get port() {
        return Config.instance()._port;
    }

    constructor(env) {
        this._ownApiKey = env.ownApiKey;
        this._port = env.PORT || 3000;
        this._fixerApiKey = env.fixerApiKey;
        this._openExchangeApiKey = env.openExchangeApiKey;
        Tracker.instance(env.insightkey);
    }
}

Config.instance(process.env);

const data = {
    symbols: null,
    rates: null
};

class CurrencyApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * @returns Promise<object>, map currency tag to rate for EUR
     */
    async rates() {
    };

    /**
     * @returns Promise<object>, map currency tag to currency name (string => string)
     */
    async symbols() {
    };
}

class OpenExchangeApi extends CurrencyApi {
    constructor(apiKey) {
        super(apiKey);
    }

    async rates() {
        return await Tracker.out(`https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(this.apiKey)}`)
            .then(resp => {
                const rate = resp.rates.EUR;
                resp.rates = resp.rates.pairs().map(e => ({key: e.key, value: e.value / rate})).toObject();
                resp.rates.USD = 1 / rate;
                resp.rates.EUR = 1;
                return resp.rates;
            });
    }

    async symbols() {
        return await Tracker.out(`https://openexchangerates.org/api/currencies.json`)
            .then(resp => {
                return resp;
            });
    }
}

class FixerApi extends CurrencyApi {
    constructor(apiKey) {
        super(apiKey);
    }

    async rates() {
        return await Tracker.out(`http://data.fixer.io/api/latest?access_key=${encodeURIComponent(this.apiKey)}`)
            .then(resp => {
                if (resp.success)
                    return resp.rates;
                throw resp;
            });
    }

    async symbols() {
        return await Tracker.out(`http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(this.apiKey)}`)
            .then(resp => {
                if (resp.success)
                    return resp.symbols;
                throw resp;
            });
    }
}

const apis = [
    new FixerApi(Config.fixerApiKey),
    new OpenExchangeApi(Config.openExchangeApiKey)
];

const update = async () => {
    const rates = (await Promise.all(apis.map(e => e.rates())))
        .filter(e => e)
        .reduce((a, b) => {
            b.pairs().forEach(pair => {
                if (!a[pair.key]) a[pair.key] = [];
                a[pair.key].push(pair.value);
            });
            return a;
        }, {})
        .pairs().map(e => {
            e.value = e.value.avg();
            return e;
        })
        .toObject();

    const symbols = (await Promise.all(apis.map(e => e.symbols())))
        .filter(e => e)
        .reduce((a, b) => ({...a, ...b}), {});

    const now = new Date();

    data.rates = {
        base: 'EUR',
        rates: rates,
        timestamp: now.getTime(),
        // date is here for legacy, new versions should rely on timestamp
        date: `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()} ${now.getUTCHours()}:${now.getUTCMinutes()} UTC`
    };
    // Use this structure for legacy
    data.symbols = {
        symbols: symbols
    };
};

const api = express();

console.log('Initiating');

// Update currency rates every X hour
const milliToSeconds = 1000;
const secondsToMinutes = 60;
const minutesToHours = 60;
const updateInterval = milliToSeconds * secondsToMinutes * minutesToHours * 6;
update().catch(console.error);
setInterval(() => update().catch(console.error), updateInterval);

const handleRobots = resp => resp.type('text/plain').status(200).send('User-agent: *\nDisallow: /');

// Handle robots
api.get('/robots.txt', (request, response) => handleRobots(response));
api.get('/robots933456.txt', (request, response) => handleRobots(response));
api.get('/', (request, response) => response.status(200).send(`You're not supposed to be here`));

api.param('apikey', (request, response, next, key) => {
    if (Config.isValidApiKey(key)) next();
    else response.status(401).send('This endpoint requires a valid API key');
});
api.param('from', (request, response, next, key) => {
    if (/^[A-Z]{3}$/.test(key)) next();
    else response.status(400).send(`From '${key}' is invalid currency tag`);
});
api.param('to', (request, response, next, key) => {
    if (/^[A-Z]{3}$/.test(key)) next();
    else response.status(400).send(`To '${key}' is invalid currency tag`);
});

// Currency rates endpoint
api.get('/api/v3/rate/:from/:to/:apikey', (request, response) => {
    Tracker.in(request, response);
    if (!data || !data.rates) return response.status(500).send(`Dont have any rates`)
    const from = request.params.from;
    const to = request.params.to;
    if (from === to) return response.status(200).send({rate: 1});

    const toRate = data.rates.rates[to];
    const fromRate = data.rates.rates[from];
    if (!toRate) return response.status(404).send(`Rate for '${to}' not found`)
    if (!fromRate) return response.status(404).send(`Rate for '${from}' not found`)

    const base = data.rates.base;
    if (base === from) return response.status(200).send({rate: toRate})
    if (base === to) return response.status(200).send({rate: 1 / fromRate})
    return response.status(200).send({rate: toRate / fromRate})
});

// Currency rates endpoint
api.get('/api/v2/rates/:apikey', (request, response) => {
    Tracker.in(request, response);
    return data.rates
        ? response.status(200).send(data.rates)
        : response.status(500).send('Dont have any rates');
});
// Currency symbols endpoint
api.get('/api/v2/symbols/:apikey', (request, response) => {
    Tracker.in(request, response);
    return data.symbols
        ? response.status(200).send(data.symbols)
        : response.status(500).send('Dont have any symbols');
});

api.listen(Config.port, () => {
    console.log('Started');
    console.log(`Port: ${Config.port}`);
});