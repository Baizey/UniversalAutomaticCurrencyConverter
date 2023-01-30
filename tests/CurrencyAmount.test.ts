import { MockStrategy } from 'sharp-dependency-injection'
import { CurrencyRate } from '../src/currencyConverter/BackendApi/CurrencyRate'
import { CurrencyAmount } from '../src/currencyConverter/Currency'
import { BrowserMock } from './Browser.mock'
import useMockContainer, { as } from './Container.mock'

describe( 'CurrencyAmount', () => {
	describe( 'Rounding', () => {
		const tests = [
			{
				input: 0,
				expect: '0',
				rounding: 1,
			},
			{
				input: 2,
				expect: '2',
				rounding: 1,
			},
			{
				input: 52.6,
				expect: '50',
				rounding: 1,
			},
			{
				input: 5.52,
				expect: '6',
				rounding: 1,
			},
			{
				input: 5.55,
				expect: '6',
				rounding: 1,
			},
			{
				input: 5489,
				expect: '5000',
				rounding: 1,
			},
			{
				input: 0.505,
				expect: '0.5',
				rounding: 1,
			},
			{
				input: 1e-15,
				expect: '0.000000000000001',
				rounding: 1,
			},
			{
				input: 1e-16,
				expect: '0',
				rounding: 1,
			},

			{
				input: 0.000001,
				expect: '0.0000010',
				rounding: 2,
			},
			{
				input: 0.0000001,
				expect: '0.00000010',
				rounding: 2,
			},
			{
				input: 0,
				expect: '0',
				rounding: 2,
			},
			{
				input: 2,
				expect: '2',
				rounding: 2,
			},
			{
				input: 7.467600002761219,
				expect: '7.5',
				rounding: 2,
			},
			{
				input: 52.6,
				expect: '53',
				rounding: 2,
			},
			{
				input: 5.52,
				expect: '5.5',
				rounding: 2,
			},
			{
				input: 5.55,
				expect: '5.6',
				rounding: 2,
			},
			{
				input: 5489,
				expect: '5500',
				rounding: 2,
			},
			{
				input: 0.505,
				expect: '0.51',
				rounding: 2,
			},

			{
				input: 0,
				expect: '0',
				rounding: 3,
			},
			{
				input: 52.6,
				expect: '52.6',
				rounding: 3,
			},
			{
				input: 5.52,
				expect: '5.52',
				rounding: 3,
			},
			{
				input: 5.55,
				expect: '5.55',
				rounding: 3,
			},
			{
				input: 5489,
				expect: '5490',
				rounding: 3,
			},
			{
				input: 0.505,
				expect: '0.51',
				rounding: 3,
			},
			{
				input: 0.00005555,
				expect: '0.000056',
				rounding: 3,
			},

			{
				input: 5.00000001,
				expect: '5',
				rounding: 5,
			},
			{
				input: 534848975435.5478,
				expect: '534848975400',
				rounding: 10,
			},
			{
				input: 11.11111111111111111,
				expect: '11.11',
				rounding: 10,
			},
			{
				input: 53448.5478,
				expect: '53448.55',
				rounding: 10,
			},
		]
		tests.forEach(
			( test: {
				input: number;
				expect: string | string[];
				rounding: number;
			} ) => {
				it( `Input: ${ test.input }, Expected: ${ test.expect }, Rounding: ${ test.rounding }`, () => {
					// Setup
					const {
						currencyAmount,
						numberStylingConfig,
					} = useMockContainer( {
						numberStylingConfig: MockStrategy.realValue,
						currencyStylingConfig: MockStrategy.realValue,
					} )
					numberStylingConfig.significantDigits.setValue( test.rounding )
					const amount = currencyAmount.create( {
						tag: 'EUR',
						amount: test.input,
					} )

					// Act
					const actual = amount.roundedAmount

					// Assert
					if ( !Array.isArray( test.expect ) ) test.expect = [ test.expect ]
					expect( actual.sort() ).toEqual( test.expect.sort() )
				} )
			},
		)
	} )
	describe( 'Converting', () => {
		const tests = [
			{
				amount: 1,
				expect: 1,
				rate: 1,
			},
			{
				amount: 1,
				expect: 2,
				rate: 2,
			},
			{
				amount: 1,
				expect: 1.5,
				rate: 1.5,
			},
			{
				amount: 1,
				expect: 0.5,
				rate: 0.5,
			},
			{
				amount: 2,
				expect: 1,
				rate: 0.5,
			},
			{
				amount: 1.5,
				expect: 1,
				rate: 0.6666666666666666,
			},
			{
				amount: 0.5,
				expect: 1,
				rate: 2,
			},
		]
		tests.forEach(
			( test: {
				amount: number | number[];
				expect: number | number[];
				rate: number;
			} ) => {
				it( `Input: ${ test.amount }, Expected: ${ test.expect }, Rate: ${ test.rate }`, async () => {
					// Setup
					const {
						browser,
						currencyAmount,
					} = useMockContainer( {
						backendApi: {
							rate: async ( from: string, to: string ) =>
								Promise.resolve( new CurrencyRate( from, to, test.rate, Date.now(), [] ) ),
						},
					}, MockStrategy.realValue )
					const mock = as<BrowserMock>( browser )
					mock.addRate( 'USD', 'EUR', test.rate )
					const original = currencyAmount.create( {
						tag: 'USD',
						amount: test.amount,
					} )

					// Act
					const actual = await original.convertTo( 'EUR' )

					// Assert
					if ( !actual ) return
					if ( !Array.isArray( test.amount ) ) test.amount = [ test.amount ]
					expect( original )
					expect( original.amount.sort() ).toEqual( test.amount.sort() )
					expect( original.tag ).toBe( 'USD' )

					if ( !Array.isArray( test.expect ) ) test.expect = [ test.expect ]
					expect( actual.amount.sort() ).toEqual( test.expect.sort() )
					expect( actual.tag ).toBe( 'EUR' )
				} )
			},
		)

		it( `Unknown currency`, async () => {
			// Setup
			const { currencyAmount } = useMockContainer( {
				backendApi: {
					rate: async () => Promise.resolve( null ),
				},
			}, MockStrategy.realValue )
			const original = currencyAmount.create( {
				tag: 'EUR',
				amount: 0,
			} )

			// Act
			const actual = await original.convertTo( 'UNK4' )

			// Assert
			expect( original.amount ).toStrictEqual( [ 0 ] )
			expect( original.tag ).toBe( 'EUR' )
			expect( actual ).toBe( null )
		} )
	} )
	describe( 'Display', () => {
		const tests = [
			{
				rounding: 1,
				amount: 0.099,
				currency: 'UNK',
				expect: '0.10 UNK',
			},
			{
				rounding: 1,
				amount: 0.99,
				currency: 'UNK',
				expect: '1.0 UNK',
			},
			{
				rounding: 2,
				amount: 0.0999,
				currency: 'UNK',
				expect: '0.100 UNK',
			},
			{
				rounding: 2,
				amount: 0.999,
				currency: 'UNK',
				expect: '1.00 UNK',
			},
			{
				rounding: 2,
				amount: 3.99,
				currency: 'UNK',
				expect: '4 UNK',
			},
			{
				rounding: 3,
				amount: 123,
				currency: 'UNK',
				expect: '123 UNK',
			},
			{
				rounding: 2,
				amount: 123,
				currency: 'UNK',
				expect: '120 UNK',
			},
			{
				rounding: 8,
				amount: 123.456,
				currency: 'UNK',
				expect: '123.46 UNK',
			},
			{
				rounding: 8,
				amount: 123456,
				currency: 'UNK',
				expect: '123 456 UNK',
			},
			{
				rounding: 8,
				amount: 123.456,
				currency: 'UNK',
				expect: '123,46 UNK',
				decimal: ',',
			},
			{
				rounding: 8,
				amount: 123456,
				currency: 'UNK',
				expect: '123.456 UNK',
				thousands: '.',
			},
			{
				rounding: 8,
				amount: 123456,
				currency: 'UNK',
				expect: 'a 123 456 a',
				using: true,
				tag: 'a ¤ a',
			},
			{
				rounding: 8,
				amount: 0.25,
				currency: 'UNK',
				expect: 'a 0.50 a',
				using: true,
				tag: 'a ¤ a',
				key: 2,
			},
		]
		tests.forEach(
			( test: {
				using?: boolean;
				rounding?: number;
				amount: number;
				currency: string;
				expect: string;
				decimal?: string;
				thousands?: string;
				tag?: string;
				key?: number;
				value?: number;
			} ) => {
				it( `Rounding: ${ test.rounding }, amount: ${ test.amount }, currency: ${ test.currency }, expect: ${ test.expect }`,
					async () => {
						// Setup
						const {
							numberStylingConfig,
							currencyStylingConfig,
							currencyAmount,
						} = useMockContainer( {
							numberStylingConfig: MockStrategy.realValue,
							currencyStylingConfig: MockStrategy.realValue,
							currencyLocalization: MockStrategy.realValue,
						} )
						numberStylingConfig.significantDigits.setValue( test.rounding )
						numberStylingConfig.decimal.setValue( test.decimal )
						numberStylingConfig.group.setValue( test.thousands )

						currencyStylingConfig.enabled.setValue( test.using )
						currencyStylingConfig.customDisplay.setValue( test.tag )
						currencyStylingConfig.conversionRate.setValue( test.key )

						const original = currencyAmount.create( {
							tag: test.currency,
							amount: test.amount,
						} )

						// Act
						const actual = original.toString()

						// Assert
						expect( actual ).toBe( test.expect )
					} )
			},
		)
	} )
} )
