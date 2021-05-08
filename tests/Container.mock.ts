import {Browser, Container, IBrowser} from '../src/Infrastructure';
import {addDependencies, DependencyProvider} from '../src/Infrastructure/DependencyInjection/DependencyInjector';
import {BackendApi, IBackendApi} from '../src/CurrencyConverter/BackendApi';
import {BackendApiMock} from './BackendApi.mock';
import {BrowserMock} from './Browser.mock';

export default function useMockContainer(): [Container<DependencyProvider>, DependencyProvider] {
    const container = addDependencies(new Container(DependencyProvider));
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