import {Time} from "../Time";

export type RateResponse = {
    base: string
    rates: Record<string, number>
    timestamp: Time
    source: string
}

export type SymbolsResponse = Record<string, string>

export interface IProxyAgent {
    getRates(): Promise<RateResponse>

    getSymbols(): Promise<SymbolsResponse>
}