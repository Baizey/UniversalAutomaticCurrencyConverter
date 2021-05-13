import {ContainerFactory} from './Types';
import {IProvider} from './Provider';
import {IContainer} from './Container';

interface ILifetime<T, E extends IProvider<E>> {
    readonly instance: T;

    dispose(): void;

    overrideFactory(input: ContainerFactory<T, E>): ILifetime<T, E>;
}

class SingletonLifetime<T, E extends IProvider<E>> implements ILifetime<T, E> {
    private value?: T
    private factoryFunction: ContainerFactory<T, E>
    private container: IContainer<E>;

    constructor(
        container: IContainer<E>,
        factoryFunction: ContainerFactory<T, E>
    ) {
        this.container = container
        this.factoryFunction = factoryFunction
    }

    get instance(): T {
        return this.value || (this.value = this.factoryFunction(this.container.build()))
    }

    overrideFactory(input: ContainerFactory<T, E>): ILifetime<T, E> {
        this.factoryFunction = input;
        this.value = undefined;
        return this;
    }

    dispose(): void {
    }
}

class TransientLifetime<T, E extends IProvider<E>> implements ILifetime<T, E> {
    private factoryFunction: ContainerFactory<T, E>
    private container: IContainer<E>;

    constructor(
        container: IContainer<E>,
        factoryFunction: ContainerFactory<T, E>
    ) {
        this.container = container
        this.factoryFunction = factoryFunction
    }

    get instance(): T {
        return this.factoryFunction(this.container.build())
    }

    overrideFactory(input: ContainerFactory<T, E>): ILifetime<T, E> {
        this.factoryFunction = input;
        return this;
    }

    dispose(): void {
    }
}

export {ILifetime, SingletonLifetime, TransientLifetime}