import { MockStrategy, singleton } from 'sharp-dependency-injection'
import { Mockable, Providable, setMockProvider, useServices } from '../src/di'
import { BrowserMock } from './Browser.mock'

function addNodeIfNotExisting() {
	if ( !global.Node ) {
		// @ts-ignore
		global.Node = {
			TEXT_NODE: 3,
		}
	}
}

function mockContainer( mock?: Mockable, defaultStrategy?: MockStrategy ): Providable {
	useServices().remove( e => e.browser ).add( { browser: singleton( BrowserMock ) } )
	if ( typeof mock === 'string' ) {
		defaultStrategy = mock
		mock = {}
	}
	return setMockProvider( {
		browser: MockStrategy.realValue,
		backendApi: MockStrategy.exceptionStub,
		backgroundMessenger: MockStrategy.exceptionStub,
		tabMessenger: MockStrategy.exceptionStub,
		popupMessenger: MockStrategy.exceptionStub,
		...mock,
	}, defaultStrategy )
}

export function as<A>( obj: any ) {
	return obj as unknown as A
}

export default function useMockContainer( mock?: Mockable, defaultStrategy?: MockStrategy ): Providable {
	addNodeIfNotExisting()
	return mockContainer( mock, defaultStrategy )
}