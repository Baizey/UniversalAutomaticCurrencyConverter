import {IBrowser, ISetting} from "../../Infrastructure";
import {DependencyProvider} from '../../Infrastructure/DependencyInjection/DependencyInjector';

export class CurrencyLocalization {
    value: string;

    private defaultValue: string;
    private browser: IBrowser;

    private readonly key: string;
    private readonly setting: ISetting<string>;

    constructor({browser}: DependencyProvider, key: string, setting: ISetting<string>) {
        this.browser = browser;
        this.setting = setting;
        this.key = key
        this.value = '';
        this.defaultValue = '';
    }

    override(value: string | undefined): void {
        if(!value) return;
        if(/^[A-Z]{3}$/.test(value))
            this.value = value;
    }

    async save(): Promise<void> {
        await this.browser.saveLocal(this.key, this.value);
    }

    async load(): Promise<void> {
        const localValue = await this.browser.loadLocal<string>(this.key);
        this.value = localValue || this.setting.value;
        this.defaultValue = this.value;
    }

    reset(): void {
        this.value = this.defaultValue;
    }

    hasConflict(): boolean {
        return this.value !== this.defaultValue;
    }
}