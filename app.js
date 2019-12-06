const express = require('express');
const fetch = require('node-fetch');
const AppInsight = require("applicationinsights");

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
    static get currencyApiKey() {
        return Config.instance()._currencyApiKey;
    }

    static get port() {
        return Config.instance()._port;
    }

    constructor(env) {
        this._ownApiKey = env.ownApiKey;
        this._port = env.PORT || 3000;
        this._currencyApiKey = env.apikey;
        Tracker.instance(env.insightkey);
    }
}

Config.instance(process.env);

const data = {
    symbols: null,
    rates: null
};

const urls = {
    symbols: `http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(Config.currencyApiKey)}`,
    rates: `http://data.fixer.io/api/latest?access_key=${encodeURIComponent(Config.currencyApiKey)}`
};

const update = async () => {
    const rates = await Tracker.out(urls.rates).catch(console.error);
    const symbols = await Tracker.out(urls.symbols).catch(console.error);
    data.rates = rates && rates.success ? rates : data.rates;
    data.symbols = symbols && symbols.success ? symbols : data.symbols;
    if (data.rates && data.rates.rates) {
        delete data.rates.rates['AMD'];
        delete data.rates.rates['ALL'];
    }
    if (data.symbols && data.symbols.symbols) {
        delete data.rates.rates['AMD'];
        delete data.symbols.symbols['ALL'];
    }
};

const api = express();

console.log('Initiating');
update().finally(() => {
    console.log('Starting');

    // Update occasionally
    setInterval(() => update(), 1000 * 60 * 60 * 12);

    const handleRobots = resp => resp.type('text/plain').status(200).send('User-agent: *\nDisallow: /');

    // Handle robots
    api.get('/robots.txt', (request, response) => handleRobots(response));
    api.get('/robots933456.txt', (request, response) => handleRobots(response));
    api.get('/', (request, response) => response.status(200).send(`You're not supposed to be here`));

    api.param('apikey', (request, response, next, key) => {
        if (Config.isValidApiKey(key)) next();
        else response.status(401).send('This endpoint requires a valid API key');
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

    // TODO: phase out when most users has updated to a version with API key included
    // Currency rates endpoint
    api.get('/api/rates', (request, response) => {
        Tracker.in(request, response);
        return data.rates
            ? response.status(200).send(data.rates)
            : response.status(500).send('Dont have any rates');
    });
    // Currency symbols endpoint
    api.get('/api/symbols', (request, response) => {
        Tracker.in(request, response);
        return data.symbols
            ? response.status(200).send(data.symbols)
            : response.status(500).send('Dont have any symbols');
    });

    api.listen(Config.port, () => {
        console.log('Started');
        console.log(`Port: ${Config.port}`);
    });
})
;