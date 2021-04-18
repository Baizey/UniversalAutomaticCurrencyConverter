import {Configuration} from "../../Infrastructure";
import {IBackendApi} from "../BackendApi";

export class CurrencyAmount {
    private readonly config: Configuration;
    private readonly backendApi: IBackendApi;

    readonly tag: string;
    readonly amount: number[];

    constructor(tag: string,
                amount: number | number[],
                config: Configuration,
                backendApi: IBackendApi) {
        this.config = config;
        this.backendApi = backendApi;
        this.tag = tag.toUpperCase();
        this.amount = Array.isArray(amount) ? amount : [amount];
    }

    async convertTo(tag: string): Promise<CurrencyAmount | null> {
        tag = tag.toUpperCase();
        const rate = await this.backendApi.rate(this.tag, tag);
        if (!rate) return null;
        const amount = this.amount.map(e => e * rate.rate);
        return new CurrencyAmount(tag, amount, this.config, this.backendApi);
    }

    private static round(number: string, split: number): number {
        const start = number.substr(0, split);
        const digit = number[split] || 1;
        return Math.round(Number(`${start}.${digit}`));
    }

    get roundedAmount(): string[] {
        const significant = this.config.display.rounding.value;
        return this.amount.map(fixed => {
            if (this.config.tag.using.value) {
                const factor = this.config.tag.value.value;
                if (factor !== 1) fixed *= factor;
            }
            // Limit at 15 decimals, as anything more causes issues with .toFixed
            if (Math.abs(fixed) < 1e-15) return '0';
            const original = fixed.toFixed(15);
            let [integers, decimals] = original.split('.');
            if (integers === '0' || integers === '-0') {
                let i = 0;
                while (i < decimals.length && decimals[i] === '0') i++;
                if (i === decimals.length) return '0';
                const toKeep = i + Math.min(2, significant);
                const rounded = String(CurrencyAmount.round(decimals, toKeep));
                // If we rounded something like 0.999 we got 999, which rounded from 99.9 to 100
                const zeroes = rounded.length === toKeep - i ? i : i - 1;
                // In cases like 0.99 we have to round up to whole numbers
                if (zeroes < 0) return `1.${rounded.substr(1)}`;
                return `0.${'0'.repeat(zeroes)}${rounded}`;
            } else {
                const keep = fixed < 0 ? significant + 1 : significant;
                if (keep > integers.length) {
                    const toKeep = Math.min(2, keep - integers.length);
                    let rounded = String(CurrencyAmount.round(decimals, toKeep));
                    // Handle decimal overflow into integers
                    if (rounded.length > toKeep) {
                        rounded = rounded.substr(1);
                        integers = String(Number(integers) + 1);
                    }
                    return rounded === '0' ? integers : `${integers}.${rounded}`;
                } else if (keep === integers.length)
                    return String(Math.round(Number(original)));
                else
                    return CurrencyAmount.round(integers, keep) + '0'.repeat(integers.length - keep);
            }
        })
    }

    get displayValue(): string[] {
        const decimal = this.config.display.decimal.value;
        const thousands = this.config.display.thousands.value;
        return this.roundedAmount.map(roundedAmount => {
            const [integers, digits] = roundedAmount.split('.');
            const leftSide = integers.split(/(?=(?:.{3})*$)/).join(thousands);
            return leftSide + (digits ? (decimal + digits) : '')
        });
    }

    toString(): string {
        const value = this.displayValue.join(' - ');

        const usingCustom = this.config.tag.using.value;
        if (!usingCustom) return `${value} ${this.tag}`;

        const customTag = this.config.tag.display.value;
        return customTag.replace('¤', value);
    }
}