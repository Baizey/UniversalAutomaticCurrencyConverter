import {DependencyInformation, MockStrategy, singleton} from '@baizey/dependency-injection'
import {Mockable, setMockProvider, useServices} from '../src/di'
import {Browser} from '../src/infrastructure'
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

function mockContainer(mock?: Mockable, defaultStrategy?: MockStrategy): Providable {
	useServices().replace({
		browser: singleton(BrowserMock) as any as DependencyInformation<Browser, unknown>,
	})
	if (typeof mock === 'string') {
		defaultStrategy = mock as MockStrategy
		mock = {}
	}
	return setMockProvider({
		browser: MockStrategy.realValue,
		backendApi: MockStrategy.exceptionStub,
		backgroundMessenger: MockStrategy.exceptionStub,
		tabMessenger: MockStrategy.exceptionStub,
		popupMessenger: MockStrategy.exceptionStub, ...mock,
	}, defaultStrategy)
}

export function as<A>(obj: any) {
	return obj as unknown as A
}

export default function useMockContainer(mock?: Mockable, defaultStrategy?: MockStrategy): Providable {
	addNodeIfNotExisting()
	return mockContainer(mock, defaultStrategy)
}