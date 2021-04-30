import {Singleton} from "./Singleton";
import {IScopedService} from "./IScopedService";

type BaseConstructor<T> = Function & { prototype: T, name: string }

type ProviderConstructor<T extends Provider> = BaseConstructor<T> & { new(container: Container<T>): T }

type InjectionConstructor<T, P extends Provider> = BaseConstructor<T> & { new(provider: P): T }

export class Provider {
    private container: Container<any>;

    constructor(container: Container<any>) {
        this.container = container;
    }

    get<T, P extends Provider>(item: string | InjectionConstructor<T, P>): T | undefined { return this.container.get<T>(item)?.instance }

    getRequired<T, P extends Provider>(item: string | InjectionConstructor<T, P>): T { return this.container.getRequired<T>(item).instance }
}

export class Container<P extends Provider> {
    private static instance?: Container<any>

    static create<P extends Provider>(instance: ProviderConstructor<P>): Container<P> {
        return this.instance || (this.instance = new Container<P>(instance))
    }

    static build<P extends Provider>(): P | undefined {
        return this.instance?.build()
    }

    private readonly providerConstructor: ProviderConstructor<P>
    private readonly lookup: Record<string, IScopedService<any, P>>
    private provider?: P;

    constructor(providerConstructor: ProviderConstructor<P>) {
        this.providerConstructor = providerConstructor;
        this.lookup = {}
    }

    addSingleton<T>(Item: InjectionConstructor<T, P>, name?: string): Container<P> {
        name = name || Item.name;
        if(this.lookup[name]) return this;
        this.lookup[name] = new Singleton<T, P>(this, p => new Item(p));
        return this;
    }

    get<T>(item: string | InjectionConstructor<T, P>): IScopedService<T, P> | undefined {
        const key = typeof item === 'string' ? item : item.name;
        return this.lookup[key];
    }

    getRequired<T>(item: string | InjectionConstructor<T, P>): IScopedService<T, P> {
        const key = typeof item === 'string' ? item : item.name;
        const scope = this.get<T>(key);
        if(!scope) throw `Scoped item not found for ${key}`;
        return scope;
    }

    build(): P {
        return this.provider || (this.provider = new this.providerConstructor(this))
    }
}