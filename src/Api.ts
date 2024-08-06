import {RatesService} from "./services/RatesService";
import express from 'express'
import {Time} from "./Time";
import {Conversion, CurrencyRateGraph} from './CurrencyRateGraph';
import {SymbolsService} from "./services/SymbolsService";
import {HttpStatus, Routes} from "./constants";


class Data {
    symbols: Record<string, string> = {}
    rates: CurrencyRateGraph = new CurrencyRateGraph({})
}

const data = new Data();

async function update() {
    console.log(`Updating rates`)
    const [rawRates, rawSymbols] = await Promise.all([
        new RatesService().getRates(),
        new SymbolsService().getSymbols()])

    const symbols = {...rawSymbols};
    const graph = new CurrencyRateGraph(rawRates)

    data.symbols = symbols
    data.rates = graph;
}

update().catch(console.error);
setInterval(() => update().catch(console.error), new Time({hours: 6}).milliseconds);


const api = express();

const apiKey = process.env.ownApiKey
if(!apiKey) throw new Error('Missing own api key')
api.use((request, response, next) => {
    // Health check doesnt need apikey, everything else does
    if (request.path.startsWith(Routes.health))
        return next()
    if (!('x-apikey' in request.headers))
        return response
            .status(HttpStatus.notAuthorized)
            .send('This service requires an API key');
    if (apiKey !== request.headers['x-apikey'])
        return response
            .status(HttpStatus.notAuthorized)
            .send('This service requires a valid API key');
    next();
})

api.param('from', (request, response, next, key) => {
    if (!(/^[A-Z]{3}$/.test(key)))
        return response
            .status(HttpStatus.badInput)
            .send(`From '${key}' is invalid currency tag`);
    if (!(key in data.rates.nodes))
        return response
            .status(HttpStatus.notFound)
            .send(`From '${key}' is not found in currencies`);
    next();
});

api.param('to', (request, response, next, key) => {
    if (!(/^[A-Z]{3}$/.test(key)))
        return response
            .status(HttpStatus.badInput)
            .send(`To '${key}' is invalid currency tag`);
    if (!(key in data.rates.nodes))
        return response
            .status(HttpStatus.notFound)
            .send(`To '${key}' is not found in currencies`);
    next();
});

type RateResponse = {
    from: string
    to: string
    rate: number
    timestamp: number
    path: { source: string, from: string, to: string, rate: number, timestamp: number }[]
}

class Mapper {
    static mapRate(rate: Conversion): RateResponse {
        return {
            from: rate.from,
            to: rate.to,
            rate: rate.rate,
            timestamp: rate.path.map(e => e.timestamp.milliseconds).reduce((a, b) => a < b ? a : b, Date.now()),
            path: rate.path.map(e => ({
                source: e.source,
                from: e.from.tag,
                to: e.to.tag,
                rate: e.rate,
                timestamp: e.timestamp.milliseconds
            }))
        }
    }
}

// Currency rates endpoint
api.get(Routes.rate, (request, response) => {
    const from = request.params.from;
    const to = request.params.to;

    const rate = data.rates.rate(from, to);
    if (!rate) return response
        .status(HttpStatus.notFound)
        .send(`Conversion between '${to}' and '${from}' not found`)

    return response
        .status(HttpStatus.ok)
        .send(Mapper.mapRate(rate))
});

// Currency symbols endpoint
api.get(Routes.symbols, (request, response) => response
    .status(HttpStatus.ok)
    .send(data.symbols));

// Health check
api.get(Routes.health, (request, response) => response
    .status(HttpStatus.okNoResult)
    .send());

const port: number = +(process.env.PORT || 3001);
api.listen(port, () => {
    console.log('Started');
    console.log(`Port: ${port}`);
});