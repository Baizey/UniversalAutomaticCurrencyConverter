import {IContainer} from './Container';
import {ContainerLookupKey, Dictionary} from './Types';

export interface IProvider<E extends IProvider<E>> extends Dictionary {
    getOptional: <T>(item: ContainerLookupKey<T, E>) => T | undefined
    getRequired: <T>(item: ContainerLookupKey<T, E>) => T
}

export class Provider<E extends IProvider<E>> implements IProvider<E> {
    private _container: IContainer<E>

    constructor(container: IContainer<E>) {
        this._container = container;
    }

    getOptional<T>(item: ContainerLookupKey<T, E>): T | undefined { return this._container.getOptional<T>(item)?.instance }

    getRequired<T>(item: ContainerLookupKey<T, E>): T { return this._container.getRequired<T>(item).instance }
}