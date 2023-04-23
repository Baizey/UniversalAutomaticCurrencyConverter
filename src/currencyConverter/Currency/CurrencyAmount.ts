import { stateful, Stateful } from '@baizey/dependency-injection'
import { AsServices } from '@baizey/dependency-injection/lib/utils'
import { InfrastructureDi } from '../../infrastructure'
import { CurrencyStylingConfig, NumberStylingConfig } from '../../infrastructure/Configuration/Configuration'
import { BackendApiDi, IBackendApi } from '../BackendApi'

export type CurrencyAmountProps = { tag: string, amount: number | number[] }

type CurrencyAmountDep =
	AsServices<typeof InfrastructureDi>
	& AsServices<typeof BackendApiDi>
	& { currencyAmount: Stateful<CurrencyAmountProps, CurrencyAmount> }

export class CurrencyAmount {
	readonly tag: string
	readonly amount: number[]
	private readonly backendApi: IBackendApi
	private readonly currencyAmount: Stateful<CurrencyAmountProps, CurrencyAmount>
	private readonly numberStylingConfig: NumberStylingConfig
	private readonly currencyStylingConfig: CurrencyStylingConfig

	constructor( {
		             numberStylingConfig,
		             currencyStylingConfig,
		             backendApi,
		             currencyAmount,
	             }: CurrencyAmountDep,
	             {
		             tag,
		             amount,
	             }: CurrencyAmountProps ) {
		this.numberStylingConfig = numberStylingConfig
		this.currencyStylingConfig = currencyStylingConfig
		this.currencyAmount = currencyAmount
		this.backendApi = backendApi
		this.tag = tag.toUpperCase()
		this.amount =
			Array.isArray( amount )
				? amount
				: [ amount ]
	}

	get roundedAmount(): string[] {
		const significant = this.numberStylingConfig.significantDigits.value
		return this.amount.map( ( fixed ) => {
			if ( this.currencyStylingConfig.enabled.value ) {
				const factor = this.currencyStylingConfig.conversionRate.value
				if ( factor !== 1 ) fixed *= factor
			}
			// Limit at 15 decimals, as anything more causes issues with .toFixed
			if ( Math.abs( fixed ) < 1e-15 ) return '0'
			const original = fixed.toFixed( 15 )
			let [ integers, decimals ] = original.split( '.' )
			if ( integers === '0' || integers === '-0' ) {
				let i = 0
				while ( i < decimals.length && decimals[i] === '0' ) i++
				if ( i === decimals.length ) return '0'
				const toKeep = i + Math.min( 2, significant )
				const rounded = String( CurrencyAmount.round( decimals, toKeep ) )
				// If we rounded something like 0.999 we got 999, which rounded from 99.9 to 100
				const zeroes = rounded.length === toKeep - i
					? i
					: i - 1
				// In cases like 0.99 we have to round up to whole numbers
				if ( zeroes < 0 ) return `1.${ rounded.substr( 1 ) }`
				return `0.${ '0'.repeat( zeroes ) }${ rounded }`
			} else {
				const keep = fixed < 0
					? significant + 1
					: significant
				if ( keep > integers.length ) {
					const toKeep = Math.min( 2, keep - integers.length )
					let rounded = String( CurrencyAmount.round( decimals, toKeep ) )
					// Handle decimal overflow into integers
					if ( rounded.length > toKeep ) {
						rounded = rounded.substr( 1 )
						integers = String( Number( integers ) + 1 )
					}
					return rounded === '0'
						? integers
						: `${ integers }.${ rounded }`
				} else if ( keep === integers.length ) {
					return String( Math.round( Number( original ) ) )
				} else {
					return (
						CurrencyAmount.round( integers, keep ) +
						'0'.repeat( integers.length - keep )
					)
				}
			}
		} )
	}

	get displayValue(): string[] {
		const decimal = this.numberStylingConfig.decimal.value
		const thousands = this.numberStylingConfig.group.value
		return this.roundedAmount.map( ( roundedAmount ) => {
			const [ integers, digits ] = roundedAmount.split( '.' )
			const leftSide = integers.split( /(?=(?:.{3})*$)/ ).join( thousands )
			return leftSide +
			       ( digits
				       ? decimal + digits
				       : '' )
		} )
	}

	private static round( number: string, split: number ): number {
		const start = number.substr( 0, split )
		const digit = number[split] || 1
		return Math.round( Number( `${ start }.${ digit }` ) )
	}

	async convertTo( tag: string ): Promise<CurrencyAmount | null> {
		tag = tag.toUpperCase()
		const rate = await this.backendApi.rate( this.tag, tag )
		if ( !rate ) return null
		const amount = this.amount.map( e => e * rate.rate )
		return this.currencyAmount.create( {
			tag,
			amount,
		} )
	}

	toString(): string {
		const value = this.displayValue.join( ' - ' )

		const usingCustom = this.currencyStylingConfig.enabled.value
		if ( !usingCustom ) return `${ value } ${ this.tag }`

		const customTag = this.currencyStylingConfig.customDisplay.value
		return customTag.replace( '¤', value )
	}
}

export const CurrencyAmountDi = { currencyAmount: stateful( CurrencyAmount ) }
export type CurrencyAmountDiTypes = AsServices<typeof CurrencyAmountDi>