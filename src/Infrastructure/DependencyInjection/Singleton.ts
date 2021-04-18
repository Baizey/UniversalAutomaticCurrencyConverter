import {IScopedService} from "./IScopedService";
import {BuiltContainer} from "./Container";

export class Singleton<T> implements IScopedService<T> {
    private _value?: T
    private provider: (container: BuiltContainer) => T
    private readonly built: BuiltContainer

    constructor(built: BuiltContainer, provider: (container: BuiltContainer) => T) {
        this.built = built;
        this.provider = provider;
    }

    override(input: (container: BuiltContainer) => T): IScopedService<T> {
        this.provider = input;
        this._value = undefined;
        return this;
    }

    get instance(): T {
        if (!this._value) this._value = this.provider(this.built);
        return this._value;
    }
}