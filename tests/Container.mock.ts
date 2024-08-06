import {Mockable, setMockProvider} from '../src/di'
import {Providable} from '../src/provideable'
import {BrowserMock} from './Browser.mock'
import {Localizations} from "../src/currencyConverter/Localization";
import {PseudoDom} from "../src/currencyConverter/Detection/pseudoDom";

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
        backgroundMessenger: {
            async findCurrencyHolders(dom: PseudoDom): Promise<HTMLElement[]> {
                const {pseudoFlat} = useMockContainer()
                return Promise.resolve(pseudoFlat.find(dom.root)
                    .map(id => dom.element(id))
                    .filter(e => e) as HTMLElement[])
            },
            async getSymbols() {
                return Promise.resolve(
                    Localizations.currencySymbols.reduce((a, b) => {
                        a[b] = b;
                        return a
                    }, {})
                )
            },
            async getRate() {
                throw new Error('Should be overridden by mock')
            }
        },
        tabMessenger: {
            openContextMenu() {
                throw new Error('Should not be called')
            }
        },
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