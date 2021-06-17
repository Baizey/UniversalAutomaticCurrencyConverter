import {Browser, Container, IBrowser} from '../src/infrastructure';
import {addDependencies} from '../src/infrastructure/DependencyInjection';
import {BrowserMock} from './Browser.mock';
import {IContainer} from '../src/infrastructure/DependencyInjection/package';
import {DependencyProvider} from '../src/infrastructure/DependencyInjection';
import chai from 'chai'
import spies from 'chai-spies'

function addSpies() {
    chai.use(spies);
}

function addNodeIfNotExisting() {
    if (!global.Node) {
        // @ts-ignore
        global.Node = {
            TEXT_NODE: 3
        };
    }
}

function mockContainer(): [IContainer<DependencyProvider>, DependencyProvider] {
    const container = addDependencies(new Container<DependencyProvider>());
    container.getRequired<IBrowser>(Browser).overrideFactory(() => new BrowserMock())
    return [container, container.build()];
}

export default function useMockContainer(): [IContainer<DependencyProvider>, DependencyProvider] {
    addNodeIfNotExisting();
    addSpies();
    return mockContainer();
}