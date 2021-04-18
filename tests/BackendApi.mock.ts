import {IBackendApi} from "../src/CurrencyConverter/BackendApi";
import {CurrencyRate, ICurrencyRate} from "../src/CurrencyConverter/BackendApi/CurrencyRate";

export class BackendApiMock implements IBackendApi {
    private readonly _symbols: Record<string, string>;
    private readonly _rates: Record<string, Record<string, number>>

    constructor(rates?: Record<string, Record<string, number>>, symbols?: Record<string, string>) {
        this._symbols = symbols || {};
        this._rates = rates || {};
    }

    async rate(from: string, to: string): Promise<ICurrencyRate | null> {
        if (from === to) return new CurrencyRate(from, to, 1, Date.now())
        if (!this._rates[from] || !this._rates[from][to])
            return null;
        return new CurrencyRate(from, to, this._rates[from][to], Date.now())
    }

    async symbols(): Promise<Record<string, string>> {
        return this._symbols;
    }

}