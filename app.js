const express = require('express');
const fetch = require('snek-node').Request;
const enviroment = process.env;

const config = {
    port: enviroment.PORT || 3000,
    apikey: enviroment.apikey
};

const data = {
    symbols: null,
    rates: null
};

const urls = {
    symbols: `http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(config.apikey)}`,
    rates: `http://data.fixer.io/api/latest?access_key=${encodeURIComponent(config.apikey)}`
};

const update = async () => await Promise.all([
    fetch.get(urls.rates)
        .then(resp => resp.body && resp.body.success ? resp.body : null)
        .then(resp => data.rates = resp || data.rates).catch(),
    fetch.get(urls.symbols)
        .then(resp => resp.body && resp.body.success ? resp.body : null)
        .then(resp => data.symbols = resp || data.symbols).catch()
]);

const api = express();

console.log('Initiating');
update().finally(() => {
    console.log('Starting');

    // Update data occasionally
    setInterval(() => update(), 1000 * 60 * 60 * 2);

    // Currency rates endpoint
    api.get('/api/rates', (_, respond) => data.rates
        ? respond.status(200).send(data.rates)
        : respond.status(500).send('Dont have any rates'));

    // Currency symbols endpoint
    api.get('/api/symbols', (_, respond) => data.symbols
        ? respond.status(200).send(data.symbols)
        : respond.status(500).send('Dont have any symbols'));

    api.listen(config.port, () => {
        console.log('Started');
        console.log(`Port: ${config.port}`);
    });
});