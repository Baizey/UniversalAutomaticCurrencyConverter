import {IBrowser, ILogger} from "../";
import {DependencyProvider} from '../DependencyInjection/DependencyInjector';
import {ISetting} from './ISetting';

export class SyncSetting<T> implements ISetting<T> {
    readonly defaultValue: T
    readonly storageKey: string
    readonly validation: (v: T) => boolean
    private browser: IBrowser;
    private logger: ILogger;

    constructor({browser, logger}: DependencyProvider, storageKey: string,
                defaultValue: T,
                validation: (v: T) => boolean = () => true,) {
        this.logger = logger;
        this.browser = browser;
        this.storageKey = storageKey;
        this.validation = validation;
        this.defaultValue = defaultValue;
        this._value = defaultValue;
    }

    private _value: T

    get value(): T {
        return this._value;
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

    async save(): Promise<void> {
        return await this.browser.saveSync(this.storageKey, this.value)
    }

    async loadSetting(): Promise<boolean> {
        return this.setValue(await this.browser.loadSync<T>(this.storageKey))
    }

    async setAndSaveValue(v: T): Promise<boolean> {
        const result = this.setValue(v);

        await this.save();
        return result;
    }
}