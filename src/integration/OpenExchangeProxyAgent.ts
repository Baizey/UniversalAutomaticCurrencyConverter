import {IProxyAgent} from "./IProxyAgent";
import {Time} from "../Time";

const openExchangeApiKey: string = process.env.openExchangeApiKey || ''
const openExchangeRatesUrl: string = `https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(openExchangeApiKey)}`
const openExchangeSymbolsUrl: string = `https://openexchangerates.org/api/currencies.json`

interface RatesResponse {
    disclaimer: string
    licence: string
    timestamp: number
    base: string
    rates: Record<string, number>
}

interface SymbolsResponse extends Record<string, string> {
}

export class OpenExchangeProxyAgent implements IProxyAgent {

    constructor() {
        if(!openExchangeApiKey) throw new Error('Missing OpenExchangeApiKey')
    }

    async getRates() {
        const response: RatesResponse = await fetch(openExchangeRatesUrl).then(async e => await e.json())
        return {
            timestamp: new Time({seconds: response.timestamp}),
            base: response.base,
            rates: response.rates,
            source: 'openexchangerates.org',
        }
    }

    async getSymbols() {
        const response: SymbolsResponse = await fetch(openExchangeSymbolsUrl).then(async e => await e.json())
        return response;
    }
}