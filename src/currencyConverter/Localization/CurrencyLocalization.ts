import { Stateful } from '@baizey/dependency-injection'
import { Browser, InfrastructureDiTypes, ISetting, Logger } from '../../infrastructure'

type Props = {
	key: string,
	setting: ISetting<string>
}
export type CurrencyLocalizationDi = { currencyLocalization: Stateful<Props, CurrencyLocalization> }

export class CurrencyLocalization {
	value: string
	defaultValue: string
	detectedValue: string
	readonly key: string
	private browser: Browser
	private readonly setting: ISetting<string>
	private readonly logger: Logger

	constructor(
		{
			browser,
			logger,
		}: InfrastructureDiTypes,
		{
			key,
			setting,
		}: Props,
	) {
		this.logger = logger
		this.browser = browser
		this.setting = setting
		this.key = key
		this.value = ''
		this.defaultValue = ''
		this.detectedValue = ''
	}

	override( value: string | undefined ): void {
		if ( !value ) return
		if ( /^[A-Z]{3}$/.test( value ) ) this.value = value
	}

	async save(): Promise<void> {
		await this.browser.saveLocal( this.key, this.value )
	}

	setDetected( value: string ): void {
		this.override( value )
		this.detectedValue = this.value
		this.logger.debug( `Detected localization: ${ this.detectedValue }` )
	}

	async load(): Promise<void> {
		const localValue = await this.browser.loadLocal<string>( this.key )
		this.value = localValue || this.setting.value
		this.defaultValue = this.value
		this.logger.debug( `Default localization: ${ this.defaultValue }` )
	}

	reset( toDefault: boolean ): void {
		this.value =
			toDefault
				? this.defaultValue
				: this.detectedValue
	}

	hasConflict(): boolean {
		return this.detectedValue !== this.defaultValue
	}
}
