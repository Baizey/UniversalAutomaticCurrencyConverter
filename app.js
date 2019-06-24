const express = require('express');
const fetch = require('snek-node').Request;
const config = require('./config.json');

const data = {
    apikey: config.apikey,
    symbols: null,
    rates: null
};

const urls = {
    symbols: `http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(data.apikey)}`,
    rates: `http://data.fixer.io/api/latest?access_key=${encodeURIComponent(data.apikey)}`
};

const update = async () => {
    const rates = fetch.get(urls.rates)
        .then(resp => data.rates = resp.body)
        .catch(e => console.error(e));
    const symbols = fetch.get(urls.symbols)
        .then(resp => data.symbols = resp.body)
        .catch(e => console.error(e));
    await Promise.all([rates, symbols]);
};

update().finally(() => {
    setInterval(async () => await update(), 1000 * 60 * 60 * 2);
    const app = express();
    app.get('/rates', (_, respond) => data.rates
        ? respond.status(200).send(data.rates)
        : respond.status(500).send('Dont have any rates'));
    app.get('/symbols', (_, respond) => data.symbols
        ? respond.status(200).send(data.symbols)
        : respond.status(500).send('Dont have any symbols'));
    app.listen(5000);
});