import {Browser, Container, IBrowser} from '../src/infrastructure';
import {addDependencies} from '../src/infrastructure/DependencyInjection';
import {BrowserMock} from './Browser.mock';
import {IContainer} from '../src/infrastructure/DependencyInjection/package';
import {DependencyProvider} from '../src/infrastructure/DependencyInjection';

export default function useMockContainer(): [IContainer<DependencyProvider>, DependencyProvider] {
    const container = addDependencies(new Container<DependencyProvider>());
    container.getRequired<IBrowser>(Browser).overrideFactory(() => new BrowserMock())
    return [container, container.build()];
}