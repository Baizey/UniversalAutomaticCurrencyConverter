import { BackendApiDi, IBackendApi } from '../BackendApi'
import { IActiveLocalization } from '../Localization'
import { ActiveLocalizationDi } from '../Localization/ActiveLocalization'
import { CurrencyRegex, RegexResult } from './CurrencyRegex'

export interface ITextDetector {
	detect( text: string ): boolean;

	find( text: string ): RegexResult[];
}

export type TextDetectorDi = { textDetector: TextDetector }

type TextDetectorDep = BackendApiDi & ActiveLocalizationDi

export class TextDetector implements ITextDetector {
	private readonly backendApi: IBackendApi
	private localization: IActiveLocalization

	constructor( {
		             backendApi,
		             activeLocalization,
	             }: TextDetectorDep ) {
		this.localization = activeLocalization
		this.backendApi = backendApi
	}

	find( text: string ): RegexResult[] {
		const result: RegexResult[] = []
		const regex = new CurrencyRegex( text )
		while ( true ) {
			const r = regex.next()
			if ( !r ) return result
			if ( this.isCurrency( r ) ) result.push( r )
		}
	}

	detect( text: string ) {
		const regex = new CurrencyRegex( text )

		if ( !regex.test() ) return false

		while ( true ) {
			const result = regex.next()

			if ( !result ) return false

			if ( this.isCurrency( result ) ) return true
		}
	}

	private isCurrency( data: { currencies: string[] } ): boolean {
		const currencies = data.currencies.map( ( e ) =>
			this.localization.parseCurrency( e ),
		)
		const currency = currencies.filter( ( e ) => e )[0]
		return !!currency
	}
}
