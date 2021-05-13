import {IBrowser} from '../Browser';
import {ISetting} from './ISetting';
import {DependencyProvider} from '../DependencyInjection';

export class LocalSetting<T> implements ISetting<T> {
    private _value: T
    readonly defaultValue: T
    readonly storageKey: string
    readonly validation: (v: T) => boolean
    private readonly browser: IBrowser;

    constructor({browser}: DependencyProvider,
                storageKey: string,
                defaultValue: T,
                validation: (v: T) => boolean = () => true) {
        this.browser = browser;
        this.defaultValue = defaultValue;
        this._value = defaultValue;
        this.storageKey = storageKey;
        this.validation = validation;
    }

    get value(): T {
        return this._value;
    }

    async loadSetting(): Promise<boolean> {
        return this.setValue(await this.browser.loadLocal<T>(this.storageKey))
    }

    async save(): Promise<void> {
        return await this.browser.saveLocal(this.storageKey, this.value)
    }

    setValue(value: T | undefined): boolean {
        if(typeof value === 'undefined') return false;
        if(!this.validation(value)) return false
        if(typeof this.defaultValue === 'number') { // @ts-ignore
            this._value = Number(value)
        } else
            this._value = value;
        return true;
    }

    async setAndSaveValue(v: T): Promise<boolean> {
        const result = this.setValue(v);
        await this.save();
        return result;
    }
}