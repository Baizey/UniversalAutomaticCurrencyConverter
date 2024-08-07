import { singleton } from '@baizey/dependency-injection'
import { DependenciesOf } from '@baizey/dependency-injection'
import { BackgroundMessenger, Browser, InfrastructureDiTypes, RatePath } from '../../infrastructure'
import { CurrencyRate, ICurrencyRate } from './CurrencyRate'


type RateStorage = {
	rate: number;
	timestamp: number;
	path: RatePath;
};

export class BackendApi {
	private readonly backgroundMessenger: BackgroundMessenger
	private readonly browser: Browser

	private readonly _rates: Record<string, Record<string, ICurrencyRate>>
	private _symbols: Record<string, string> | undefined
	private _symbolsExpireDate: number

	constructor( {
		             browser,
		             backgroundMessenger,
	             }: InfrastructureDiTypes ) {
		this._symbolsExpireDate = 0
		this._rates = {}
		this._symbols = undefined
		this.browser = browser
		this.backgroundMessenger = backgroundMessenger
	}

	async symbols( forceUpdate: boolean = false ): Promise<Record<string, string>> {
		const symbolsKey = `uacc:v4:symbols`
		const dateKey = `uacc:v4:symbols:date`

		this._symbolsExpireDate =
			this._symbolsExpireDate ||
			( await this.browser.loadLocal<number>( dateKey ) )
		const diff = Date.now() - ( this._symbolsExpireDate || 1 )
		const isExpired: boolean = diff >= 1000 * 60 * 60 * 24 * 7

		if ( !forceUpdate && !isExpired ) {
			if ( !this._symbols ) {
				this._symbols = await this.browser.loadLocal<Record<string, string>>(
					symbolsKey,
				)
			}
			if ( !this._symbols ) throw new Error()
			return this._symbols
		}

		this._symbols = await this.backgroundMessenger.getSymbols()
		this._symbolsExpireDate = Date.now()

		await Promise.all( [
			this.browser.saveLocal( symbolsKey, this._symbols ),
			this.browser.saveLocal( dateKey, this._symbolsExpireDate ),
		] )

		if ( !this._symbols ) throw new Error()
		return this._symbols
	}

	async rate( from: string, to: string ): Promise<ICurrencyRate | undefined> {
		if ( from === to ) return new CurrencyRate( from, to, 1, Date.now(), [] )

		const rateKey = `uacc:v4:rate:${ from }:${ to }`

		if ( !this._rates[from] ) this._rates[from] = {}

		if ( !this._rates[from][to] ) {
			const info = await this.browser.loadLocal<RateStorage | undefined>(
				rateKey,
			)
			this._rates[from][to] = new CurrencyRate(
				from,
				to,
				info?.rate || 0,
				info?.timestamp || 0,
				info?.path || [],
			)
		}

		if ( !this._rates[from][to].isExpired ) return this._rates[from][to]

		const rate = await this.backgroundMessenger.getRate( from, to )
		if ( !rate ) return

		await this.browser.saveLocal( rateKey, {
			rate: rate.rate,
			timestamp: Date.now(),
			path: rate.path,
		} as RateStorage )

		return ( this._rates[from][to] = new CurrencyRate(
			from,
			to,
			rate.rate,
			Date.now(),
			rate.path,
		) )
	}
}

export const BackendApiDi = { backendApi: singleton( BackendApi ) }
export type BackendApiDiTypes = DependenciesOf<typeof BackendApiDi>