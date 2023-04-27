import {TimeSpan} from "sharp-time-span";

export type RateResponse = {
    base: string
    rates: Record<string, number>
    timestamp: TimeSpan
    source: string
}

export type SymbolsResponse = Record<string, string>

export interface IProxyAgent {
    getRates(): Promise<RateResponse>

    getSymbols(): Promise<SymbolsResponse>
}