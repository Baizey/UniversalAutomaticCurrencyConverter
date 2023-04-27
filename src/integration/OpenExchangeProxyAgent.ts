import {IProxyAgent} from "./IProxyAgent";
import {TimeSpan} from "sharp-time-span";

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
    async getRates() {
        const response: RatesResponse = await fetch(openExchangeRatesUrl).then(async e => await e.json())
        return {
            timestamp: TimeSpan.of({seconds: response.timestamp}),
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