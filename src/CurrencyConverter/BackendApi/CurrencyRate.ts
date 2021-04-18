export interface ICurrencyRate {
    readonly from: string;
    readonly to: string;
    readonly rate: number;
    readonly timestamp: Date;
    readonly isExpired: boolean;
}

export class CurrencyRate implements ICurrencyRate {
    readonly from: string;
    readonly to: string;
    readonly rate: number;
    readonly timestamp: Date;

    constructor(from: string, to: string, rate: number, timestamp: number) {
        this.from = from;
        this.to = to;
        this.rate = rate;
        this.timestamp = new Date(timestamp);
    }

    get isExpired(): boolean {
        const now = Date.now();
        const stamp = this.timestamp.getTime();
        if (isNaN(stamp)) return true;
        const diff = now - stamp;
        const day = 1000 * 60 * 60 * 24;
        return diff >= day;
    }
}