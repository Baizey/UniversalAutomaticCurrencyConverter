import {Browser, Container, IBrowser} from '../src/Infrastructure';
import {addDependencies, DependencyProvider} from '../src/Infrastructure/DependencyInjection/DependencyInjector';
import {BackendApi, IBackendApi} from '../src/CurrencyConverter/BackendApi';
import {BackendApiMock} from './BackendApi.mock';
import {BrowserMock} from './Browser.mock';

export default function useMockContainer(): [Container<DependencyProvider>, DependencyProvider] {
    const container = new Container(DependencyProvider);
    addDependencies(container)
    container.getRequired<IBrowser>(Browser).override(() => new BrowserMock())
    container.getRequired<IBackendApi>(BackendApi).override(() => new BackendApiMock())
    return [container, container.build()];
}