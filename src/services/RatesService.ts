import {FixerProxyAgent} from "../integration/FixerProxyAgent";
import {OpenExchangeProxyAgent} from "../integration/OpenExchangeProxyAgent";
import {RateResponse} from "../integration/IProxyAgent";
import {CurrencyRateLookup} from "./SymbolsService";

export class RatesService {
    private apis = [
        // new FixerProxyAgent(),
        new OpenExchangeProxyAgent()
    ]

    private addRates(response: RateResponse, result: CurrencyRateLookup) {
        result[response.base] = result[response.base] || {}
        Object.entries(response.rates).forEach(([key, value]) => {
            result[response.base][key] = {
                source: response.source,
                from: response.base,
                to: key,
                rate: value,
                timestamp: response.timestamp
            }
        })
    }

    async getRates(): Promise<CurrencyRateLookup> {
        const calls = await Promise.all(this.apis.map(e => e.getRates()));
        const result = {}
        calls.forEach(call => this.addRates(call, result))
        return result;
    }
}