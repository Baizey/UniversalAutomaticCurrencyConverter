import { Stateful } from 'sharp-dependency-injection'
import { Configuration, InfrastructureDiTypes, Logger } from '../../infrastructure'
import { IBackendApi } from '../BackendApi'
import { BackendApiDiTypes } from '../BackendApi/BackendApi'
import { CurrencyDiTypes, CurrencyElement } from '../Currency'
import { IActiveLocalization } from '../Localization'
import { ActiveLocalizationDi } from '../Localization/ActiveLocalization'
import { ITextDetector, TextDetectorDi } from './TextDetector'

export interface IElementDetector {
	find( element: HTMLElement ): CurrencyElement[];

	detect( element: HTMLElement ): boolean;
}

export type ElementDetectorDi = { elementDetector: ElementDetector }
type ElementDetectorDep =
	InfrastructureDiTypes
	& BackendApiDiTypes
	& ActiveLocalizationDi
	& TextDetectorDi
	& CurrencyDiTypes

export class ElementDetector implements IElementDetector {
	private readonly textDetector: ITextDetector
	private readonly backendApi: IBackendApi
	private readonly config: Configuration
	private readonly localization: IActiveLocalization
	private readonly logger: Logger
	private readonly currencyElement: Stateful<HTMLElement, CurrencyElement>

	constructor( {
		             config,
		             backendApi,
		             textDetector,
		             activeLocalization,
		             logger,
		             currencyElement,
	             }: ElementDetectorDep ) {
		this.logger = logger
		this.currencyElement = currencyElement
		this.config = config
		this.localization = activeLocalization
		this.backendApi = backendApi
		this.textDetector = textDetector
	}

	find( element: HTMLElement ) {
		if ( !element ) return []

		if ( this.detectConverterTagUp( element ) ) return []

		if ( !this.detect( element ) ) return []

		let result: CurrencyElement[] = []
		for ( let i = 0; i < element.children.length; i++ ) {
			result = result.concat( this.find( element.children[i] as HTMLElement ) )
		}

		if ( result.length > 0 ) return result

		if ( this.isElementUnavailable( element, 3 ) ) return []

		element.setAttribute( 'uacc:watched', 'true' )
		return [ this.currencyElement.create( element ) ]
	}

	detect( element: HTMLElement ) {
		return this.textDetector.detect( element.textContent || '' )
	}

	private isElementUnavailable( element: Element, maxDepth: number ): boolean {
		if ( maxDepth < 0 ) return true
		if ( element.tagName.toLowerCase() === 'script' ) return true
		if ( element.tagName.toLowerCase() === 'svg' ) return true
		if ( element.hasAttribute( 'uacc:watched' ) ) return true

		for ( let i = 0; i < element.children.length; i++ ) {
			if ( this.isElementUnavailable( element.children[i], maxDepth - 1 ) ) {
				return true
			}
		}

		return false
	}

	private detectConverterTagUp( element: Element | null ): boolean {
		if ( !element ) return false
		if ( element.hasAttribute( 'uacc:watched' ) ) return true
		return this.detectConverterTagUp( element.parentElement )
	}
}
