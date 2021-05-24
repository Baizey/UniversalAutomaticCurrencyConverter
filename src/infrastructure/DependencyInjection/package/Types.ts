import {IProvider} from './Provider';

export type Dictionary = { [key: string]: any }

export type InjectionConstructor<T, E extends IProvider<E>> = Function
    & { prototype: T }
    & { name: string }
    & ({ new(provider: E): T } | { new(): T })

export type ContainerLookupKey<T, E extends IProvider<E>> = string | InjectionConstructor<T, E>

export type LifetimeOptions<T, E extends IProvider<E>> = {
    name?: string | string[]
}

export type ContainerFactory<T, E extends IProvider<E>> = (provider: E) => T

export type ContainerLifetimeInput<T, E extends IProvider<E>> = InjectionConstructor<T, E> | ContainerFactory<T, E>