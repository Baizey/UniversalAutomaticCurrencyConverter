interface OpenExchangeRatesApiResponse {
    disclaimer: string
    licence: string
    timestamp: number
    base: string
    rates: Record<string, number>
}

interface OpenExchangeSymbolsApiResponse extends Record<string, string> {}

interface FixerRatesApiResponse {
    disclaimer: string
    licence: string
    timestamp: number
    success: boolean
    date: string
    base: string
    rates: Record<string, number>
}

interface FixerSymbolsApiResponse {
    symbols: Record<string, string>
}

export type CurrencyRateLookup = Record<string, Record<string, CurrencyRate>>

export type CurrencyRate = {
    from: string
    to: string
    amount: number
    timestamp: number
}

export class CurrencyRateApiProxy {
    private readonly fixerRatesUrl: string = `http://data.fixer.io/api/latest?access_key=${encodeURIComponent(process.env.fixerApiKey)}`;
    private readonly fixerSymbolsUrl: string = `http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(process.env.fixerApiKey)}`

    private readonly openExchangeRatesUrl: string = `https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(process.env.openExchangeApiKey)}`
    private readonly openExchangeSymbolsUrl: string = `https://openexchangerates.org/api/currencies.json`

    private addRates(response: FixerRatesApiResponse | OpenExchangeRatesApiResponse, result: CurrencyRateLookup) {
        result[response.base] = {}
        Object.entries(response.rates).forEach(([key, value]) => {
            result[response.base][key] = {
                from: response.base,
                to: key,
                amount: value,
                timestamp: response.timestamp * 1000
            } as CurrencyRate
        })
    }

    async getRates(): Promise<CurrencyRateLookup> {
        const [fixer, openExchange]: [FixerRatesApiResponse, OpenExchangeRatesApiResponse] = await Promise.all([
            fetch(this.fixerRatesUrl)
                .then(async e => await e.json()),
            fetch(this.openExchangeRatesUrl)
                .then(async e => await e.json()),
        ])

        const result = {}
        this.addRates(fixer, result)
        this.addRates(openExchange, result);
        return result;
    }

    async getSymbols(): Promise<Record<string, string>> {
        const [fixer, openExchange]: [Record<string, string>, Record<string, string>] = await Promise.all([
            fetch(this.fixerSymbolsUrl)
                .then(async e => await e.json() as FixerSymbolsApiResponse)
                .then(e => e.symbols),
            fetch(this.openExchangeSymbolsUrl)
                .then(async e => await e.json()),
        ])
        return {}
    }
}