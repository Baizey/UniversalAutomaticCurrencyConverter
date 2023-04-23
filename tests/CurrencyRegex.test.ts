import { MockStrategy } from '@baizey/dependency-injection'
import { CurrencyRegex, RegexResult } from '../src/currencyConverter/Detection/CurrencyRegex'
import useMockContainer from './Container.mock'

describe( 'CurrencyRegex', () => {
	const tests = [
		{
			text: `$3.99`,
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: '$3.99',
					currencies: [ '$', '' ],
				},
				null,
			],
		},
		{
			text: `3.99`,
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: `3.99`,
					currencies: [ '', '' ],
				},
				null,
			],
		},
		{
			text: `$3.99 . $3.99`,
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: '$3.99 .',
					currencies: [ '$', '' ],
				},
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: ' $3.99',
					currencies: [ '$', '' ],
				},
				null,
			],
		},
		{
			text: `$3.99 $3.99`,
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: '$3.99 ',
					currencies: [ '$', '' ],
				},
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: ' $3.99',
					currencies: [ '$', '' ],
				},
				null,
			],
		},
		/* TODO: make this detect properly
		 {
		 text: `$3.99$3.99`, expect: [{
		 amounts: [{neg: '+', integer: '3', decimal: '99'}],
		 text: '$3.',
		 currencies: ['$', '$']
		 }, {
		 amounts: [{neg: '+', integer: '3', decimal: '99'}],
		 text: '.99',
		 currencies: ['$', '']
		 }, null]
		 },
		 */
		{
			text: `$3.99 - 3.99`,
			expect: [
				{
					amounts: [
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
					],
					text: '$3.99 - 3.99',
					currencies: [ '$', '' ],
				},
				null,
			],
		},
		{
			text: `$3.99-3.99`,
			expect: [
				{
					amounts: [
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
					],
					text: '$3.99-3.99',
					currencies: [ '$', '' ],
				},
				null,
			],
		},
		{
			text: `3.99-3.99`,
			expect: [
				{
					amounts: [
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
					],
					text: `3.99-3.99`,
					currencies: [ '', '' ],
				},
				null,
			],
		},
		{
			name: 'invis char',
			text: '‎$34.99',
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '34',
						decimal: '99',
					} ],
					text: '‎$34.99',
					currencies: [ '$', '' ],
				},
				null,
			],
		},
		{
			name: 'Space separated numerals',
			text: '2 499 000 USD',
			expect: [
				{
					text: '2 499 000 USD',
					amounts: [
						{
							integer: '2499000',
							decimal: '',
							neg: '+',
						},
					],
					currencies: [ '', 'USD' ],
				},
				null,
			],
		},
	]
	tests.forEach(
		( test: {
			name?: string;
			expect: ( { amounts: any; text: string; currencies: string[] } | null )[];
			text: string;
		} ) => {
			it( `${ test.name || test.text }`, async () => {
				// Setup
				const provider = useMockContainer( MockStrategy.realValue )
				await provider.activeLocalization.overload( { dollar: 'USD' } )
				const regex = new CurrencyRegex( test.text )

				// Act
				const actual: ( RegexResult | null )[] = []
				while ( actual.length < test.expect.length ) actual.push( regex.next() )

				// Assert
				for ( let i = 0; i < test.expect.length; i++ ) {
					if ( !test.expect[i] ) {
						expect( actual[i] ).toBeNull()
						continue
					}
					expect( actual[i]?.text ).toBe( test.expect[i]?.text )
					expect( actual[i]?.currencies ).toStrictEqual(
						test.expect[i]?.currencies,
					)
					expect( actual[i]?.amounts ).toStrictEqual( test.expect[i]?.amounts )
				}
			} )
		},
	)
} )
