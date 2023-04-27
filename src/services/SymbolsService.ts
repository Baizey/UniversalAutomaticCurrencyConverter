import {SymbolsResponse} from "../integration/IProxyAgent";
import {FixerProxyAgent} from "../integration/FixerProxyAgent";
import {OpenExchangeProxyAgent} from "../integration/OpenExchangeProxyAgent";
import {TimeSpan} from "sharp-time-span";

global.fetch = require("node-fetch");

export type CurrencyRateLookup = Record<string, Record<string, CurrencyRate>>

export type CurrencyRate = {
    from: string
    to: string
    rate: number
    timestamp: TimeSpan,
    source: string
}

export class SymbolsService {
    private apis = [
        //new FixerProxyAgent(),
        new OpenExchangeProxyAgent()
    ]

    async getSymbols(): Promise<SymbolsResponse> {
        const calls = await Promise.all(this.apis.map(e => e.getSymbols()));
        return calls.reduce((a, b) => ({...a, ...b}))
    }
}

