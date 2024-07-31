import {Mockable, setMockProvider, useServices} from '../src/di'
import {Providable} from '../src/provideable'
import {BrowserMock} from './Browser.mock'

function addNodeIfNotExisting() {
    if (!global.Node) {
        // @ts-ignore
        global.Node = {
            TEXT_NODE: 3,
            ELEMENT_NODE: 1,
        }
    }
}

function mockContainer(mock?: Mockable): Providable {
    mock ??= {}
    return setMockProvider({
        browser: new BrowserMock(),
        backgroundMessenger: {},
        tabMessenger: {},
        popupMessenger: {},
        ...mock,
    })
}

export function as<A>(obj: unknown) {
    return obj as A
}

export default function useMockContainer(mock?: Mockable): Providable {
    addNodeIfNotExisting()
    return mockContainer(mock)
}