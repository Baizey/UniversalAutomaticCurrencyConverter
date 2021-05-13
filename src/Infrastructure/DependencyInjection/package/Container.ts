import {ILifetime, SingletonLifetime, TransientLifetime} from "./ILifetime";
import {IProvider, Provider} from "./Provider";
import {ContainerLifetimeInput, ContainerLookupKey, InjectionConstructor, LifetimeOptions} from './Types';

export interface IContainer<E extends IProvider<E>> {
    addSingleton<T>(Item: ContainerLifetimeInput<T, E>, options?: Partial<LifetimeOptions<T, E>>): IContainer<E>

    addTransient<T>(Item: ContainerLifetimeInput<T, E>, options?: Partial<LifetimeOptions<T, E>>): IContainer<E>

    addLifetime<T>(key: string | string[], lifetime: ILifetime<T, E>): IContainer<E>

    getOptional<T>(item: ContainerLookupKey<T, E>): ILifetime<T, E> | undefined

    getRequired<T>(item: ContainerLookupKey<T, E>): ILifetime<T, E>

    build(): E
}

export class Container<E extends IProvider<E>> implements IContainer<E> {
    private static instance?: IContainer<any>

    static create<E extends IProvider<E>>(): IContainer<E> {
        if (this.instance) return this.instance;
        return this.instance = new Container<E>()
    }

    static build<E extends IProvider<E>>(): E | undefined {
        return this.instance?.build()
    }

    private readonly lookup: Record<string, ILifetime<any, E>>
    private provider?: E;

    constructor() {
        this.lookup = {}
        this.addSingleton(() => this.build(), {name: 'provider'})
    }

    addSingleton<T>(factory: ContainerLifetimeInput<T, E>, options?: LifetimeOptions<T, E>): IContainer<E> {
        if ('prototype' in factory) {
            const Constructor = factory as InjectionConstructor<T, E>;
            return this.addLifetime(options?.name || factory.name, new SingletonLifetime<T, E>(this, p => new Constructor(p)))
        } else {
            return this.addLifetime(options?.name, new SingletonLifetime<T, E>(this, factory))
        }
    }

    addTransient<T>(factory: ContainerLifetimeInput<T, E>, options?: LifetimeOptions<T, E>): IContainer<E> {
        if ('prototype' in factory) {
            const Constructor = factory as InjectionConstructor<T, E>;
            return this.addLifetime(options?.name || factory.name, new TransientLifetime<T, E>(this, p => new Constructor(p)))
        } else {
            return this.addLifetime(options?.name, new TransientLifetime<T, E>(this, factory))
        }
    }

    addLifetime<T>(names: string | string[], lifetime: ILifetime<T, E>): IContainer<E> {
        if (!names || (Array.isArray(names) && names.length === 0)) throw new Error(`No keys provided`);
        const keys = Container.secureKeys(names);
        keys.forEach(key => {
            if (!this.lookup[key])
                this.lookup[key] = lifetime
        })
        return this;
    }

    getOptional<T>(item: ContainerLookupKey<T, E>): ILifetime<T, E> | undefined {
        return this.getScope<T>(
            typeof item === 'string' ? item : item.name,
            false)
    }

    getRequired<T>(item: ContainerLookupKey<T, E>): ILifetime<T, E> {
        return this.getScope<T>(
            typeof item === 'string' ? item : item.name,
            true)
    }

    private getScope<T>(key: string, isRequired: boolean): ILifetime<T, E> {
        key = Container.secureKey(key);
        const result = this.lookup[key]
        if (isRequired && typeof result === 'undefined')
            throw new Error(`Container cannot resolve '${key}'`);
        return result;
    }

    build(): E {
        return this.provider || (this.provider = this.buildProvider());
    }

    private static secureKeys(keys: string | string[]): string[] {
        if (!Array.isArray(keys)) keys = [keys]
        return keys.map(Container.secureKey);
    }

    private static secureKey(key: string): string {
        return key.toLowerCase()
    }

    private buildProvider(): E {
        // @ts-ignore
        return new Proxy(new Provider<E>(this), {
            get: function (obj, key) {
                if (!obj.hasOwnProperty(key))
                    return obj.getRequired(key as string)
            }
        });
    }
}