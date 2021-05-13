import {Container, IContainer} from './Container';
import {ContainerLookupKey, Dictionary} from './Types';

export interface IProvider<E extends IProvider<E>> extends Dictionary {
    readonly provider: E
    getOptional: <T>(item: ContainerLookupKey<T, E>) => T | undefined
    getRequired: <T>(item: ContainerLookupKey<T, E>) => T
}

export class Provider<E extends IProvider<E>> implements IProvider<E> {
    protected container: IContainer<E>;

    constructor(container: IContainer<E>) {
        this.container = container;
    }

    get provider() { return this.container.build() }

    getOptional<T>(item: ContainerLookupKey<T, E>): T | undefined { return this.container.getOptional<T>(item)?.instance }

    getRequired<T>(item: ContainerLookupKey<T, E>): T { return this.container.getRequired<T>(item).instance }
}

export function useGlobalProvider<P extends IProvider<P>>(addDependencies: (container: IContainer<P>) => IContainer<P>): P {
    return Container.build<P>() || addDependencies(Container.create<P>()).build()
}