require('dotenv').config();

import {CurrencyRateGraph} from './CurrencyRateGraph';
import {CurrencyRateApiProxy} from './CurrencyRateApiProxy';
import express from 'express'

class Data {
    symbols: Record<string, string> = {}
    rates: CurrencyRateGraph = new CurrencyRateGraph({})
}

const data = new Data();

async function update() {
    const api = new CurrencyRateApiProxy()
    const [rawRates, rawSymbols] = await Promise.all([api.getRates(), api.getSymbols()])

    const symbols = {...data.symbols, ...rawSymbols};
    const graph = new CurrencyRateGraph(rawRates)

    data.symbols = symbols
    data.rates = graph;
}

const milliToSeconds = 1000;
const secondsToMinutes = 60;
const minutesToHours = 60;
const hours = 6;
const updateInterval = milliToSeconds * secondsToMinutes * minutesToHours * hours; // every 6 hour
update().catch(console.error);
setInterval(() => update().catch(console.error), updateInterval);


const api = express();

const apiKey = process.env.ownApiKey
api.param('apikey', (request, response, next, key) => {
    if (apiKey === key) next();
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

type RateResponse = {
    from: string
    to: string
    rate: number
    timestamp: number
    path: { source: string, from: string, to: string, rate: number, timestamp: number }[]
}

// Currency rates endpoint
api.get('/api/v4/rate/:from/:to/:apikey', (request, response) => {
    if (!data || !data.rates) return response.status(500).send(`Dont have any rates`)
    const from = request.params.from;
    const to = request.params.to;

    const rate = data.rates.rate(from, to);
    if (!rate) return response.status(404).send(`Conversion between '${to}' and '${from}' not found`)

    const result: RateResponse = {
        from: rate.from,
        to: rate.to,
        rate: rate.rate,
        timestamp: rate.path.map(e => e.timestamp).reduce((a, b) => a < b ? a : b, Date.now()),
        path: rate.path.map(e => ({
            source: e.source,
            from: e.from.tag,
            to: e.to.tag,
            rate: e.rate,
            timestamp: e.timestamp
        }))
    }

    return response.status(200).send(result)
});

// Currency symbols endpoint
api.get('/api/v4/symbols/:apikey', (request, response) => {
    if (!data || !data.symbols) return response.status(500).send(`Dont have any rates`)
    response.status(200).send(data.symbols)
});

const port: number = +(process.env.PORT || 3000);
api.listen(port, () => {
    console.log('Started');
    console.log(`Port: ${port}`);
});