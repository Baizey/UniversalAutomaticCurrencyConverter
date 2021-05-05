import {IScopedService} from "./IScopedService";
import {Container, Provider} from './Container';

export class Singleton<T, P extends Provider> implements IScopedService<T, P> {
    private value?: T
    private factoryFunction: (provider: P) => T
    private container: Container<P>;

    constructor(
        container: Container<P>,
        factoryFunction: (container: P) => T
    ) {
        this.container = container
        this.factoryFunction = factoryFunction
    }

    get instance(): T {
        return this.value || (this.value = this.factoryFunction(this.container.build()))
    }

    overrideFactory(input: (provider: P) => T): IScopedService<T, P> {
        this.factoryFunction = input;
        this.value = undefined;
        return this;
    }
}