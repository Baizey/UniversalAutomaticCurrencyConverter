import {Browser, Container, IBrowser} from '../src/Infrastructure';
import {addDependencies} from '../src/Infrastructure/DependencyInjection';
import {BackendApi, IBackendApi} from '../src/CurrencyConverter/BackendApi';
import {BackendApiMock} from './BackendApi.mock';
import {BrowserMock} from './Browser.mock';
import {IContainer} from '../src/Infrastructure/DependencyInjection/package';
import {DependencyProvider} from '../src/Infrastructure/DependencyInjection';

export default function useMockContainer(): [IContainer<DependencyProvider>, DependencyProvider] {
    const container = addDependencies(new Container<DependencyProvider>());
    container.getRequired<IBrowser>(Browser).overrideFactory(() => new BrowserMock())
    container.getRequired<IBackendApi>(BackendApi).overrideFactory(() => new BackendApiMock(
        {
            USD: {EUR: 1, DKK: 1},
            EUR: {USD: 1, DKK: 1},
            DKK: {USD: 1, EUR: 1}
        }, {
            'USD': 'USD',
            'EUR': 'EUR',
            'DKK': 'DKK',
        }))
    return [container, container.build()];
}