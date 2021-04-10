import {Browser, IBrowser} from "../";
import {ConfigurationInjection} from "./Configuration";

export interface ISetting<T> {
    readonly defaultValue: T;
    readonly value: T;
    readonly storageKey: string;
    readonly htmlId: string;
    readonly validation: (v: T) => boolean;

    setValue(v: T): boolean;

    save(): Promise<void>

    load(): Promise<boolean>
}

export class Setting<T> implements ISetting<T> {
    private _value: T
    readonly defaultValue: T
    readonly storageKey: string
    readonly htmlId: string;
    readonly validation: (v: T) => boolean
    private browser: IBrowser;

    constructor(htmlId: string,
                storageKey: string,
                defaultValue: T,
                validation: (v: T) => boolean = () => true,
                injection: ConfigurationInjection = {}) {
        this.browser = injection.browser || Browser.instance();
        this.storageKey = storageKey;
        this.validation = validation;
        this.defaultValue = defaultValue;
        this.htmlId = htmlId;
        this._value = defaultValue;
    }

    get value(): T {
        return this._value;
    }

    setValue(value: T): boolean {
        if (!this.validation(value)) return false
        if (typeof this.defaultValue === 'number') { // @ts-ignore
            this._value = Number(value)
        } else
            this._value = value;
        return true;
    }

    async save(): Promise<void> {
        return await this.browser.saveSync(this.storageKey, this.value);
    }

    async load(): Promise<boolean> {
        const loaded = await this.browser.loadSync<T>(this.storageKey);
        return this.setValue(loaded);
    }
}