import {Container, IContainer} from './Container';
import {ContainerLookupKey, Dictionary} from './Types';

export interface IProvider<E extends IProvider<E>> extends Dictionary {
    readonly provider: E
    readonly container: IContainer<E>
    getOptional: <T>(item: ContainerLookupKey<T, E>) => T | undefined
    getRequired: <T>(item: ContainerLookupKey<T, E>) => T
}

export class Provider<E extends IProvider<E>> implements IProvider<E> {
    private readonly _container: IContainer<E>;

    constructor(container: IContainer<E>) {
        this._container = container;
    }

    get container() { return this._container }

    get provider() { return this.container.build() }

    getOptional<T>(item: ContainerLookupKey<T, E>): T | undefined { return this._container.getOptional<T>(item)?.instance }

    getRequired<T>(item: ContainerLookupKey<T, E>): T { return this._container.getRequired<T>(item).instance }
}