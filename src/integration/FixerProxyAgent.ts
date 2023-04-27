import {IProxyAgent} from "./IProxyAgent";
import {TimeSpan} from "sharp-time-span";

const fixerApiKey: string = process.env.fixerApiKey || ''
const fixerRatesUrl: string = `http://data.fixer.io/api/latest?access_key=${encodeURIComponent(fixerApiKey)}`
const fixerSymbolsUrl: string = `http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(fixerApiKey)}`

interface RatesResponse {
    disclaimer: string
    licence: string
    timestamp: number
    success: boolean
    date: string
    base: string
    rates: Record<string, number>
}

interface SymbolsResponse {
    symbols: Record<string, string>
}

export class FixerProxyAgent implements IProxyAgent {
    async getRates() {
        const response: RatesResponse = await fetch(fixerRatesUrl)
            .then(async e => await e.json())
        return {
            timestamp: TimeSpan.of({seconds: response.timestamp}),
            base: response.base,
            rates: response.rates,
            source: 'fixer.io',
        }
    }

    async getSymbols() {
        const response: SymbolsResponse = await fetch(fixerSymbolsUrl).then(async e => await e.json())
        return response.symbols;
    }
}