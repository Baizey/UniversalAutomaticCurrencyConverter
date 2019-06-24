const express = require('express');
const fetch = require('snek-node').Request;
//const config = require('./config.json');
const config = process.env.NODE_ENV.reduce((a, b) => a[b.key] = b.value, {});

const data = {
    symbols: null,
    rates: null
};

const urls = {
    symbols: `http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(config.apikey)}`,
    rates: `http://data.fixer.io/api/latest?access_key=${encodeURIComponent(config.apikey)}`
};

const update = async () => await Promise.all([
    fetch.get(urls.rates).then(resp => data.rates = resp.body),
    fetch.get(urls.symbols).then(resp => data.symbols = resp.body)
]);

update().finally(() => {
    // Update data occasionally
    setInterval(async () => await update(), 1000 * 60 * 60 * 2);

    const app = express();

    // Currency rates endpoint
    app.get('/rates', (_, respond) => data.rates
        ? respond.status(200).send(data.rates)
        : respond.status(500).send('Dont have any rates'));

    // Currency symbols endpoint
    app.get('/symbols', (_, respond) => data.symbols
        ? respond.status(200).send(data.symbols)
        : respond.status(500).send('Dont have any symbols'));

    app.listen(5000);
});