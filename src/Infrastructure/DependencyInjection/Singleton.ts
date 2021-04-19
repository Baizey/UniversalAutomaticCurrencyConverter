import {IScopedService} from "./IScopedService";
import {IBuiltContainer} from "./Container";

export class Singleton<T> implements IScopedService<T> {
    private _value?: T
    private provider: (container: IBuiltContainer) => T
    private readonly built: IBuiltContainer

    constructor(built: IBuiltContainer, provider: (container: IBuiltContainer) => T) {
        this.built = built;
        this.provider = provider;
    }

    get instance(): T {
        if (!this._value) this._value = this.provider(this.built);
        return this._value;
    }

    override(input: (container: IBuiltContainer) => T): IScopedService<T> {
        this.provider = input;
        this._value = undefined;
        return this;
    }
}